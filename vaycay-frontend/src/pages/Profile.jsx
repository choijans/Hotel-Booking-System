import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../api";
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("Profile"); // State to track selected section
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    payment_method: "",
    card_number: "",
  });
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const guest_id = localStorage.getItem("userId");
        if (!token || !guest_id) {
          navigate("/login");
          return;
        }

        // Fetch profile data using GET request
        const profileResponse = await hotelApi.get("/getguestdetails", {
          params: { guest_id: parseInt(guest_id) },
        });

        console.log("Profile Response:", profileResponse.data);

        if (profileResponse.data && profileResponse.data.guests_by_pk) {
          const profileData = profileResponse.data.guests_by_pk;
          setProfile({
            full_name: profileData.full_name || "",
            email: profileData.contact_info?.email || "",
            phone: profileData.contact_info?.phone || "",
            address: profileData.address || "",
            payment_method: profileData.payment_method || "",
            card_number: profileData.card_number || "",
          });

          // Extract bookings and transactions
          const bookingsData = profileData.bookings || [];
          setBookings(bookingsData);

          const paymentsData = bookingsData.flatMap((booking) => booking.payments || []);
          setTransactions(paymentsData);
        } else {
          throw new Error("Invalid profile response structure");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err.response?.data || err.message);
        setError("Failed to fetch profile data. Please try again.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-2/5 lg:w-2/5">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Profile</h2>
                <nav className="space-y-4">
                  <button
                    onClick={() => setSelectedSection("Profile")}
                    className={`block py-2 px-4 ${
                      selectedSection === "Profile" ? "bg-teal-100 text-teal-800" : "text-gray-700 hover:bg-gray-100"
                    } rounded-md font-medium`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setSelectedSection("Bookings")}
                    className={`block py-2 px-4 ${
                      selectedSection === "Bookings" ? "bg-teal-100 text-teal-800" : "text-gray-700 hover:bg-gray-100"
                    } rounded-md font-medium`}
                  >
                    Bookings
                  </button>
                  <button
                    onClick={() => setSelectedSection("Transaction History")}
                    className={`block py-2 px-4 ${
                      selectedSection === "Transaction History" ? "bg-teal-100 text-teal-800" : "text-gray-700 hover:bg-gray-100"
                    } rounded-md font-medium`}
                  >
                    Transaction History
                  </button>
                  <button
                    onClick={() => setSelectedSection("FAQs")}
                    className={`block py-2 px-4 ${
                      selectedSection === "FAQs" ? "bg-teal-100 text-teal-800" : "text-gray-700 hover:bg-gray-100"
                    } rounded-md font-medium`}
                  >
                    FAQs
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                    className="text-gray-700 hover:text-teal-600 px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/5 lg:w-3/5">
            {selectedSection === "Profile" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h1>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-gray-900">{profile.full_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                      <p className="mt-1 text-gray-900">{profile.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="mt-1 text-gray-900">{profile.address}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                      <p className="mt-1 text-gray-900">{profile.payment_method}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Card Number</h3>
                      <p className="mt-1 text-gray-900">{profile.card_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === "Bookings" && (
              <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Bookings</h2>
                  {bookings.length === 0 ? (
                    <p>No bookings found.</p>
                  ) : (
                    <ul className="space-y-4">
                      {bookings.map((booking) => (
                        <li key={booking.booking_id} className="border-b pb-4">
                          <p>Room ID: {booking.room_id}</p>
                          <p>Check-In: {booking.check_in_date}</p>
                          <p>Check-Out: {booking.check_out_date}</p>
                          <p>Status: {booking.status}</p>
                          <p>Total Amount: ₱{booking.total_amount}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {selectedSection === "Transaction History" && (
              <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h2>
                  {transactions.length === 0 ? (
                    <p>No transactions found.</p>
                  ) : (
                    <ul className="space-y-4">
                      {transactions.map((transaction) => (
                        <li key={transaction.payment_id} className="border-b pb-4">
                          <p>Payment ID: {transaction.payment_id}</p>
                          <p>Amount: ₱{transaction.amount}</p>
                          <p>Date: {transaction.payment_date}</p>
                          <p>Status: {transaction.payment_status}</p>
                          <p>Method: {transaction.payment_method}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {selectedSection === "FAQs" && (
              <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">FAQs</h2>
                  <p>Coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;