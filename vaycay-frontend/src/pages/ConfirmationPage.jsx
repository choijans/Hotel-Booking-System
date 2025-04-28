import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import styles from "./ConfirmationPage.module.css";

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

  // Function to generate and download the receipt
  const downloadReceipt = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Booking Receipt", 10, 10);

    // Add booking details
    doc.setFontSize(12);
    doc.text(`Booking ID: VACAY-${booking_id}`, 10, 20);
    doc.text(`Check-In: ${bookingDetails.check_in_date}`, 10, 30);
    doc.text(`Check-Out: ${bookingDetails.check_out_date}`, 10, 40);
    doc.text(`Guests: ${bookingDetails.guests} Guests`, 10, 50);

    // Add room details
    doc.text(`Room: ${bookingDetails.room_details.room_type?.type_name || "Room"}`, 10, 60);
    doc.text(
      `Hotel: ${bookingDetails.room_details.hotel?.hotel_name}, ${bookingDetails.room_details.hotel?.location?.location_name}`,
      10,
      70
    );

    // Add payment summary
    doc.text("Payment Summary:", 10, 90);
    doc.text(`Room Rate (${nights} nights): ₱${(roomRate * nights).toFixed(2)}`, 10, 100);
    doc.text(`Resort Fee: ₱${resortFee.toFixed(2)}`, 10, 110);
    doc.text(`Taxes: ₱${taxes.toFixed(2)}`, 10, 120);
    doc.text(`Total Paid: ₱${totalCost.toFixed(2)}`, 10, 130);

    // Save the PDF
    doc.save(`Receipt-VACAY-${booking_id}.pdf`);
  };

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
            <p>
              {bookingDetails.guests} {bookingDetails.guests > 1 ? "Guests" : "Guest"}
            </p>
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
            onClick={downloadReceipt}
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;