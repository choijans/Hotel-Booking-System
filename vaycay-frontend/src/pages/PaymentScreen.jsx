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
  const [isTermsChecked, setIsTermsChecked] = useState(false);


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
    <div className={styles["payment-page-wrapper"]}>
      <div className={styles["payment-header"]}>
        <h1>Review Your Booking</h1>
      </div>
      
      <div className={styles["payment-container"]}>
        {/* Room Details Section */}
        <div className={styles["booking-section"]}>
          <h2>Room Details</h2>
          <div className={styles["room-details"]}>
            <div className={styles["room-image"]}>
              <img
                src="https://via.placeholder.com/300x200"
                alt={bookingDetails.room_details.room_type?.type_name || "Room"}
              />
            </div>
            <div className={styles["room-info"]}>
              <h3>{bookingDetails.room_details.room_type?.type_name || "Room"}</h3>
              <p className={styles["hotel-location"]}>
                {bookingDetails.room_details.hotel?.hotel_name},{" "}
                {bookingDetails.room_details.hotel?.location?.location_name}
              </p>
              <p className={styles["room-description"]}>{bookingDetails.room_details.description}</p>
            </div>
          </div>

          {/* Check-in/Check-out Information */}
          <div className={styles["booking-dates"]}>
            <div className={styles["date-block"]}>
              <span className={styles["date-label"]}>Check-In</span>
              <span className={styles["date-value"]}>{new Date(bookingDetails.check_in_date).toLocaleDateString()}</span>
            </div>
            <div className={styles["date-block"]}>
              <span className={styles["date-label"]}>Check-Out</span>
              <span className={styles["date-value"]}>{new Date(bookingDetails.check_out_date).toLocaleDateString()}</span>
            </div>
            <div className={styles["date-block"]}>
              <span className={styles["date-label"]}>Room</span>
              <span className={styles["date-value"]}>1 Room</span>
            </div>
            <div className={styles["date-block"]}>
              <span className={styles["date-label"]}>Guests</span>
              <span className={styles["date-value"]}>{bookingDetails.guests || "2"} {(bookingDetails.guests > 1 || bookingDetails.guests === undefined) ? "Adults" : "Adult"}</span>
            </div>
          </div>

          {/* Guest Information Section */}
          {/* <div className={styles["guest-section"]}>
            <h2>Guest Information</h2>
            <div className={styles["guest-info"]}>
              <p className={styles["guest-name"]}>{bookingDetails.guest_name || "Guest Name"}</p>
              <p className={styles["guest-contact"]}>{bookingDetails.guest_email || "guest@example.com"} • {bookingDetails.guest_phone || "+63 123 456 7890"}</p>
            </div>
          </div> */}

          {/* Special Requests Section */}
          <div className={styles["special-requests"]}>
            <div className={styles["requests-header"]}>
              <h2>Special Requests</h2>
              <button className={styles["edit-button"]}>Edit</button>
            </div>
            <p className={styles["request-text"]}>{bookingDetails.special_requests || "High floor, away from elevator if possible."}</p>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className={styles["payment-section"]}>
          <h2>Payment Details</h2>
          
          <div className={styles["payment-form"]}>
            <div className={styles["form-group"]}>
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19" // Includes spaces
                className={styles["card-input"]}
              />
              {cardType && (
                <img
                  src={getCardImage()}
                  alt={cardType}
                  className={styles["card-image"]}
                />
              )}
            </div>
            
            <div className={styles["form-group"]}>
              <label>Expiry Date(MM/YY)</label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength="5"
                className={styles["date-input"]}
              />
            </div>
            
            <div className={styles["form-group"]}>
              <label>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength="3"
                className={styles["cvv-input"]}
              />
            </div>
          </div>

          {/* Price Summary Section */}
          <div className={styles["price-summary"]}>
            <h2>Price Summary</h2>
            
            <div className={styles["price-rows"]}>
              <div className={styles["price-row"]}>
                <span>Room Rate (5 nights)</span>
                <span>₱{(bookingDetails.total_amount * 0.9).toFixed(2)}</span>
              </div>
              <div className={styles["price-row"]}>
                <span>Resort Fee</span>
                <span>₱{(bookingDetails.total_amount * 0.05).toFixed(2)}</span>
              </div>
              <div className={styles["price-row"]}>
                <span>Taxes</span>
                <span>₱{(bookingDetails.total_amount * 0.05).toFixed(2)}</span>
              </div>
              <div className={styles["price-total"]}>
                <span>Total</span>
                <span className={styles["total-amount"]}>₱{bookingDetails.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* <div className={styles["terms-agreement"]}>
              <label className={styles["checkbox-label"]}>
                <input type="checkbox" required />
                <span>I agree to the <a href="/terms">Terms and Conditions</a>, <a href="/cancellation-policy">Cancellation Policy</a>, and acknowledge that my payment will be processed now.</span>
              </label>
            </div> */}

            <div className={styles["terms-container"]}>
              <label htmlFor="terms" className={styles["checkbox-label"]}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={isTermsChecked}
                  onChange={(e) => setIsTermsChecked(e.target.checked)}
                />
                <span>I agree to the <a href="/terms">Terms and Conditions</a>, <a href="/cancellation-policy">Cancellation Policy</a>, and acknowledge that my payment will be processed now.</span>
              </label>
            </div>

            {/* <button
              onClick={handlePayment}
              className={styles["confirm-button"]}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Confirm and Pay ₱${bookingDetails.total_amount.toFixed(2)}`}
            </button> */}

            <button
              className={styles["confirm-button"]}
              onClick={handlePayment}
              disabled={!isTermsChecked || isProcessing}
            >
              {isProcessing ? "Processing..." : `Confirm and Pay ₱${bookingDetails.total_amount.toFixed(2)}`}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;