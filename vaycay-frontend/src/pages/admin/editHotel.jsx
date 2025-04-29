import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const EditHotel = () => {
  const { hotel_id } = useParams(); // Get hotel_id from the URL
  const navigate = useNavigate();

  const [hotelName, setHotelName] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [locationId, setLocationId] = useState(null); // Store location_id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch existing hotel data
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/gethoteldata", {
          params: { hotel_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });

        const hotel = response.data.hotels_by_pk;
        setHotelName(hotel.hotel_name);
        setDescription(hotel.description);
        setLocationName(hotel.location.location_name);
        setLocationDescription(hotel.location.description);
        setLocationId(hotel.location.location_id); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hotel data:", err);
        setError("Failed to load hotel data. Please try again later.");
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotel_id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      hotel_id: parseInt(hotel_id),
      hotel_name: hotelName,
      description: description,
      location_id: locationId, // Include location_id
      location_name: locationName,
      location_description: locationDescription,
    };

    console.log("Request Body:", requestBody); // Log the request body

    try {
      const response = await axios.post(
        "http://localhost:8080/api/rest/updatehoteldetails",
        requestBody,
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        }
      );

      console.log("Response:", response.data);
      setSuccess("Hotel details updated successfully!");
      setError(null);

      // Redirect back to the HotelDetails page
      setTimeout(() => navigate(`/admin/hotels/${hotel_id}`), 2000);
    } catch (err) {
      console.error("Error updating hotel details:", err);
      setError("Failed to update hotel details. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="flex items-center space-x-2 mb-4"
      >
        <img src={backIcon} alt="Back" />
        <span className="hover:underline">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-teal-600 mb-4">Edit Hotel</h1>

      {loading ? (
        <p className="text-teal-600">Loading hotel details...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700">
              Hotel Name
            </label>
            <input
              type="text"
              id="hotelName"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="locationName" className="block text-sm font-medium text-gray-700">
              Location Name
            </label>
            <input
              type="text"
              id="locationName"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="locationDescription" className="block text-sm font-medium text-gray-700">
              Location Description
            </label>
            <textarea
              id="locationDescription"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default EditHotel;