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
  const handleCancelBooking = async (booking) => {
    if (booking.status !== "Pending") {
      alert("Only pending bookings can be canceled.");
      return;
    }
  
    if (!booking.room?.room_id) {
      alert("Room ID is missing. Cannot cancel this booking.");
      return;
    }
  
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel booking ID ${booking.booking_id}?`
    );
  
    if (!confirmCancel) {
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await hotelApi.post(
        "/updatebooking",
        {
          booking_id: booking.booking_id,
          room_id: booking.room.room_id,
          check_in_date: booking.check_in_date,
          check_out_date: booking.check_out_date,
          status: "Cancelled",
          total_amount: booking.total_amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data) {
        alert("Booking canceled successfully.");
        // Refresh bookings
        const guest_id = localStorage.getItem("userId");
        const updatedData = await hotelApi.get("/getguestdetails", {
          params: { guest_id: parseInt(guest_id) },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(updatedData.data.bookings || []);
      }
    } catch (err) {
      console.error("Error canceling booking:", err.response?.data || err.message);
      alert("Failed to cancel booking. Please try again.");
    }
  };
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="col-span-1">
            <div className="bg-white shadow-md rounded-2xl p-6 sticky top-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
              <nav className="flex flex-col space-y-3">
                {[
                  "Profile",
                  "Booking History",
                  "Transaction History",
                  "Change Password",
                  "Logout",
                ].map((section) => (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(section)}
                    className={`text-left px-4 py-2 rounded-lg transition-all font-medium ${
                      selectedSection === section
                        ? "bg-teal-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
  
          {/* Main Content */}
          <main className="col-span-2">
            {selectedSection === "Profile" && (
              <section className="bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Profile Information</h1>
                <div className="space-y-5">
                  {[
                    { label: "Full Name", value: profile.full_name },
                    { label: "Birth Date", value: profile.birthdate },
                    { label: "Contact Information", value: profile.phone },
                    { label: "Address", value: profile.address },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <h3 className="text-sm text-gray-500">{label}</h3>
                      <p className="text-base text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
  
  {selectedSection === "Booking History" && (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Booking History</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold text-gray-800">Booking #{booking.booking_id}</div>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    booking.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking.status === "Confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Check-In:</span>{" "}
                  {new Date(booking.check_in_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Check-Out:</span>{" "}
                  {new Date(booking.check_out_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Total Amount:</span> ₱{booking.total_amount.toFixed(2)}
                </div>
              </div>

              {booking.status === "Pending" && (
                <div className="mt-4 text-right">
                  <button
                    onClick={() => handleCancelBooking(booking)}
                    className="bg-red-600 text-white py-1.5 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

  
{selectedSection === "Transaction History" && (
  <section className="bg-white shadow-md rounded-2xl p-6">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Transaction History</h2>
    {transactions.length === 0 ? (
      <p className="text-gray-600">No transactions found.</p>
    ) : (
      <ul className="space-y-4">
        {transactions.map((t) => (
          <li
            key={t.payment_id}
            className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-800">Payment ID:</span> {t.payment_id}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Amount:</span> ₱{t.amount}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Date:</span>{" "}
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(t.payment_date))}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Method:</span> {t.payment_method}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Status:</span>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.payment_status === "Complete"
                      ? "bg-green-100 text-green-700"
                      : t.payment_status === "Failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t.payment_status}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
)}

  
            {selectedSection === "Change Password" && (
              <section className="bg-white shadow-md rounded-2xl p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h1>
                <form onSubmit={handleChangePassword} className="space-y-5">
                  {[
                    { label: "Old Password", id: "oldPassword", value: oldPassword, setter: setOldPassword },
                    { label: "New Password", id: "newPassword", value: newPassword, setter: setNewPassword },
                    { label: "Confirm New Password", id: "confirmPassword", value: confirmPassword, setter: setConfirmPassword },
                  ].map(({ label, id, value, setter }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                        {label}
                      </label>
                      <input
                        type="password"
                        id={id}
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  ))}
                  {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                  {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
                  >
                    {passwordLoading ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </section>
            )}
  
            {selectedSection === "Logout" && (
              <section className="bg-white shadow-md rounded-2xl p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Logout</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Confirm Logout
                </button>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
export default Profile;  