import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const AddRooms = () => {
  const { hotel_id } = useParams(); // Get hotel_id from the URL
  const navigate = useNavigate();

  const [roomNumber, setRoomNumber] = useState("");
  const [roomTypes, setRoomTypes] = useState([]); // State to store room types
  const [selectedRoomType, setSelectedRoomType] = useState(""); // State for selected room type
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState(true);
  const [description, setDescription] = useState(""); // New state for rooms.description
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch all room types when the component loads
  useEffect(() => {
    const getAllRoomTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/rest/getallroomtypes", // REST API endpoint to fetch room types
          {
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            },
          }
        );

        setRoomTypes(response.data.room_types); // Set the fetched room types
      } catch (err) {
        console.error("Error fetching room types:", err);
        setError("Failed to fetch room types. Please try again.");
      }
    };

    getAllRoomTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const roomResponse = await axios.post(
        "http://localhost:8080/api/rest/addroom", // Updated REST API endpoint
        {
          hotel_id: parseInt(hotel_id),
          room_number: roomNumber,
          type_id: parseInt(selectedRoomType), // Use the selected room type ID
          description: description,
          price: parseFloat(price),
          availability: availability,
        },
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        }
      );
  
      console.log("Room added successfully:", roomResponse.data);
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
            Room Type
          </label>
          <select
            id="roomType"
            value={selectedRoomType}
            onChange={(e) => setSelectedRoomType(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="" disabled>
              Select a room type
            </option>
            {roomTypes.map((type) => (
              <option key={type.type_id} value={type.type_id}>
                {type.type_name} - {type.description}
              </option>
            ))}
          </select>
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