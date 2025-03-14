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

// GraphQLRequest represents a GraphQL query request
type GraphQLRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables,omitempty"`
}

// Executes a GraphQL query against Hasura
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

// Extract JWT token from request
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

// Create Guest
func createGuest(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var guestData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&guestData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($guestData: guests_insert_input!) {
			insert_guests_one(object: $guestData) {
				guest_id
			}
		}`,
		Variables: map[string]interface{}{
			"guestData": guestData,
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

// Get Guest by ID
func getGuestByID(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	guestID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid guest ID", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `query ($id: Int!) {
			guests_by_pk(guest_id: $id) {
				guest_id
				full_name
				birthdate
				contact_info
				address
				created_at
				updated_at
			}
		}`,
		Variables: map[string]interface{}{
			"id": guestID,
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

// Update Guest
func updateGuest(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	guestID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid guest ID", http.StatusBadRequest)
		return
	}

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($id: Int!, $updateData: guests_set_input!) {
			update_guests_by_pk(pk_columns: {guest_id: $id}, _set: $updateData) {
				guest_id
			}
		}`,
		Variables: map[string]interface{}{
			"id":         guestID,
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

// Delete Guest
func deleteGuest(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	guestID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid guest ID", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($id: Int!) {
			delete_guests_by_pk(guest_id: $id) {
				guest_id
			}
		}`,
		Variables: map[string]interface{}{
			"id": guestID,
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

// Get All Guests
func getAllGuests(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	query := GraphQLRequest{
		Query: `query {
			guests {
				guest_id
				full_name
				birthdate
				contact_info
				address
				created_at
				updated_at
			}
		}`,
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
	r.HandleFunc("/guests", createGuest).Methods("POST")
	r.HandleFunc("/guests/{id}", getGuestByID).Methods("GET")
	r.HandleFunc("/guests", getAllGuests).Methods("GET")
	r.HandleFunc("/guests/{id}", updateGuest).Methods("PUT")
	r.HandleFunc("/guests/{id}", deleteGuest).Methods("DELETE")

	log.Println("Guest Service running on port 4004")
	log.Fatal(http.ListenAndServe(":4004", r))
}
