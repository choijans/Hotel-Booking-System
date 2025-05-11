import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const EditBooking = () => {
  const { hotel_id, booking_id } = useParams();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [status, setStatus] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getbookingbyid", {
          params: { booking_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret",
          },
        });

        console.log("Booking data fetched:", response.data);

        const booking = response.data.bookings_by_pk;

        if (!booking) {
          setError("Booking data not found.");
          return;
        }

        setBookingData(booking);
        setRoomId(booking.room_id);
        setCheckInDate(booking.check_in_date);
        setCheckOutDate(booking.check_out_date);
        setStatus(booking.status);
        setTotalAmount(booking.total_amount);
      } catch (err) {
        console.error("Error fetching booking data:", err.response?.data || err.message);
        setError("Failed to load booking data. Please try again later.");
      }
    };

    const fetchAvailableRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getavailablerooms", {
          params: { hotel_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret",
          },
        });

        console.log("Available rooms fetched:", response.data);

        setAvailableRooms(response.data.rooms);
      } catch (err) {
        console.error("Error fetching available rooms:", err.response?.data || err.message);
        setError("Failed to load available rooms. Please try again later.");
      }
    };

    fetchBookingData();
    fetchAvailableRooms();
  }, [hotel_id, booking_id]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      console.log("Updating booking with:", {
        booking_id,
        room_id: parseInt(roomId, 10),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        status,
        total_amount: parseFloat(totalAmount),
      });

      await axios.post(
        "http://localhost:8080/api/rest/updatebooking",
        {
          booking_id,
          room_id: parseInt(roomId, 10),
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          status,
          total_amount: parseFloat(totalAmount),
        },
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret",
            "Content-Type": "application/json",
          },
        }
      );

      alert("Booking updated successfully.");
      navigate(`/admin/hotels/${hotel_id}`);
    } catch (err) {
      console.error("Error updating booking:", err.response?.data || err.message);
      alert("Failed to update booking. Please try again.");
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
      <h1 className="text-2xl font-bold text-teal-600 mb-4">Edit Booking</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : bookingData ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
              Room Number
            </label>
            <select
              id="roomNumber"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="" disabled>Select a room</option>
              {availableRooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  {room.room_number}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
              Check-In Date
            </label>
            <input
              type="date"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
              Check-Out Date
            </label>
            <input
              type="date"
              id="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <input
              type="text"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
              Total Amount
            </label>
            <input
              type="number"
              id="totalAmount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <p>Loading booking data...</p>
      )}
    </div>
  );
};

export default EditBooking;