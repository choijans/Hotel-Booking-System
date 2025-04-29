import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const HotelDetails = () => {
  const { hotel_id } = useParams(); // Get hotel_id from the URL
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState(null);
  const [activeTab, setActiveTab] = useState("rooms"); // Default tab is "rooms"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/gethoteldata", {
          params: { hotel_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });

        console.log("Hotel Data Response:", response.data);
        setHotelData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch hotel data. Please try again later.");
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotel_id]);

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="flex items-center space-x-2 mb-4"
      >
        <img src={backIcon} alt="Back" />
        <span className="hover:underline">Back</span>
      </button>

      <div className="flex">
        <h1 className="text-2xl font-bold text-teal-600">Hotel Details</h1>
        <button
          onClick={() => navigate(`/admin/hotels/${hotel_id}/edit`)} // Redirect to EditHotel page
          className="ml-4"
        >
          <img src="/src/assets/edit.png" alt="Edit" className="w-6 h-6" />
        </button>
      </div>
      {loading ? (
        <p className="text-teal-600 mt-4">Loading hotel details...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <div>
          {/* Hotel Information */}
          <div className="mt-4">
            <p><strong>Hotel Name:</strong> {hotelData.hotels_by_pk.hotel_name}</p>
            <p><strong>Description:</strong> {hotelData.hotels_by_pk.description}</p>
            <p><strong>Location:</strong> {hotelData.hotels_by_pk.location.location_name}</p>
            <p><strong>Location Description:</strong> {hotelData.hotels_by_pk.location.description}</p>
          </div>

          {/* Tab Bar */}
          <div className="mt-8">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "rooms" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("rooms")}
              >
                Rooms
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "bookings" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("bookings")}
              >
                Bookings
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "rooms" && (
              <div className="mt-4">
                <h2 className="text-xl font-bold">Rooms</h2>
                <table className="w-full bg-white shadow-md rounded-lg mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Room Number</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Price</th>
                      <th className="px-4 py-2 text-left">Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelData.hotels_by_pk.rooms.map((room) => (
                      <tr key={room.room_id}>
                        <td className="px-4 py-2">{room.room_number}</td>
                        <td className="px-4 py-2">{room.room_type.type_name}</td>
                        <td className="px-4 py-2">₱{room.price}</td>
                        <td className="px-4 py-2">{room.availability ? "Available" : "Not Available"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="mt-4">
                <h2 className="text-xl font-bold">Bookings</h2>
                <table className="w-full bg-white shadow-md rounded-lg mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Booking ID</th>
                      <th className="px-4 py-2 text-left">Guest ID</th>
                      <th className="px-4 py-2 text-left">Room Number</th>
                      <th className="px-4 py-2 text-left">Check-In</th>
                      <th className="px-4 py-2 text-left">Check-Out</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelData.bookings.map((booking) => (
                      <tr key={booking.booking_id}>
                        <td className="px-4 py-2">{booking.booking_id}</td>
                        <td className="px-4 py-2">{booking.guest_id}</td>
                        <td className="px-4 py-2">{booking.room.room_number}</td>
                        <td className="px-4 py-2">{booking.check_in_date}</td>
                        <td className="px-4 py-2">{booking.check_out_date}</td>
                        <td className="px-4 py-2">{booking.status}</td>
                        <td className="px-4 py-2">₱{booking.total_amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;