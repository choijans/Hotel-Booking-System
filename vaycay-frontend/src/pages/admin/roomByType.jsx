import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const RoomByType = () => {
  const { hotel_id, type_id } = useParams(); // Get hotel_id and type_id from the URL
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null); // State to track the room to delete
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to show confirmation dialog

  useEffect(() => {
    const fetchRoomsByType = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/rest/getroomsbytype", // REST API endpoint to fetch rooms by type
          {
            params: { type_id }, // Pass the type_id as a query parameter
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            },
          }
        );

        setRooms(response.data.rooms); // Set the fetched rooms
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rooms by type:", err);
        setError("Failed to fetch rooms. Please try again.");
        setLoading(false);
      }
    };

    fetchRoomsByType();
  }, [type_id]);

  const handleDeleteRoom = (room_id) => {
    setRoomToDelete(room_id); // Set the room to delete
    setShowDeleteConfirmation(true); // Show the confirmation dialog
  };

  const confirmDeleteRoom = async () => {
    try {
      // Update the room status to "Out of Service" and set availability to false
      await axios.post(
        "http://localhost:8080/api/rest/updateroomstatusandavailability", // REST API endpoint
        {
          room_id: roomToDelete,
          status: "Out of Service", // Mark the room as out of service
          availability: false, // Set availability to false
        },
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh the rooms list after updating the room status
      const response = await axios.get("http://localhost:8080/api/rest/getroomsbytype", {
        params: { type_id },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret",
        },
      });

      setRooms(response.data.rooms);
      setShowDeleteConfirmation(false);
      setRoomToDelete(null);
      alert("Room status updated to 'Out of Service' and availability set to 'Not Available'.");
    } catch (err) {
      console.error("Error updating room status and availability:", err.response?.data || err.message);
      alert("Failed to update the room status. Please try again.");
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

      <h1 className="text-2xl font-bold text-teal-600 mb-4">Rooms</h1>

      {loading ? (
        <p>Loading rooms...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {rooms.map((room) => (
            <div
              key={room.room_id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                <p><strong>Room Number:</strong> {room.room_number}</p>
                <p><strong>Price:</strong> ₱{room.price}</p>
                <p>
                  <strong>Availability:</strong>{" "}
                  {room.availability ? "Available" : "Not Available"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {room.status === "Out of Service" ? (
                    <span className="text-red-600">Out of Service</span>
                  ) : (
                    <span className="text-green-600">{room.status}</span>
                  )}
                </p>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => navigate(`/admin/hotels/${hotel_id}/rooms/${room.room_id}/edit`)}
                  className={`flex items-center ${
                    room.status === "Out of Service" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={room.status === "Out of Service"}
                  title={room.status === "Out of Service" ? "Cannot edit a room that is out of service" : ""}
                >
                  <img
                    src="/src/assets/edit.png"
                    alt="Edit"
                    className="w-6 h-6 hover:opacity-80"
                  />
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.room_id)}
                  className="flex items-center"
                >
                  <img
                    src="/src/assets/delete.png"
                    alt="Delete"
                    className="w-6 h-6 hover:opacity-80"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium mb-4">
              Are you sure you want to delete this room?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRoom}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomByType;