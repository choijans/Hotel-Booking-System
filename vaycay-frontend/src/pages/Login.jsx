import { useState } from "react";
import { authApi, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

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
  
      setAuthToken(res.data.token); // Set the token in Axios and localStorage
      setCurrentUser(res.data.user); // Set the user details in context
      localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user details in localStorage
  
      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard"); // Redirect admins
      } else {
        navigate("/dashboard"); // Redirect regular users
      }

    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    //BACKGROUND IMAGE TENTATIVE
    <div className="min-h-screen bg-center bg-no-repeat" 
     style={{ 
       backgroundImage: `url('/src/assets/bgbg.jpg')`,
       backgroundSize: '100%' // Adjust percentage as needed
     }}>
      
      {/* <nav className="bg-transparent absolute top-0 left-0 right-0 z-10">
        <div className="max-w-9xl px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between h-16 items-center">
            
            <div className="flex-shrink-0 flex items-center" >
            <img className="h-14 w-auto" src="/src/assets/logo.png"/>
            </div>
            
            
            <div className="hidden md:flex space-x-8">
              <a href="/hotels" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Recommended Hotels</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">About us</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Contact</a>
              <a href="/login" className="bg-white text-teal-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-600 hover:text-white">Login</a>
              <a href="/register" className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-teal-600">Sign Up</a>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Login Form */}
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
              {/* <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label> */}
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
              {/* <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label> */}
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
              <a href="/forgot-password" className="text-sm text-teal-600 hover:text-blue-500">Forgot Password?</a>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600"
            >
              LOGIN
            </button>
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-teal-600 hover:text-blue-500">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
