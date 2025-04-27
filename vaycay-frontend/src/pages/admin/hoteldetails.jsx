import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const HotelDetails = () => {
  const { hotel_id } = useParams(); // Get hotel_id from the URL
  const navigate = useNavigate();
  const [hotelDetails, setHotelDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        // Fetch hotel details
        const hotelDetailsResponse = await axios.get("http://localhost:8080/api/rest/gethoteldetails", {
          params: { hotel_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });

        // Fetch rooms for the hotel
        const roomsResponse = await axios.get("http://localhost:8080/api/rest/getrooms", {
          params: { hotel_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });

        console.log("Hotel Details Response:", hotelDetailsResponse.data);
        console.log("Rooms Response:", roomsResponse.data);

        // Combine data
        setHotelDetails(hotelDetailsResponse.data?.hotel_by_pk || {});
        setRooms(roomsResponse.data?.rooms || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch hotel details. Please try again later.");
        setLoading(false);
      }
    };

    fetchHotelDetails();
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

      <h1 className="text-2xl font-bold text-teal-600">Hotel Details</h1>

      {loading ? (
        <p className="text-teal-600 mt-4">Loading hotel details...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <div>
          {/* Hotel Information */}
          <div className="mt-4">
            <h2 className="text-xl font-bold">Hotel Information</h2>
            <p>Hotel Name: {hotelDetails.name}</p>
            <p>Address: {hotelDetails.address}</p>
            <p>Contact: {hotelDetails.contact_info}</p>
          </div>

          {/* Rooms Table */}
          <div className="mt-8">
            <h2 className="text-xl font-bold">Rooms</h2>
            <table className="w-full bg-white shadow-md rounded-lg mt-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Room ID</th>
                  <th className="px-4 py-2 text-left">Room Number</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Availability</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.room_id}>
                    <td className="px-4 py-2">{room.room_id}</td>
                    <td className="px-4 py-2">{room.room_number}</td>
                    <td className="px-4 py-2">{room.type_name}</td> {/* Assuming type_name is provided from the API */}
                    <td className="px-4 py-2">{room.description || "No description available"}</td>
                    <td className="px-4 py-2">₱{room.price || "N/A"}</td>
                    <td className="px-4 py-2">{room.availability ? "Available" : "Not Available"}</td>
                    <td className="px-4 py-2">{room.status}</td>
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

export default HotelDetails;
