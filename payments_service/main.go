package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

const hasuraURL = "http://hasura:8080/v1/graphql"

type GraphQLRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables,omitempty"`
}

func executeGraphQLQuery(query GraphQLRequest, jwtToken string) ([]byte, error) {
	jsonData, err := json.Marshal(query)
	if err != nil {
		return nil, fmt.Errorf("error marshalling GraphQL request: %w", err)
	}

	req, err := http.NewRequest("POST", hasuraURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+jwtToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request to Hasura: %w", err)
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}

func extractToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", fmt.Errorf("missing Authorization token")
	}

	var token string
	fmt.Sscanf(authHeader, "Bearer %s", &token)
	if token == "" {
		return "", fmt.Errorf("invalid Authorization header format")
	}

	return token, nil
}

// Create Payment
func createPayment(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var paymentData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&paymentData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($paymentData: payments_insert_input!) {
			insert_payments_one(object: $paymentData) {
				payment_id
			}
		}`,
		Variables: map[string]interface{}{
			"paymentData": paymentData,
		},
	}

	body, err := executeGraphQLQuery(query, jwtToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

// Get Payment by ID
func getPayment(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	paymentID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid payment ID", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `query ($id: Int!) {
			payments_by_pk(payment_id: $id) {
				payment_id
				booking_id
				amount
				payment_method
				payment_status
				payment_date
			}
		}`,
		Variables: map[string]interface{}{
			"id": paymentID,
		},
	}

	body, err := executeGraphQLQuery(query, jwtToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

// Update Payment Status
func updatePayment(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	paymentID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid payment ID", http.StatusBadRequest)
		return
	}

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($id: Int!, $updateData: payments_set_input!) {
			update_payments_by_pk(pk_columns: {payment_id: $id}, _set: $updateData) {
				payment_id
			}
		}`,
		Variables: map[string]interface{}{
			"id":         paymentID,
			"updateData": updateData,
		},
	}

	body, err := executeGraphQLQuery(query, jwtToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

// Delete Payment
func deletePayment(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	paymentID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid payment ID", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($id: Int!) {
			delete_payments_by_pk(payment_id: $id) {
				payment_id
			}
		}`,
		Variables: map[string]interface{}{
			"id": paymentID,
		},
	}

	body, err := executeGraphQLQuery(query, jwtToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/payments", createPayment).Methods("POST")
	r.HandleFunc("/payments/{id}", getPayment).Methods("GET")
	r.HandleFunc("/payments/{id}", updatePayment).Methods("PUT")
	r.HandleFunc("/payments/{id}", deletePayment).Methods("DELETE")

	log.Println("Payment Service running on port 4003")
	log.Fatal(http.ListenAndServe(":4003", r))
}
