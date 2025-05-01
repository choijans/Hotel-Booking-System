import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const AddRooms = () => {
  const { hotel_id } = useParams(); // Get hotel_id from the URL
  const navigate = useNavigate();

  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [roomTypeDescription, setRoomTypeDescription] = useState(""); // New state for room_type.description
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState(true);
  const [description, setDescription] = useState(""); // New state for rooms.description
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      hotel_id: parseInt(hotel_id),
      room_number: roomNumber,
      room_type: roomType, // Send type_name
      room_type_description: roomTypeDescription, // Send type_description
      price: parseFloat(price),
      availability: availability,
      description: description, // Include description in the request body
    };

    console.log("Request Body:", requestBody);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/rest/addroom",
        requestBody,
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        }
      );

      console.log("Response:", response.data);
      setSuccess("Room added successfully!");
      setError(null);

      // Redirect back to the HotelDetails page
      setTimeout(() => navigate(`/admin/hotels/${hotel_id}`), 2000);
    } catch (err) {
      console.error("Error adding room:", err);
      setError("Failed to add room. Please try again.");
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

      <h1 className="text-2xl font-bold text-teal-600 mb-4">Add New Room</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
            Room Number
          </label>
          <input
            type="text"
            id="roomNumber"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Room Description
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
          <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
            Room Type Name
          </label>
          <input
            type="text"
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="roomTypeDescription" className="block text-sm font-medium text-gray-700">
            Room Type Description
          </label>
          <textarea
            id="roomTypeDescription"
            value={roomTypeDescription}
            onChange={(e) => setRoomTypeDescription(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
            Availability
          </label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value === "true")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
        >
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRooms;