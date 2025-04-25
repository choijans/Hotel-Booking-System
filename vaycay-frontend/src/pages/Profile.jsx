import React from "react";
import { useAuth } from "../context/AuthProvider"; 
import { Link } from "react-router-dom";

const Profile = () => {
  const { logout } = useAuth();
  //static for now
  const user = {
    email: "summiderama@gmail.com",
    phone: "09453453453",
    address: "University of San Carlos - Talamban\nCebu City, Cebu",
    payment_method: "Mastercard",
    card_number: "7************3"
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/"; 
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">

          <div className="w-full md:w-2/5 lg:w-2/5">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Profile</h2>
                <nav className="space-y-4">
                  <Link 
                    to="/profile" 
                    className="block py-2 px-4 bg-teal-100 text-teal-800 rounded-md font-medium"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/bookings" 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Bookings
                  </Link>
                  <Link 
                    to="/transactions" 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Transaction History
                  </Link>
                  <Link 
                    to="/contactUs" 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Contact Support
                  </Link>
                  <Link 
                    to="/faqs" 
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    FAQs
                  </Link>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium">
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Right Content - 60% width */}
          <div className="w-full md:w-3/5 lg:w-3/5">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h1>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                  
                  {/* Contact Number */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                    <p className="mt-1 text-gray-900">{user.phone}</p>
                  </div>
                  
                  {/* Address */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1 text-gray-900 whitespace-pre-line">{user.address}</p>
                  </div>
                  
                  {/* Password */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Password</h3>
                    <p className="mt-1 text-gray-900">***********</p>
                    <button className="mt-2 text-sm text-white-600 hover:text-white-700">
                      Change Password
                    </button>
                  </div>
                  
                  {/* Payment Method */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                    <p className="mt-1 text-gray-900 flex items-center">
                      <span className="mr-2">📞</span>
                      {user.payment_method}
                    </p>
                  </div>
                  
                  {/* Card Number */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Card Number</h3>
                    <p className="mt-1 text-gray-900">{user.card_number}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;