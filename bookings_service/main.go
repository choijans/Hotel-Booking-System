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

// Create Booking
func createBooking(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var bookingData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&bookingData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($bookingData: bookings_insert_input!) {
			insert_bookings_one(object: $bookingData) {
				booking_id
			}
		}`,
		Variables: map[string]interface{}{
			"bookingData": bookingData,
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

// Get Booking by ID
func getBooking(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	bookingID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid booking ID", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `query ($id: Int!) {
			bookings_by_pk(booking_id: $id) {
				booking_id
				guest_id
				room_id
				check_in_date
				check_out_date
				status
			}
		}`,
		Variables: map[string]interface{}{
			"id": bookingID,
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

// Update Booking
func updateBooking(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	bookingID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid booking ID", http.StatusBadRequest)
		return
	}

	var updateData map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateData); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($id: Int!, $updateData: bookings_set_input!) {
			update_bookings_by_pk(pk_columns: {booking_id: $id}, _set: $updateData) {
				booking_id
			}
		}`,
		Variables: map[string]interface{}{
			"id":         bookingID,
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

// Delete Booking
func deleteBooking(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	bookingID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid booking ID", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($id: Int!) {
			delete_bookings_by_pk(booking_id: $id) {
				booking_id
			}
		}`,
		Variables: map[string]interface{}{
			"id": bookingID,
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

// Get All Bookings
func getAllBookings(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	query := GraphQLRequest{
		Query: `query {
			bookings {
				booking_id
				guest_id
				room_id
				check_in_date
				check_out_date
				status
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
	r.HandleFunc("/bookings", createBooking).Methods("POST")
	r.HandleFunc("/bookings/{id}", getBooking).Methods("GET")
	r.HandleFunc("/bookings", getAllBookings).Methods("GET")
	r.HandleFunc("/bookings/{id}", updateBooking).Methods("PUT")
	r.HandleFunc("/bookings/{id}", deleteBooking).Methods("DELETE")

	log.Println("Bookings Service running on port 4002")
	log.Fatal(http.ListenAndServe(":4002", r))
}
