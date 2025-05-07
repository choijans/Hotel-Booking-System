import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { hotelApi, authApi } from "../api"; // Import authApi for API calls
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSection, setSelectedSection] = useState("Profile"); // State to track selected section
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [transactions, setTransactions] = useState([]); // Payments for Transaction History
  const [bookings, setBookings] = useState([]); // Bookings for Booking History
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Change Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

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
          const { guests_by_pk, payments, bookings } = profileResponse.data;

          if (guests_by_pk) {
            setProfile({
              full_name: guests_by_pk.full_name || "",
              email: guests_by_pk.contact_info?.email || "",
              birthdate: guests_by_pk.birthdate || "",
              phone: guests_by_pk.contact_info?.phone || "",
              address: guests_by_pk.address || "",
            });
          }

          // Set transactions to payments
          setTransactions(payments || []);

          // Set bookings
          setBookings(bookings || []);
        } else {
          throw new Error("Invalid profile response structure");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err.response?.data || err.message || err);

        // Gracefully handle missing fields
        setError("Failed to fetch profile data. Please try again.");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  useEffect(() => {
    // Check if a specific tab is passed in the query parameters
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setSelectedSection(tab);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      setPasswordLoading(true);
      const token = localStorage.getItem("token");
      const response = await authApi.post(
        "/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPasswordSuccess(response.data.message || "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

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
                    onClick={() => setSelectedSection("Booking History")}
                    className={`block py-2 px-4 ${
                      selectedSection === "Booking History" ? "bg-teal-100 text-teal-800" : "text-gray-700 hover:bg-gray-100"
                    } rounded-md font-medium`}
                  >
                    Booking History
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
                    onClick={() => setSelectedSection("Change Password")}
                    className={`block py-2 px-4 ${
                      selectedSection === "Change Password" ? "bg-teal-100 text-teal-800" : "text-gray-700 hover:bg-gray-100"
                    } rounded-md font-medium`}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => setSelectedSection("Logout")}
                    className={`block py-2 px-4 ${
                      selectedSection === "Logout" ? "bg-teal-100 text-teal-800" : "text-gray-700 hover:bg-gray-100"
                    } rounded-md font-medium`}
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
                  <h1 className="text-2xl font-bold text-gray-800">Profile Information</h1>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-gray-900">{profile.full_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Birth Date</h3>
                      <p className="mt-1 text-gray-900">{profile.birthdate}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
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

            {selectedSection === "Booking History" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Booking History</h2>
                  {bookings.length === 0 ? (
                    <p>No bookings found.</p>
                  ) : (
                    <ul className="space-y-4">
                      {bookings.map((booking) => (
                        <li key={booking.booking_id} className="border-b pb-4">
                          <p>Booking ID: {booking.booking_id}</p>
                          <p>Check-In: {booking.check_in_date}</p>
                          <p>Check-Out: {booking.check_out_date}</p>
                          <p>Total Amount: ₱{booking.total_amount}</p>
                          <p>Status: {booking.status}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {selectedSection === "Transaction History" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
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

            {selectedSection === "Change Password" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h1>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                        Old Password
                      </label>
                      <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                    {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
                    >
                      {passwordLoading ? "Changing Password..." : "Change Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {selectedSection === "Logout" && (
              <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Logout</h2>
                  <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                  >
                    Confirm Logout
                  </button>
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