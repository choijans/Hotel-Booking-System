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
  const extraAdultCharge = bookingDetails.extra_adults * 500 * nights; // Example: ₱500 per extra adult per night
  const extraChildCharge = bookingDetails.extra_children * 300 * nights; // Example: ₱300 per extra child per night
  const totalCost = roomRate * nights + extraAdultCharge + extraChildCharge;

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
    doc.text(`Adults: ${bookingDetails.adults}`, 10, 50);
    doc.text(`Children: ${bookingDetails.children}`, 10, 60);
    doc.text(`Extra Adults: ${bookingDetails.extra_adults}`, 10, 70);
    doc.text(`Extra Children: ${bookingDetails.extra_children}`, 10, 80);

    // Add room details
    doc.text(`Room: ${bookingDetails.room_details.room_type?.type_name || "Room"}`, 10, 90);
    doc.text(
      `Hotel: ${bookingDetails.room_details.hotel?.hotel_name}, ${bookingDetails.room_details.hotel?.location?.location_name}`,
      10,
      100
    );

    // Add payment summary
    doc.text("Payment Summary:", 10, 120);
    doc.text(`Room Rate (${nights} nights): ₱${(roomRate * nights).toFixed(2)}`, 10, 130);
    doc.text(`Extra Adults: ₱${extraAdultCharge.toFixed(2)}`, 10, 140);
    doc.text(`Extra Children: ₱${extraChildCharge.toFixed(2)}`, 10, 150);
    doc.text(`Total Paid: ₱${totalCost.toFixed(2)}`, 10, 160);

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
            <h3>Extra Adults</h3>
            <p>{bookingDetails.extra_adults}</p>
          </div>
          <div className={styles["confirm-booking-info"]}>
            <h3>Extra Children</h3>
            <p>{bookingDetails.extra_children}</p>
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
            <strong>Extra Adults:</strong> ₱{extraAdultCharge.toFixed(2)}
          </p>
          <p>
            <strong>Extra Children:</strong> ₱{extraChildCharge.toFixed(2)}
          </p>
          <p className={styles["confirm-total"]}>
            <strong>Total Paid:</strong> ₱{totalCost.toFixed(2)}
          </p>
        </div>

        <div className={styles["confirm-actions"]}>
          <button
            className={styles["confirm-view-booking-button"]}
            onClick={() => navigate("/profile?tab=Booking History")}
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