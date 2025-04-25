import { useState, useEffect } from "react";
import axios from "axios";
import hotelImage from "../../assets/hotel.jpg"; // Static hotel image

const HotelRooms = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getallhotels", {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });
        console.log("Hotels API Response:", response.data);
        setHotels(response.data.hotels); // Set the fetched hotels data
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError("Failed to fetch hotels. Please try again later.");
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-600">Hotels Management</h1>
        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
          Add New Hotel
        </button>
      </div>

      {/* Display loading, error, or hotels */}
      {loading ? (
        <p className="text-teal-600 mt-4">Loading hotels...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id} // Add a unique key prop
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Hotel Image */}
              <img src={hotelImage} alt="Hotel" className="w-full h-48 object-cover" />

              {/* Hotel Details */}
              <div className="p-4">
                <h2 className="text-lg font-bold text-teal-600">{hotel.name}</h2>
                <p className="text-gray-600">
                  {hotel.location?.location_name || "Unknown Location"} {/* Access specific property */}
                </p>
                <p className="text-gray-500 text-sm">{hotel.rooms} Rooms</p>
                <p className="text-teal-600 font-bold mt-2">
                  ₱{hotel.min_price} - ₱{hotel.max_price}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button className="flex items-center space-x-2 text-teal-600 hover:underline">
                  <span>View</span>
                </button>
                <button className="flex items-center space-x-2 text-teal-600 hover:underline">
                  <span>Edit</span>
                </button>
                <button className="flex items-center space-x-2 text-red-600 hover:underline">
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelRooms;