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
    <div className="min-h-screen flex items-center justify-center bg-FFFDF7">
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



// // AdminSignIn.jsx
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const AdminSignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null); // Reset any previous error

//     try {
//       const response = await axios.post("http://localhost:8080/api/rest/adminsignin", {
//         email,
//         password,
//       });

//       if (response.data.success) {
//         // On successful login, redirect to the admin dashboard
//         navigate("/admin/dashboard");
//       } else {
//         setError("Invalid credentials. Please try again.");
//       }
//     } catch (err) {
//       setError("Error signing in. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-FFFDF7">
//       <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-teal-600">Admin Sign In</h2>

//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-600">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="w-full p-2 mt-1 border border-gray-300 rounded-md"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-600">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="w-full p-2 mt-1 border border-gray-300 rounded-md"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-teal-600 text-white py-2 rounded-md"
//             disabled={loading}
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminSignIn;
