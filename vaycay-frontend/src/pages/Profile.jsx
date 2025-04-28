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

        // Fetch all data using GET request
        const profileResponse = await hotelApi.get("/getguestdetails", {
          params: { guest_id: parseInt(guest_id) },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileResponse.data) {
          const { guests_by_pk, bookings, payments } = profileResponse.data;

          if (guests_by_pk) {
            setProfile({
              full_name: guests_by_pk.full_name || "",
              email: guests_by_pk.contact_info?.email || "",
              phone: guests_by_pk.contact_info?.phone || "",
              address: guests_by_pk.address || "",
            });
          }

          if (bookings) {
            // Associate payments with bookings using booking_id
            const bookingsWithPayments = bookings.map((booking) => ({
              ...booking,
              payments: payments.filter((payment) => payment.booking_id === booking.booking_id),
            }));
            setBookings(bookingsWithPayments);
          }

          // Set transactions if payments exist
          setTransactions(payments || []);
        } else {
          throw new Error("Invalid profile response structure");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err.response?.data || err.message || err);

        // Gracefully handle missing fields
        if (err.response?.data?.code === "validation-failed") {
          setError("Some data could not be loaded, but the rest is displayed.");
          setTransactions([]); // Fallback to empty transactions
        } else {
          setError("Failed to fetch profile data. Please try again.");
        }

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
                          <p>Check-In: {booking.check_in_date}</p>
                          <p>Check-Out: {booking.check_out_date}</p>
                          <p>Status: {booking.status}</p>
                          <p>Total Amount: ₱{booking.total_amount}</p>
                          {booking.payments && booking.payments.length > 0 && (
                            <div className="mt-4">
                              <h3 className="text-sm font-medium text-gray-500">Payments</h3>
                              <ul className="space-y-2">
                                {booking.payments.map((payment) => (
                                  <li key={payment.payment_id}>
                                    <p>Payment ID: {payment.payment_id}</p>
                                    <p>Amount: ₱{payment.amount}</p>
                                    <p>Date: {payment.payment_date}</p>
                                    <p>Status: {payment.payment_status}</p>
                                    <p>Method: {payment.payment_method}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
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
                      {transactions
                        .filter((transaction) => transaction.guest_id === parseInt(localStorage.getItem("userId")))
                        .map((transaction) => (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;