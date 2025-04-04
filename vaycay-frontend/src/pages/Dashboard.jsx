import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";


const Dashboard = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // Or useContext if stored elsewhere
        const response = await fetch("http://localhost:4000/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    if (currentUser) fetchUser();
  }, [currentUser]);

  const handleLogout = () => {
    setAuthToken(null);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      {/* <nav className="bg-beige-600 shadow-md">
        <div className="py-4 pl-12 pr-4 sm:pl-16 sm:pr-6 lg:pl-24 lg:pr-8 bg-beige-600 text-left">
          <div className="flex justify-between h-16 items-center">
            
            <div className="flex-shrink-0 flex items-center">
              <img className="h-16 w-auto" src="/src/assets/logo.png" alt="Vacay Logo" />
            </div>
            
            
            <div className="hidden md:flex space-x-8">
              <a href="/hotels" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">Recommended Hotels</a>
              <a href="/about" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">About us</a>
              <a href="/contact" className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">Contact</a>
              <button onClick={handleLogout} className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">Logout</button>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <div className="py-12 pl-12 pr-4 sm:pl-16 sm:pr-6 lg:pl-24 lg:pr-8 bg-beige-600 text-left">
        {/* First Line */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Your Hotel.
        </h1>
        
        {/* Second Line with "Your" text and "Vacation" image */}
        <div className="flex items-center mb-6">
          <span className="text-4xl font-bold text-gray-900 mr-2">Your</span>
          <img 
            src="/src/assets/Vacation..png" 
            alt="Vacation" 
            className="h-16 w-auto" // Adjust height to match your design
          />
        </div>

        {/* Paragraph with line break */}
        <p className="text-xl text-gray-600 mb-8 max-w-lg">
          We have over 240+ hotels waiting to give<br />
          you the best vacation ever.
        </p>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button className="bg-teal-600 text-white px-8 py-4 rounded-md text-base font-medium hover:bg-teal-700">
            Explore Rooms
          </button>
          <button className="bg-transparent text-teal-600 px-8 py-4 rounded-md text-base font-medium hover:bg-gray-100 border-2 border-teal-600">
            Learn More
          </button>
        </div>
      </div>

      {/* What is Vacay Section */}
      <div className="relative py-12 pl-12 pr-4 sm:pl-16 sm:pr-6 lg:pl-24 lg:pr-8 text-left">
      {/* Semi-transparent background image only */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-50"
        style={{
          backgroundImage: `url('/src/assets/bgbg.jpg')`
        }}
      ></div>
        <div className=" max-w-lg text-left relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What is Vacay?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Vacay is a modern hotel booking platform designed to make finding the perfect accommodation simple and stress-free. With over 240+ carefully selected hotels worldwide, we connect travelers with exceptional stays at competitive prices.
            <br /><br />
            Our intelligent matching system considers your preferences, budget, and travel style to recommend hotels that truly match what you're looking for, saving you hours of searching and comparing.
          </p>
          <button className="bg-teal-600 text-white px-8 py-4 rounded-md text-base font-medium hover:bg-teal-700">
            Connect with Us
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-teal-600">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-white">240+</p>
            <p className="text-white">Premium Hotels</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">100+</p>
            <p className="text-white">Destinations</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">15K+</p>
            <p className="text-white">Happy Customers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">4.8</p>
            <p className="text-white">Average Rating</p>
          </div>
        </div>
      </div>

      <div className="relative py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('/src/assets/leftbg.jpg')` }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-30 z-1"></div>
        <div className="relative z-10 max-w-7xlmx-auto px-12 sm:px-16 lg:px-24">
          <div className="text-right">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Discover Your Perfect Stay?</h2>
            <p className="text-xl text-white mb-8 ">
              Join thousands of travelers who find their ideal<br />
              accommodations through Vacay. Sign up today and<br />
              get ₱300 off your first booking!
            </p>
            <button className="bg-white text-teal-600 px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-100">
              Explore Rooms
            </button>
          </div>
        </div>
      </div>

      {/* User Debug Section */}
      {/* <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
        <div className="bg-white p-4 rounded shadow">
          <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div> */}
    </div>
  );
};


export default Dashboard;