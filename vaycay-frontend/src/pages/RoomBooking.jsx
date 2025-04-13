import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelApi } from "../api";
import "./RoomBooking.css";

const RoomBooking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await hotelApi.post("", {
          query: `
            query GetRoomDetails($room_id: Int!) {
              rooms_by_pk(room_id: $room_id) {
                room_id
                room_number
                description
                price
                availability
                status
                room_type {
                  type_name
                  description
                }
                hotel {
                  hotel_name
                  location {
                    location_name
                  }
                }
                bookings {
                  check_in_date
                  check_out_date
                }
              }
            }
          `,
          variables: { room_id: parseInt(roomId) },
        });

        setRoomDetails(response.data.data.rooms_by_pk);
      } catch (err) {
        console.error("Error fetching room details:", err);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleBookNow = async () => {
    try {
      const response = await hotelApi.post("", {
        query: `
          mutation CreateBooking(
            $room_id: Int!
            $guest_id: Int!
            $check_in_date: date!
            $check_out_date: date!
            $total_amount: numeric!
          ) {
            insert_bookings_one(object: {
              room_id: $room_id,
              guest_id: $guest_id,
              check_in_date: $check_in_date,
              check_out_date: $check_out_date,
              total_amount: $total_amount,
              status: "Pending",
              payment_status: "Pending"
            }) {
              booking_id
            }
          }
        `,
        variables: {
          room_id: parseInt(roomId),
          guest_id: 1, // Replace with actual guest ID from authentication
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          total_amount: totalPrice,
        },
      });

      if (response.data.data.insert_bookings_one) {
        alert("Booking successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error creating booking:", err);
    }
  };

  useEffect(() => {
    if (roomDetails && checkInDate && checkOutDate) {
      const nights =
        (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
      setTotalPrice(nights * roomDetails.price);
    }
  }, [roomDetails, checkInDate, checkOutDate]);

  if (!roomDetails) return <div>Loading...</div>;

  return (
    <div className="room-booking-container">
      <div className="room-details">
        <h1>{roomDetails.room_type.type_name}</h1>
        <p>📍 {roomDetails.hotel.hotel_name}, {roomDetails.hotel.location.location_name}</p>
        <p>PHP {roomDetails.price.toFixed(2)} Per Night</p>
        <div className="room-description">
          <p>{roomDetails.description}</p>
        </div>
        <div className="room-availability">
          <p>Status: {roomDetails.availability ? "Available" : "Unavailable"}</p>
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