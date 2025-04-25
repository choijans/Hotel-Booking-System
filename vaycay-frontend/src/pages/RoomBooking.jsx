import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { hotelApi } from "../api";
import styles from "./RoomBooking.module.css"; // Updated import for CSS Modules

const RoomBooking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [roomDetails, setRoomDetails] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await hotelApi.get("/getroomdetails", {
          params: { room_id: roomId },
        });

        if (response.data?.rooms_by_pk) {
          setRoomDetails(response.data.rooms_by_pk);
        } else {
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

  useEffect(() => {
    if (roomDetails && checkInDate && checkOutDate) {
      const nights =
        (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
      setTotalPrice(nights * roomDetails.price);
    }
  }, [roomDetails, checkInDate, checkOutDate]);

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }
  
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
  
    if (checkIn < today) {
      alert("Check-in date must be in the future.");
      return;
    }
  
    if (checkOut <= checkIn) {
      alert("Check-out date must be after the check-in date.");
      return;
    }
  
    const bookingDetails = {
      room_id: parseInt(roomId),
      guest_id: currentUser?.id,
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      total_amount: totalPrice,
      room_details: roomDetails,
    };
  
    navigate("/payment", { state: bookingDetails });
  };

  if (loading) return <div className={styles["roombooking-loading-spinner"]}></div>;
  if (error) return <p className={styles["roombooking-error-message"]}>Error: {error}</p>;
  if (!roomDetails) return <div>No room details available.</div>;

  return (
    <div className={styles["roombooking-container"]}>
      <div className={styles["roombooking-details"]}>
        <h1>{roomDetails.room_type?.type_name || "Room"}</h1>
        <p>
          📍 {roomDetails.hotel?.hotel_name},{" "}
          {roomDetails.hotel?.location?.location_name}
        </p>
        <p>PHP {roomDetails.price.toFixed(2)} Per Night</p>
        <div className={styles["roombooking-description"]}>
          <p>{roomDetails.description}</p>
        </div>
        <div className={styles["roombooking-availability"]}>
          <p>
            Status:{" "}
            {roomDetails.availability ? "Available" : "Unavailable"}
          </p>
        </div>
      </div>

      <div className={styles["roombooking-form"]}>
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
        <button onClick={handleBookNow} className={styles["roombooking-form-button"]}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomBooking;