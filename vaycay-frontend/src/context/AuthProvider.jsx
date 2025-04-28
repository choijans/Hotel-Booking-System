import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, setAuthToken } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token) {
        setAuthToken(token); // Set the token in Axios headers
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser)); // Set the user from localStorage
        }
      }
      setLoading(false); // Mark loading as complete
    };

    initializeAuth();
  }, []);

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null); 
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};