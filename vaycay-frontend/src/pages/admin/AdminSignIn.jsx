import { useState } from "react";
import { authApi, setAuthToken } from "../../api"; // Use the same API setup as Login.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider"; // Import useAuth
import logoImage from "../../assets/logo.png"; // Assuming you have a logo image

const AdminSignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); // Access setCurrentUser from useAuth

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Make API call to authenticate admin
      const res = await authApi.post("/login", { username, password });
      console.log("Admin Login response:", res.data);

      // Check if the user has an admin role
      if (res.data.user.role === "admin") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminInfo", JSON.stringify(res.data.user));
        setCurrentUser(res.data.user); // Update the currentUser in the AuthProvider context

        console.log("Redirecting to /admin/dashboard");
        navigate("/admin/dashboard");
      } else {
        // If the user is not an admin, show an error
        setError("Access denied. Only admins can sign in here.");
      }
    } catch (err) {
      console.error("Admin Login error:", err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/src/assets/bgbg.jpg')`,
        backgroundSize: "cover", // Adjust the size of the background image
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          {/* Logo image */}
          <img src={logoImage} alt="Logo" className="h-16 mb-4" />
          <h1 className="text-2xl font-bold text-teal-600">Admin Sign In</h1>
          <p className="text-gray-600 text-sm">Enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-teal-600 hover:underline text-sm">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;