import axios from "axios";

// Base URL for the authentication service
const AUTH_API_BASE_URL = "http://localhost:4000";

// Base URL for the hotel booking service
const HOTEL_API_BASE_URL = "http://localhost:8080/api/rest";

// Axios instance for authentication-related requests
export const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios instance for hotel booking-related requests
export const hotelApi = axios.create({
  baseURL: HOTEL_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set auth token for protected routes
export const setAuthToken = (token) => {
  if (token) {
    authApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    hotelApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Authorization header set:", token); // Debug log
    localStorage.setItem("token", token);
  } else {
    delete authApi.defaults.headers.common["Authorization"];
    delete hotelApi.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};