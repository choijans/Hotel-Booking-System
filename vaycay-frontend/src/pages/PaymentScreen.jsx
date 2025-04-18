import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { hotelApi } from "../api";
import "./PaymentScreen.css";

const PaymentScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Detect card type based on card number
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setCardNumber(value);

    if (/^4/.test(value)) setCardType("Visa");
    else if (/^5[1-5]/.test(value)) setCardType("Mastercard");
    else if (/^3[47]/.test(value)) setCardType("American Express");
    else setCardType("");
  };

  const handlePayment = async () => {
    if (isProcessing) return;

    // Validate inputs
    if (!cardNumber || cardNumber.length < 16) {
      alert("Invalid card number.");
      return;
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      alert("Invalid expiry date. Use MM/YY format.");
      return;
    }
    if (!cvv || cvv.length < 3) {
      alert("Invalid CVV.");
      return;
    }

    setIsProcessing(true);
    try {
      // Prepare the payload
      const payload = {
        room_id: bookingDetails.room_id,
        guest_id: bookingDetails.guest_id,
        check_in_date: bookingDetails.check_in_date,
        check_out_date: bookingDetails.check_out_date,
        total_amount: bookingDetails.total_amount,
      };

      // Send the request to create the booking
      const response = await hotelApi.post("/createbooking", payload);

      if (response.data?.insert_bookings_one?.booking_id) {
        // Send confirmation email
        emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            user_email: "user@example.com", // Replace with actual user email
            booking_id: response.data.insert_bookings_one.booking_id,
            total_amount: bookingDetails.total_amount,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        // Redirect to confirmation page
        navigate("/confirmation", {
          state: {
            booking_id: response.data.insert_bookings_one.booking_id,
            bookingDetails,
          },
        });
      } else {
        throw new Error("Failed to create booking.");
      }
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-screen-container">
      <h1>Review Your Booking</h1>

      {/* Room Details Section */}
      <div className="section">
        <h2>Room Details</h2>
        <div className="room-details">
          <img
            src="https://via.placeholder.com/300x200"
            alt={bookingDetails.room_details.room_type?.type_name || "Room"}
          />
          <div>
            <h3>{bookingDetails.room_details.room_type?.type_name || "Room"}</h3>
            <p>
              {bookingDetails.room_details.hotel?.hotel_name},{" "}
              {bookingDetails.room_details.hotel?.location?.location_name}
            </p>
            <p>{bookingDetails.room_details.description}</p>
          </div>
        </div>
      </div>

      {/* Payment Details Section */}
      <div className="section">
        <h2>Payment Details</h2>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="16"
          />
          {cardType && <p className="card-type">{cardType}</p>}
        </div>
        <div className="form-group">
          <label>Expiry Date (MM/YY)</label>
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
            maxLength="5"
          />
        </div>
        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
            maxLength="3"
          />
        </div>
      </div>

      {/* Price Summary Section */}
      <div className="section">
        <h2>Price Summary</h2>
        <p><strong>Room Rate:</strong> ₱{bookingDetails.total_amount.toFixed(2)}</p>
        <p><strong>Total Paid:</strong> ₱{bookingDetails.total_amount.toFixed(2)}</p>
      </div>

      {/* Payment Button */}
      <div className="payment-actions">
        <label>
          <input type="checkbox" required /> I agree to the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms and Conditions
          </a>
          ,{" "}
          <a href="/cancellation-policy" target="_blank" rel="noopener noreferrer">
            Cancellation Policy
          </a>
          , and acknowledge that my payment will be processed now.
        </label>
        <button
          onClick={handlePayment}
          className="confirm-button"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Confirm and Pay ₱${bookingDetails.total_amount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;