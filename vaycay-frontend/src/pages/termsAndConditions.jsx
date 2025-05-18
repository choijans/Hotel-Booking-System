import React from 'react';
import styles from './terms.module.css';
import backIcon from '../assets/back.png';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
    const navigate = useNavigate();
  return (
    <div className={styles.container}>
    <button
    onClick={() => navigate(-1)} 
    className="flex items-center space-x-2 mb-4"
    >
    <img src={backIcon} alt="Back"  />
    <span className=" hover:underline">Back</span>
    </button>
      <h1 className={styles.title}>Booking Terms & Conditions</h1>
      <p className={styles.intro}>
        These terms apply to all bookings made through our platform. By making a reservation, 
        you agree to these conditions.
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. General Booking Terms</h2>
        <p>
          Our platform connects you with various hotel providers. Each reservation is subject to 
          the individual hotel's policies in addition to these general terms.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Pricing & Payments</h2>
        <p>
          All prices shown are in the local currency of the hotel. We display the total price 
          including taxes where required by law. Payment is processed immediately upon booking.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Cancellations & Modifications</h2>
        <p>
          Cancellation policies vary by hotel and rate type. Please check the specific terms 
          during the booking process. Generally:
        </p>
        <ul className={styles.list}>
          <li>Free cancellation up to 24-48 hours before check-in for most hotels</li>
          <li>Non-refundable rates are clearly marked</li>
          <li>Modifications subject to availability</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>4. At the Property</h2>
        <p>
          Each hotel maintains its own check-in/check-out times, age requirements, and property 
          rules. These will be displayed in your confirmation email.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Privacy & Data</h2>
        <p>
          We share necessary booking information with the hotel to fulfill your reservation. 
          We never sell your personal data to third parties.
        </p>
      </div>

      <div className={styles.footer}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>For questions, please contact bookings@ourplatform.com</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;