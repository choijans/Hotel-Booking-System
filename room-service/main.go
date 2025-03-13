package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

const hasuraURL = "http://hasura:8080/v1/graphql"

type GraphQLRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables,omitempty"`
}

// Updated Room Struct
type Room struct {
	ID          int       `json:"room_id"`
	Number      string    `json:"room_number"`
	TypeID      int       `json:"type_id"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	Availability bool     `json:"availability"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
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

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("GraphQL request failed with status %d: %s", resp.StatusCode, string(body))
	}

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

// Get all rooms
func getRooms(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	query := GraphQLRequest{
		Query: `{ rooms { room_id room_number type_id description price availability status created_at updated_at } }`,
	}

	body, err := executeGraphQLQuery(query, jwtToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}

// Get a single room by ID
func getRoomByID(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	roomID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid room ID", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `query ($room_id: Int!) { rooms(where: {room_id: {_eq: $room_id}}) { room_id room_number type_id description price availability status created_at updated_at } }`,
		Variables: map[string]interface{}{
			"room_id": roomID,
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

// Create a new room
func createRoom(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var room Room
	if err := json.NewDecoder(r.Body).Decode(&room); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($room_number: String!, $type_id: Int!, $description: String, $price: numeric, $availability: Boolean, $status: String) {
			insert_rooms_one(object: {room_number: $room_number, type_id: $type_id, description: $description, price: $price, availability: $availability, status: $status}) {
				room_id room_number type_id description price availability status created_at updated_at
			}
		}`,
		Variables: map[string]interface{}{
			"room_number":  room.Number,
			"type_id":      room.TypeID,
			"description":  room.Description,
			"price":        room.Price,
			"availability": room.Availability,
			"status":       room.Status,
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

// Update room availability and status
func updateRoomStatus(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	roomID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid room ID", http.StatusBadRequest)
		return
	}

	var payload struct {
		Availability bool   `json:"availability"`
		Status       string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($room_id: Int!, $availability: Boolean, $status: String) {
			update_rooms(where: {room_id: {_eq: $room_id}}, _set: {availability: $availability, status: $status}) {
				affected_rows
			}
		}`,
		Variables: map[string]interface{}{
			"room_id":      roomID,
			"availability": payload.Availability,
			"status":       payload.Status,
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

// Delete a room
func deleteRoom(w http.ResponseWriter, r *http.Request) {
	jwtToken, err := extractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	roomID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid room ID", http.StatusBadRequest)
		return
	}

	query := GraphQLRequest{
		Query: `mutation ($room_id: Int!) {
			delete_rooms(where: {room_id: {_eq: $room_id}}) {
				affected_rows
			}
		}`,
		Variables: map[string]interface{}{
			"room_id": roomID,
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
	r.HandleFunc("/rooms", getRooms).Methods("GET")
	r.HandleFunc("/rooms/{id}", getRoomByID).Methods("GET")
	r.HandleFunc("/rooms", createRoom).Methods("POST")
	r.HandleFunc("/rooms/{id}", updateRoomStatus).Methods("PUT")
	r.HandleFunc("/rooms/{id}", deleteRoom).Methods("DELETE")

	log.Println("Room Service running on port 4001")
	log.Fatal(http.ListenAndServe(":4001", r))
}
