import { useState } from "react";
import { authApi, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.post("/login", { username, password });
      console.log("Login response:", res.data);

      // Save token and user details in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setCurrentUser(res.data.user);

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "user") {
        navigate("/dashboard");
      } else {
        setError("Invalid role. Please contact support.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="min-h-screen bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/src/assets/bgbg.jpg')`,
        backgroundSize: "100%",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <img className="h-16 w-auto" src="/src/assets/logo.png" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mt-2">Login</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-center">
                <a
                  href="/forgot-password"
                  className="text-sm text-teal-600 hover:text-blue-500"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600"
              >
                LOGIN
              </button>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-medium text-teal-600 hover:text-blue-500"
                >
                  Sign Up
                </a>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;