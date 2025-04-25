import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png"; 

const UserDetails = () => {
  const { guest_id } = useParams(); // Get guest_id from the URL
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch guest details
        const guestDetailsResponse = await axios.get("http://localhost:8080/api/rest/getguestdetails", {
          params: { guest_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });

        // Fetch guest bookings
        const guestBookingsResponse = await axios.get("http://localhost:8080/api/rest/getguestbookings", {
          params: { guest_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });

        
        console.log("Guest Details Response:", guestDetailsResponse.data);
        console.log("Guest Bookings Response:", guestBookingsResponse.data);

        // Combine data
        setUserDetails(guestDetailsResponse.data?.guests_by_pk || {}); // Default to an empty object
        setBookings(guestBookingsResponse.data?.bookings || []); // Default to an empty array
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user details. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [guest_id]);

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">

      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="flex items-center space-x-2 mb-4"
      >
        <img src={backIcon} alt="Back"  />
        <span className=" hover:underline">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-teal-600">User Details</h1>

      {loading ? (
        <p className="text-teal-600 mt-4">Loading user details...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <div>
          {/* User Information */}
          <div className="mt-4">
            <h2 className="text-xl font-bold">Personal Information</h2>
            <p>Full Name: {userDetails.full_name}</p>
            <p>Contact Info: {JSON.stringify(userDetails.contact_info)}</p>
            <p>Address: {userDetails.address}</p>
          </div>

          {/* User Bookings */}
          <div className="mt-8">
            <h2 className="text-xl font-bold">Bookings</h2>
            <table className="w-full bg-white shadow-md rounded-lg mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Booking ID</th>
                  <th className="px-4 py-2 text-left">Room ID</th>
                  <th className="px-4 py-2 text-left">Check-In</th>
                  <th className="px-4 py-2 text-left">Check-Out</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Total Amount</th>
                  <th className="px-4 py-2 text-left">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td className="px-4 py-2">{booking.booking_id}</td>
                    <td className="px-4 py-2">{booking.room_id}</td>
                    <td className="px-4 py-2">{booking.check_in_date}</td>
                    <td className="px-4 py-2">{booking.check_out_date}</td>
                    <td className="px-4 py-2">{booking.status}</td>
                    <td className="px-4 py-2">₱{booking.total_amount}</td>
                    <td className="px-4 py-2">{booking.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;