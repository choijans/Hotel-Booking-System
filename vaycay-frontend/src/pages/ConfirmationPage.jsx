import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import styles from "./ConfirmationPage.module.css";
import { motion } from "framer-motion";

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
  const extraAdultCharge = bookingDetails.extra_adults * 500 * nights;
  const extraChildCharge = bookingDetails.extra_children * 300 * nights;
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
    doc.text(`Extra Adults: ${bookingDetails.extra_adults}`, 10, 50);
    doc.text(`Extra Children: ${bookingDetails.extra_children}`, 10, 60);
    doc.text(`Total Adults: ${bookingDetails.adults}`, 10, 70);
    doc.text(`Total Children: ${bookingDetails.children}`, 10, 80);

    // Add room details
    doc.text(`Room: ${bookingDetails.room_details.room_type?.type_name || "Room"}`, 10, 90);
    doc.text(
      `Hotel: ${bookingDetails.room_details.hotel?.hotel_name}, ${bookingDetails.room_details.hotel?.location?.location_name}`,
      10,
      100
    );

    // Add payment summary
    doc.text("Payment Summary:", 10, 120);
    doc.text(`Room Rate (${nights} nights): ₱${(roomRate * nights).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 130);
    doc.text(`Extra Adults: ₱${extraAdultCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 140);
    doc.text(`Extra Children: ₱${extraChildCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 150);
    doc.text(`Total Paid: ₱${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 160);

    // Save the PDF
    doc.save(`Receipt-VACAY-${booking_id}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles["confirm-page-container"]}>
        <div className={styles["success-banner"]}>
          <div className={styles["success-icon"]}>✓</div>
          <div className={styles["success-message"]}>
            <h2>Payment Successful!</h2>
            <p>Your booking has been confirmed and a confirmation email has been sent to your inbox.</p>
          </div>
        </div>

        <div className={styles["booking-number"]}>
          <h3>Booking Confirmation Number</h3>
          <p>VACAY-{booking_id}</p>
        </div>

        <div className={styles["booking-details"]}>
          <div className={styles["detail-item"]}>
            <h4>Check-In</h4>
            <p>{new Date(bookingDetails.check_in_date).toLocaleDateString()}</p>
            <small>After 2:00 PM</small>
          </div>
          <div className={styles["detail-item"]}>
            <h4>Check-Out</h4>
            <p>{new Date(bookingDetails.check_out_date).toLocaleDateString()}</p>
            <small>Before 12:00 PM</small>
          </div>
          <div className={styles["detail-item"]}>
            <h4>Total Adults</h4>
            <p>{bookingDetails.adults}</p>
            <small>{bookingDetails.extra_adults > 0 ? `+${bookingDetails.extra_adults} extra` : 'Base booking'}</small>
          </div>
          <div className={styles["detail-item"]}>
            <h4>Total Children</h4>
            <p>{bookingDetails.children}</p>
            <small>{bookingDetails.extra_children > 0 ? `+${bookingDetails.extra_children} extra` : 'Base booking'}</small>
          </div>
        </div>

        <div className={styles["room-details"]}>
          <div className={styles["room-image"]}>
            <img
              src="/src/assets/admin_pics/hotel1.jpg"
              alt={bookingDetails.room_details.room_type?.type_name || "Room"}
            />
          </div>
          <div className={styles["room-info"]}>
            <h3>
              {bookingDetails.room_details.room_type?.type_name || "Room"}
              <div className={styles["room-amenities"]}>
                <span className={styles["room-amenity"]}>Ocean View</span>
                <span className={styles["room-amenity"]}>Balcony</span>
                <span className={styles["room-amenity"]}>Free Wi-Fi</span>
              </div>
            </h3>
            <p className={styles["hotel-location"]}>
              📍
              {bookingDetails.room_details.hotel?.hotel_name},{" "}
              {bookingDetails.room_details.hotel?.location?.location_name}
            </p>
            <p className={styles["room-description"]}>{bookingDetails.room_details.description}</p>
          </div>
        </div>

        <div className={styles["payment-summary"]}>
          <h3 className={styles["summary-title"]}>Payment Summary</h3>
          <table className={styles["summary-table"]}>
            <tr>
              <td>Room Rate ({nights} nights)</td>
              <td>₱{(roomRate * nights).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td>Extra Adults ({bookingDetails.extra_adults})</td>
              <td>₱{extraAdultCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td>Extra Children ({bookingDetails.extra_children})</td>
              <td>₱{extraChildCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </table>
          <div className={styles["summary-total"]}>
            <p>Total Paid</p>
            <p className={styles["amount"]}>₱{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className={styles["action-buttons"]}>
          <button 
            className={`${styles["btn"]} ${styles["btn-primary"]}`}
            onClick={() => navigate("/profile?tab=Booking History")}
          >
            View Booking Details
          </button>
          <button 
            className={`${styles["btn"]} ${styles["btn-outline"]}`}
            onClick={downloadReceipt}
          >
            Download Receipt
          </button>
        </div>
        
        <div className={styles["contact-info"]}>
          <p>Need help with your booking?</p>
          <p>Contact us at <strong>support@vacay.com</strong> or call <strong>+63 1234 567 890</strong></p>
        </div>

        <div className={styles["footer"]}>
          <p>Thank you for booking with Vacay! <a href="/profile?tab=Booking History">View your bookings</a></p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmationPage;