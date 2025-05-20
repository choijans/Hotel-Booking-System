import { useState } from "react";
import { authApi } from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.post("/register", { username, password, role });
      const { token, user } = response.data;
      localStorage.setItem("token", token); 
      localStorage.setItem("userId", user.id);
      navigate("/guest_profile"); 
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-center bg-no-repeat" 
         style={{ 
           backgroundImage: `url('/src/assets/bgbg.jpg')`,
           backgroundSize: '100%'
         }}>

      {/* <nav className="bg-transparent absolute top-0 left-0 right-0 z-10">
        <div className="max-w-9xl px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between h-16 items-center">
            
            <div className="flex-shrink-0 flex items-center">
              <img className="h-14 w-auto" src="/src/assets/logo.png" alt="Vacay Logo"/>
            </div>
            
            
            <div className="hidden md:flex space-x-8">
              <a href="/hotels" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Recommended Hotels</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">About us</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Contact</a>
              <a href="/login" className="bg-white text-teal-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-600 hover:text-white">Login</a>
              <a href="/signup" className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-teal-600">Sign Up</a>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Registration Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]"> {/* pt-16 to account for navbar height */}
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"> {/* Added mx-4 for mobile spacing */}
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <img className="h-16 w-auto" src="/src/assets/logo.png" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mt-2">Register</h2>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* <div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div> */}
              
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Register
              </button>
              
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
            
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/login")} 
                className="text-teal-600 hover:text-teal-500"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default Register;
