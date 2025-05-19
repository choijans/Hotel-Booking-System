import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PaymentScreen.module.css";
import { motion } from "framer-motion";

// Import card images
import visaImage from "../assets/visa.png";
import mastercardImage from "../assets/mastercard.png";
import amexImage from "../assets/amex.png";
import axios from "axios";

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
    const [expMonth, expYear] = expiryDate.split("/").map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last two digits
    const currentMonth = currentDate.getMonth() + 1;

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      alert("Card has already expired.");
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

      const bookingResponse = await axios.post("http://localhost:8081/createbooking", bookingPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!bookingResponse.data?.booking_id) {
        throw new Error("Failed to create booking.");
      }

      const bookingId = bookingResponse.data.booking_id;

      // Notify the user that the booking was created successfully
      alert("Booking created successfully! Payment is being processed.");

      // Step 2: Navigate to Confirmation Page
      navigate("/confirmation", {
        state: {
          booking_id: bookingId,
          bookingDetails,
        },
      });
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
      >
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
                  src="/src/assets/admin_pics/hotel1.jpg"
                  alt={bookingDetails.room_details.room_type?.type_name || "Room"}
                />
              </div>
              <div className={styles["room-info"]}>
                <h3>{bookingDetails.room_details.room_type?.type_name || "Room"}</h3>
                <p className={styles["hotel-location"]}>
                  📍
                  {bookingDetails.room_details.hotel?.hotel_name},{" "}
                  {bookingDetails.room_details.hotel?.location?.location_name}
                </p>
                <p className={styles["room-description"]}>{bookingDetails.room_details.description}</p>
              </div>
            </div>
            <hr className={styles.divider} />
            <h2>Booking Summary</h2>
            <div className={styles["booking-summary"]}>
  <div className={styles["summary-item"]}>
    <span className={styles["summary-label"]}>Check-in:</span>
    <span className={styles["summary-value"]}>
      {new Date(bookingDetails.check_in_date).toLocaleDateString()}
    </span>
  </div>
  <div className={styles["summary-item"]}>
    <span className={styles["summary-label"]}>Check-out:</span>
    <span className={styles["summary-value"]}>
      {new Date(bookingDetails.check_out_date).toLocaleDateString()}
    </span>
  </div>
  <div className={styles["summary-item"]}>
    <span className={styles["summary-label"]}>Room Rate:</span>
    <span className={styles["summary-value"]}>
      ₱{bookingDetails.nightly_rate?.toFixed(2)}
    </span>
  </div>
  <div className={styles["summary-item"]}>
    <span className={styles["summary-label"]}>Extra Adults:</span>
    <span className={styles["summary-value"]}>
      {bookingDetails.extra_adults} × ₱500
    </span>
  </div>
  <div className={styles["summary-item"]}>
    <span className={styles["summary-label"]}>Extra Children:</span>
    <span className={styles["summary-value"]}>
      {bookingDetails.extra_children} × ₱300
    </span>
  </div>
  <div className={styles["summary-item"]}>
    <span className={styles["summary-label"]}>Taxes & Fees (12%):</span>
    <span className={styles["summary-value"]}>
      ₱{(bookingDetails.total_amount * 0.12).toFixed(2)}
    </span>
  </div>
  <div className={`${styles["summary-item"]} ${styles["summary-total"]}`}>
    <span className={styles["summary-label-total"]}>Total:</span>
    <span className={styles["summary-value-total"]}>
     ₱{(bookingDetails.total_amount * 1.12).toFixed(2)}
    </span>
  </div>
</div>
          </div>

          
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
                <label>Expiry Date (MM/YY)</label>
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

            <div className={styles["terms-container"]}>
              <label htmlFor="terms" className={styles["checkbox-label"]}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={isTermsChecked}
                  onChange={(e) => setIsTermsChecked(e.target.checked)}
                />
                <span>
                  I agree to the <a href="/terms">Terms and Conditions</a> and
                  acknowledge that my payment will be processed now.
                </span>
              </label>
            </div>

            <button
              className={styles["confirm-button"]}
              onClick={handlePayment}
              disabled={!isTermsChecked || isProcessing}
            >
              {isProcessing ? "Processing..." : `Confirm and Pay ₱${(bookingDetails.total_amount*1.12).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentScreen;