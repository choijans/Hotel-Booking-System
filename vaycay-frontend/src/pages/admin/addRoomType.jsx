import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import axios from "axios";
import backIcon from "../../assets/back.png";

const AddRoomType = () => {
  const navigate = useNavigate();
  const { hotel_id } = useParams(); // Get hotel_id from the URL

  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Request Body:", {
        type_name: typeName,
        description: description,
        hotel_id: hotel_id, // Automatically include hotel_id
      });

      const response = await axios.post(
        "http://localhost:8080/api/rest/addroomtype", // REST API endpoint for adding room type
        {
          type_name: typeName,
          description: description,
          hotel_id: parseInt(hotel_id), // Ensure hotel_id is an integer
        },
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        }
      );

      console.log("Room type added successfully:", response.data);
      setSuccess("Room type added successfully!");
      setError(null);

      // Redirect back to the HotelDetails page after a short delay
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      console.error("Error adding room type:", err.response?.data || err.message);
      setError("Failed to add room type. Please try again.");
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

      <h1 className="text-2xl font-bold text-teal-600 mb-4">Add Room Type</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="typeName" className="block text-sm font-medium text-gray-700">
            Room Type Name
          </label>
          <input
            type="text"
            id="typeName"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
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
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
        >
          Add Room Type
        </button>
      </form>
    </div>
  );
};

export default AddRoomType;