import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const HotelDetails = () => {
  const { hotel_id } = useParams();
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 
  const [activeTab, setActiveTab] = useState("rooms");
  const [bookingToDelete, setBookingToDelete] = useState(null); 
  const [showDeleteBookingConfirmation, setShowDeleteBookingConfirmation] = useState(false);  
  const [roomTypes, setRoomTypes] = useState([]); // State to store room types

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/gethoteldata", {
          params: { hotel_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });
  
        console.log("API Response:", response.data); // Log the API response
        setHotelData({
          ...response.data.hotels_by_pk,
          bookings: response.data.bookings, // Include bookings in the state
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hotel data:", err);
        setError("Failed to load hotel data. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchHotelData();

    const getAllRoomTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/rest/getroomtypesbyhotel", // REST API endpoint to fetch room types
          {
            params: { hotel_id }, // Pass the hotel_id as a query parameter
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            },
          }
        );
    
        console.log("Fetched Room Types:", response.data.room_types); // Debugging log
        setRoomTypes(response.data.room_types); // Set the fetched room types
      } catch (err) {
        console.error("Error fetching room types:", err.response?.data || err.message);
        setError("Failed to fetch room types. Please try again.");
      }
    };
    getAllRoomTypes();
  }, [hotel_id]);

  const handleDeleteRoom = (room_id) => {
    setRoomToDelete(room_id); // Set the room to delete
    setShowDeleteConfirmation(true); // Show the confirmation dialog
  };

  const confirmDeleteRoom = async () => {
    try {
      // Check for related bookings
      const checkResponse = await axios.get("http://localhost:8080/api/rest/checkroomdependencies", {
        params: { room_id: roomToDelete },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret",
        },
      });

      if (checkResponse.data.bookings.length > 0) {
        alert("This room cannot be deleted because it has associated bookings.");
        setShowDeleteConfirmation(false);
        setRoomToDelete(null);
        return;
      }

      // Proceed with deletion if no dependencies
      await axios.request({
        method: "DELETE",
        url: "http://localhost:8080/api/rest/deleteroom",
        data: { room_id: roomToDelete },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret",
          "Content-Type": "application/json",
        },
      });

      // Refresh the hotel data after deletion
      const response = await axios.get("http://localhost:8080/api/rest/gethoteldata", {
        params: { hotel_id },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret",
        },
      });

      setHotelData(response.data.hotels_by_pk);
      setShowDeleteConfirmation(false);
      setRoomToDelete(null);
    } catch (err) {
      console.error("Error deleting room:", err.response?.data || err.message);
      alert("Failed to delete the room. Please try again.");
    }
  };

  const handleDeleteBooking = (booking_id) => {
    setBookingToDelete(booking_id); // Set the booking to delete
    setShowDeleteBookingConfirmation(true); // Show the confirmation dialog
  };
  
  const confirmDeleteBooking = async () => {
    try {
      await axios.request({
        method: "DELETE",
        url: "http://localhost:8080/api/rest/deletebooking",
        data: { booking_id: bookingToDelete },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          "Content-Type": "application/json",
        },
      });
  
      // Refresh the hotel data after deletion
      const response = await axios.get("http://localhost:8080/api/rest/gethoteldata", {
        params: { hotel_id },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret",
        },
      });
  
      setHotelData({
        ...response.data.hotels_by_pk,
        bookings: response.data.bookings, // Update bookings in the state
      });
      setShowDeleteBookingConfirmation(false);
      setBookingToDelete(null);
    } catch (err) {
      console.error("Error deleting booking:", err.response?.data || err.message);
      alert("Failed to delete the booking. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="flex items-center space-x-2 mb-4"
      >
        <img src={backIcon} alt="Back" />
        <span className="hover:underline">Back</span>
      </button>

      <div className="flex">
        <h1 className="text-2xl font-bold text-teal-600">Hotel Details</h1>
        <button
          onClick={() => navigate(`/admin/hotels/${hotel_id}/edit`)}
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
          <div className="mt-4">
            <p><strong>Hotel Name:</strong> {hotelData.hotel_name}</p>
            <p><strong>Description:</strong> {hotelData.description}</p>
            <p><strong>Location:</strong> {hotelData.location.location_name}</p>
            <p><strong>Location Description:</strong> {hotelData.location.description}</p>
          </div>

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

            {activeTab === "rooms" && (
  <div className="mt-4">
    {/* Rooms Section */}
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Rooms</h2>
      <button
        className="bg-teal-600 text-white px-4 py-2 rounded-md"
        onClick={() => navigate(`/admin/hotels/${hotel_id}/addroom`)}
      >
        Add New Room
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {hotelData.rooms.map((room) => (
        <div
          key={room.room_id}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
        >
          <div>
            <p><strong>Room Number:</strong> {room.room_number}</p>
            <p><strong>Type:</strong> {room.room_type.type_name}</p>
            <p><strong>Price:</strong> ₱{room.price}</p>
            <p>
              <strong>Availability:</strong>{" "}
              {room.availability ? "Available" : "Not Available"}
            </p>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => navigate(`/admin/hotels/${hotel_id}/rooms/${room.room_id}/edit`)}
              className="flex items-center"
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

    {/* Room Types Section */}
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Room Types</h2>
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded-md"
          onClick={() => navigate(`/admin/hotels/${hotel_id}/addroomtype`)}
        >
          Add Room Type
        </button>
      </div>
      <table className="w-full bg-white shadow-md rounded-lg mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Type Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.length > 0 ? (
            roomTypes.map((type) => (
              <tr key={type.type_id}>
                <td className="px-4 py-2">{type.type_name}</td>
                <td className="px-4 py-2">{type.description}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => navigate(`/admin/hotels/${hotel_id}/roomtypes/${type.type_id}/edit`)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => console.log(`Delete Room Type: ${type.type_id}`)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                No room types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
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
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelData?.bookings?.length > 0 ? (
                      hotelData.bookings.map((booking) => (
                        <tr key={booking.booking_id}>
                          <td className="px-4 py-2">{booking.booking_id}</td>
                          <td className="px-4 py-2">{booking.guest_id}</td>
                          <td className="px-4 py-2">{booking.room.room_number}</td>
                          <td className="px-4 py-2">{booking.check_in_date}</td>
                          <td className="px-4 py-2">{booking.check_out_date}</td>
                          <td className="px-4 py-2">{booking.status}</td>
                          <td className="px-4 py-2">₱{booking.total_amount}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDeleteBooking(booking.booking_id)}
                              className="flex items-center text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                          No bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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

            {showDeleteBookingConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-lg font-medium mb-4">
                    Are you sure you want to delete this booking?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowDeleteBookingConfirmation(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDeleteBooking}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;