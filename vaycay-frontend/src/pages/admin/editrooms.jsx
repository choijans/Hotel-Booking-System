import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const EditRooms = () => {
  const { hotel_id, room_id } = useParams(); // Get hotel_id and room_id from the URL
  const navigate = useNavigate();

  const [roomNumber, setRoomNumber] = useState("");
  const [typeName, setTypeName] = useState(""); // For type_name
  const [typeDescription, setTypeDescription] = useState(""); // For type_description
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState(true);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getroomdetails", {
          params: { room_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });

        const room = response.data.rooms_by_pk;
        setRoomNumber(room.room_number);
        setTypeName(room.room_type.type_name); // Set type_name
        setTypeDescription(room.room_type.description); // Set type_description
        setPrice(room.price);
        setAvailability(room.availability);
        setDescription(room.description);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching room data:", err);
        setError("Failed to load room data. Please try again later.");
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [room_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      room_id: parseInt(room_id),
      room_number: roomNumber,
      type_name: typeName, // Use type_name
      type_description: typeDescription, // Use type_description
      price: parseFloat(price),
      availability: availability,
      description: description,
    };

    console.log("Request Body:", requestBody);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/rest/editroom",
        requestBody,
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        }
      );

      console.log("Response:", response.data);
      setSuccess("Room updated successfully!");
      setError(null);

      // Redirect back to the HotelDetails page
      setTimeout(() => navigate(`/admin/hotels/${hotel_id}`), 2000);
    } catch (err) {
      console.error("Error updating room:", err.response?.data || err.message);
      setError("Failed to update room. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 mb-4"
      >
        <img src={backIcon} alt="Back" />
        <span className="hover:underline">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-teal-600 mb-4">Edit Room</h1>

      {loading ? (
        <p>Loading room details...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
            <label htmlFor="typeDescription" className="block text-sm font-medium text-gray-700">
              Room Type Description
            </label>
            <textarea
              id="typeDescription"
              value={typeDescription}
              onChange={(e) => setTypeDescription(e.target.value)}
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
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default EditRooms;