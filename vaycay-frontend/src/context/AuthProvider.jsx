import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    try {
      // 1. Perform login request
      const loginRes = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!loginRes.ok) {
        throw new Error(loginRes.status === 401 
          ? "Invalid credentials" 
          : "Login failed");
      }

      // 2. Get token from response
      const { token } = await loginRes.json();
      localStorage.setItem("token", token);

      // 3. Immediately validate token and get user data
      const userRes = await fetch("http://localhost:4000/validate", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) {
        localStorage.removeItem("token");
        throw new Error("Session validation failed");
      }

      const userData = await userRes.json();
      
      // 4. Format and store user data
      const user = {
        id: userData.sub,
        role: userData["x-hasura-role"],
        // Add any other user fields you need
      };

      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user); // Critical state update
      return user;

    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Check authentication state on initial load
  useEffect(() => {
    const validateSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token) {
          throw new Error("No token found");
        }

        // Validate token with backend
        const res = await fetch("http://localhost:4000/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Invalid token");
        }

        const userData = await res.json();
        const user = {
          id: userData.sub,
          role: userData["x-hasura-role"],
        };

        // Only update if different from current state
        if (JSON.stringify(user) !== JSON.stringify(currentUser)) {
          setCurrentUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        }

      } catch (error) {
        console.error("Session validation error:", error);
        logout(); // Clean up invalid session
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser,
        loading,
        login,
        logout,
        setCurrentUser // Only include if you need it elsewhere
      }}
    >
      {children}
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