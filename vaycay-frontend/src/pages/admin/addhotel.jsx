import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const AddHotel = () => {
  const navigate = useNavigate();

  const [hotelName, setHotelName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      hotel_name: hotelName,
      location_name: locationName,
      location_description: locationDescription,
      description: description,
    };

    console.log("Request Body:", requestBody);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/rest/addhotel",
        requestBody,
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        }
      );

      console.log("Response:", response.data);
      setSuccess("Hotel added successfully!");
      setError(null);

      // Redirect back to the Admin Dashboard
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (err) {
      console.error("Error adding hotel:", err);
      setError("Failed to add hotel. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <button
        onClick={() => navigate("/admin/dashboard")} // Navigate back to the previous page
        className="flex items-center space-x-2 mb-4"
      >
        <img src={backIcon} alt="Back" />
        <span className="hover:underline">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-teal-600 mb-4">Add New Hotel</h1>

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
            Hotel Description
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
          Add Hotel
        </button>
      </form>
    </div>
  );
};

export default AddHotel;