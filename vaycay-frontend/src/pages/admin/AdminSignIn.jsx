import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImage from "../../assets/logo.png"; // Assuming you have a logo image

const AdminSignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make API call to authenticate admin
      const response = await axios.post(
        "http://localhost:8080/api/rest/adminlogin",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": "supersecureadminsecret",
          },
        }
      );

      console.log("Login response:", response.data);

      // Check if login was successful
      if (response.data.success) {
        // Store admin token in localStorage
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminInfo", JSON.stringify(response.data.adminInfo));
        
        // Redirect to admin dashboard
        navigate("/admin/dashboard");
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Failed to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/src/assets/bgbg.jpg')`,
        backgroundSize: 'cover', // Adjust the size of the background image
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

        <form onSubmit={handleSubmit}>
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
              value={formData.username}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
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