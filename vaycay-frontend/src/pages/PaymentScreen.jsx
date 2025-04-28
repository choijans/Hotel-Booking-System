import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { hotelApi } from "../api";
import styles from "./PaymentScreen.module.css";

// Import card images
import visaImage from "../assets/visa.png";
import mastercardImage from "../assets/mastercard.png";
import amexImage from "../assets/amex.png";

const PaymentScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length > 16) value = value.slice(0, 16); // Limit to 16 digits

    // Format card number with spaces (e.g., 1234 5678 9012 3456)
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");

    setCardNumber(formattedValue);

    // Detect card type
    if (/^4/.test(value)) setCardType("visa");
    else if (/^5[1-5]/.test(value)) setCardType("mastercard");
    else if (/^3[47]/.test(value)) setCardType("amex");
    else setCardType("");
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length > 4) value = value.slice(0, 4); // Limit to 4 digits (MMYY)

    // Format expiry date as MM/YY
    const formattedValue = value.replace(/(\d{2})(?=\d)/, "$1/");

    setExpiryDate(formattedValue);
  };

  const getCardImage = () => {
    switch (cardType) {
      case "visa":
        return visaImage;
      case "mastercard":
        return mastercardImage;
      case "amex":
        return amexImage;
      default:
        return null;
    }
  };

  const handlePayment = async () => {
    if (isProcessing) return;
  
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
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
      // Step 1: Insert Booking
      const bookingPayload = {
        room_id: bookingDetails.room_id,
        guest_id: bookingDetails.guest_id,
        check_in_date: bookingDetails.check_in_date,
        check_out_date: bookingDetails.check_out_date,
        total_amount: bookingDetails.total_amount,
      };
  
      const bookingResponse = await hotelApi.post("/createbooking", bookingPayload);
  
      if (!bookingResponse.data?.insert_bookings_one?.booking_id) {
        throw new Error("Failed to create booking.");
      }
  
      const bookingId = bookingResponse.data.insert_bookings_one.booking_id;
  
      // Step 2: Insert Payment
      const paymentPayload = {
        booking_id: bookingId,
        amount: bookingDetails.total_amount,
        payment_method: "Credit Card", // Example payment method
      };
  
      const paymentResponse = await hotelApi.post("/createpayment", paymentPayload);
  
      if (!paymentResponse.data?.insert_payments_one?.payment_id) {
        throw new Error("Failed to create payment.");
      }
  
      // Step 3: Send Confirmation Email
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          user_email: "user@example.com", // Replace with actual user email
          booking_id: bookingId,
          total_amount: bookingDetails.total_amount,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
  
      // Step 4: Navigate to Confirmation Page
      navigate("/confirmation", {
        state: {
          booking_id: bookingId,
          bookingDetails,
        },
      });
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles["payment-screen-container"]}>
      <h1 className={styles["payment-h1"]}>Review Your Booking</h1>

      <div className={styles["payment-section"]}>
        <h2>Room Details</h2>
        <div className={styles["payment-room-details"]}>
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
            <p>
              <strong>Guests:</strong> {bookingDetails.guests}{" "}
              {bookingDetails.guests > 1 ? "Guests" : "Guest"}
            </p>
          </div>
        </div>
      </div>

      <div className={styles["payment-section"]}>
        <h2>Payment Details</h2>
        <div className={styles["payment-form-group"]}>
          <label>Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19" // Includes spaces
          />
          {cardType && (
            <img
              src={getCardImage()}
              alt={cardType}
              className={styles["payment-card-image"]}
            />
          )}
        </div>
        <div className={styles["payment-form-group"]}>
          <label>Expiry Date (MM/YY)</label>
          <input
            type="text"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            maxLength="5"
          />
        </div>
        <div className={styles["payment-form-group"]}>
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

      <div className={styles["payment-section"]}>
        <h2>Price Summary</h2>
        <p><strong>Room Rate:</strong> ₱{bookingDetails.total_amount.toFixed(2)}</p>
        <p><strong>Total Paid:</strong> ₱{bookingDetails.total_amount.toFixed(2)}</p>
      </div>

      <div className={styles["payment-actions"]}>
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
          className={styles["payment-confirm-button"]}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Confirm and Pay ₱${bookingDetails.total_amount.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentScreen;