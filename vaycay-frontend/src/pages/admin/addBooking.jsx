import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const AddBooking = () => {
  const { hotel_id } = useParams();
  const navigate = useNavigate();

  const [availableRooms, setAvailableRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [guestId, setGuestId] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getavailablerooms", {
          params: { hotel_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret",
          },
        });

        setAvailableRooms(response.data.rooms);
      } catch (err) {
        console.error("Error fetching available rooms:", err.response?.data || err.message);
        setError("Failed to load available rooms. Please try again later.");
      }
    };

    fetchAvailableRooms();
  }, [hotel_id]);

  const handleAddBooking = async (e) => {
    e.preventDefault();

    if (isProcessing) return;

    if (!roomId || !guestId || !checkInDate || !checkOutDate || !totalAmount) {
      alert("Please fill in all fields.");
      return;
    }

    setIsProcessing(true);

    try {
      const bookingPayload = {
        room_id: parseInt(roomId, 10),
        guest_id: parseInt(guestId, 10),
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_amount: parseFloat(totalAmount),
      };

      const bookingResponse = await axios.post("http://localhost:8081/createbooking", bookingPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!bookingResponse.data?.booking_id) {
        throw new Error("Failed to create booking.");
      }

      const bookingId = bookingResponse.data.booking_id;

      alert("Booking created successfully!");

      // Redirect to the bookings page
      navigate(`/admin/hotels/${hotel_id}`);
    } catch (err) {
      console.error("Error creating booking:", err.response?.data || err.message);
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsProcessing(false);
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
      <h1 className="text-2xl font-bold text-teal-600 mb-4">Add Booking</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleAddBooking} className="space-y-4">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
              Room Number
            </label>
            <select
              id="roomId"
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
            <label htmlFor="guestId" className="block text-sm font-medium text-gray-700">
              Guest ID
            </label>
            <input
              type="number"
              id="guestId"
              value={guestId}
              onChange={(e) => setGuestId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
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
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Add Booking"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddBooking;