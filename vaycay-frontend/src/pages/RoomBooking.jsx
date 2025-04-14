import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelApi } from "../api";
import "./RoomBooking.css";

const RoomBooking = () => {
  const { roomId } = useParams(); // Extract room_id from URL
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch room details from the API
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await hotelApi.get("/getroomdetails", {
          params: { room_id: roomId }, // Pass room_id as a parameter
        });
  
        // Log the full API response for debugging
        console.log("API Response:", response.data);
  
        // Check if the response contains the expected structure
        if (response.data?.rooms_by_pk) {
          setRoomDetails(response.data.rooms_by_pk); // Set room details
        } else {
          console.error("Unexpected API Response Structure:", response.data); // Log unexpected structure
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Error fetching room details:", err);
        setError("Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRoomDetails();
  }, [roomId]);


  // Calculate total price based on selected dates
  useEffect(() => {
    if (roomDetails && checkInDate && checkOutDate) {
      const nights =
        (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
      setTotalPrice(nights * roomDetails.price);
    }
  }, [roomDetails, checkInDate, checkOutDate]);

  const handleBookNow = async () => {
    try {
      const bookingData = {
        room_id: parseInt(roomId),
        guest_id: 1, // Replace with actual guest ID from authentication
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_amount: totalPrice,
        status: "Pending",
        payment_status: "Pending",
      };

      const response = await hotelApi.post("/createbooking", bookingData);

      if (response.data && response.data.booking_id) {
        alert("Booking successful!");
        navigate("/dashboard");
      } else {
        throw new Error("Booking failed");
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Failed to create booking");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!roomDetails) return <div>No room details available.</div>;

  return (
    <div className="room-booking-container">
      <div className="room-details">
        <h1>{roomDetails.room_type?.type_name || "Room"}</h1>
        <p>
          📍 {roomDetails.hotel?.hotel_name},{" "}
          {roomDetails.hotel?.location?.location_name}
        </p>
        <p>PHP {roomDetails.price.toFixed(2)} Per Night</p>
        <div className="room-description">
          <p>{roomDetails.description}</p>
        </div>
        <div className="room-availability">
          <p>
            Status:{" "}
            {roomDetails.availability ? "Available" : "Unavailable"}
          </p>
        </div>
      </div>

      <div className="booking-form">
        <h3>Book Your Stay</h3>
        <label>Check In</label>
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
        <label>Check Out</label>
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
        <label>Guests</label>
        <input
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
        />
        <p>Total: PHP {totalPrice.toFixed(2)}</p>
        <button onClick={handleBookNow}>Book Now</button>
      </div>
    </div>
  );
};

export default RoomBooking;