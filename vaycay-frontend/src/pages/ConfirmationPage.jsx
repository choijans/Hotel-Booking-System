import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ConfirmationPage.module.css"; // Updated import for CSS Modules

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking_id, bookingDetails } = location.state;

  // Calculate the total cost
  const nights = Math.ceil(
    (new Date(bookingDetails.check_out_date) - new Date(bookingDetails.check_in_date)) /
      (1000 * 60 * 60 * 24)
  );
  const roomRate = bookingDetails.room_details.price;
  const resortFee = 2500; // Example fixed resort fee
  const taxes = (roomRate * nights + resortFee) * 0.05; // Example 5% tax
  const totalCost = roomRate * nights + resortFee + taxes;

  return (
    <div className={styles["confirm-page-container"]}>
      <div className={styles["confirm-header"]}>
        <h1>Payment Successful!</h1>
        <p>Your booking has been confirmed and a confirmation email has been sent to your inbox.</p>
      </div>

      <div className={styles["confirm-details"]}>
        <h2>
          Booking Confirmation Number: <strong>{`VACAY-${booking_id}`}</strong>
        </h2>

        <div className={styles["confirm-booking-summary"]}>
          <div className={styles["confirm-booking-info"]}>
            <h3>Check-In</h3>
            <p>{bookingDetails.check_in_date}</p>
          </div>
          <div className={styles["confirm-booking-info"]}>
            <h3>Check-Out</h3>
            <p>{bookingDetails.check_out_date}</p>
          </div>
          <div className={styles["confirm-booking-info"]}>
            <h3>Guests</h3>
            <p>{bookingDetails.guests || "2 Adults, 0 Children"}</p>
          </div>
          <div className={styles["confirm-booking-info"]}>
            <h3>Rooms</h3>
            <p>1</p>
          </div>
        </div>

        <div className={styles["confirm-room-details"]}>
          <img
            src="https://via.placeholder.com/300x200" // Replace with actual room image if available
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

        <div className={styles["confirm-price-summary"]}>
          <h2>Payment Summary</h2>
          <p>
            <strong>Room Rate ({nights} nights):</strong> ₱{(roomRate * nights).toFixed(2)}
          </p>
          <p>
            <strong>Resort Fee:</strong> ₱{resortFee.toFixed(2)}
          </p>
          <p>
            <strong>Taxes:</strong> ₱{taxes.toFixed(2)}
          </p>
          <p className={styles["confirm-total"]}>
            <strong>Total Paid:</strong> ₱{totalCost.toFixed(2)}
          </p>
        </div>

        <div className={styles["confirm-actions"]}>
          <button
            className={styles["confirm-view-booking-button"]}
            onClick={() => navigate("/dashboard")}
          >
            View Booking Details
          </button>
          <button
            className={styles["confirm-download-receipt-button"]}
            onClick={() => alert("Receipt downloaded!")}
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;