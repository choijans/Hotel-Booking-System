  import React, { useEffect, useState, useRef } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { useAuth } from "../context/AuthProvider";
  import axios from "axios";
  import ReactDatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  import styles from "./RoomBooking.module.css";
  import { motion } from "framer-motion";

  const RoomBooking = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [roomDetails, setRoomDetails] = useState(null);
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [extraAdults, setExtraAdults] = useState(0);
    const [extraChildren, setExtraChildren] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unavailableDates, setUnavailableDates] = useState([]);

    useEffect(() => {
      const fetchRoomDetails = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/rest/getroomdetails", {
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret",
            },
            params: {
              room_id: roomId,
            },
          });

          if (response.data?.rooms_by_pk) {
            setRoomDetails(response.data.rooms_by_pk);
          } else {
            throw new Error("Invalid response structure");
          }
        } catch (err) {
          console.error("Error fetching room details:", err);
          setError("Failed to fetch room details");
        } finally {
          setLoading(false);
        }
      };

      const fetchUnavailableDates = async () => {
        try {
          const response = await axios.get("http://localhost:8080/api/rest/getbookingsbyroom", {
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret",
            },
            params: {
              room_id: roomId,
            },
          });

          const bookings = response.data.bookings || [];
          const dates = bookings.flatMap((booking) => {
            const start = new Date(booking.check_in_date);
            const end = new Date(booking.check_out_date);
            const dateRange = [];
            for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
              dateRange.push(new Date(d).toISOString().split("T")[0]);
            }
            return dateRange;
          });

          setUnavailableDates(dates.map((date) => new Date(date))); // Convert to Date objects
        } catch (err) {
          console.error("Error fetching unavailable dates:", err);
        }
      };

      fetchRoomDetails();
      fetchUnavailableDates();
    }, [roomId]);

    useEffect(() => {
      if (roomDetails && checkInDate && checkOutDate) {
        const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
        const basePrice = nights * roomDetails.price;

        // Calculate extra charges
        const extraAdultCharge = extraAdults * 500 * nights; // Example: ₱500 per extra adult per night
        const extraChildCharge = extraChildren * 300 * nights; // Example: ₱300 per extra child per night

        setTotalPrice(basePrice + extraAdultCharge + extraChildCharge);
      }
    }, [roomDetails, checkInDate, checkOutDate, extraAdults, extraChildren]);

    const handleBookNow = () => {
      if (!checkInDate || !checkOutDate) {
        alert("Please select check-in and check-out dates.");
        return;
      }

      const today = new Date();
      if (checkInDate < today) {
        alert("Check-in date must be in the future.");
        return;
      }

      if (checkOutDate <= checkInDate) {
        alert("Check-out date must be after the check-in date.");
        return;
      }

      const bookingDetails = {
        room_id: parseInt(roomId),
        guest_id: currentUser?.id,
        check_in_date: checkInDate.toISOString().split("T")[0],
        check_out_date: checkOutDate.toISOString().split("T")[0],
        total_amount: totalPrice,
        room_details: roomDetails,
        adults,
        children,
        extra_adults: extraAdults,
        extra_children: extraChildren,
      };

      navigate("/payment", { state: bookingDetails });
    };

    
    const [popupImage, setPopupImage] = useState(null);
    const scrollRef = useRef(null);
      let animationFrameId = null;

      const startScroll = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const speed = direction === "left" ? -800 : 800; // pixels per frame, tweak for speed

        const step = () => {
          container.scrollLeft += speed;
          animationFrameId = requestAnimationFrame(step);
        };

        step();
      };

      const stopScroll = () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      };


    if (loading) return <div className={styles["roombooking-loading-spinner"]}></div>;
    if (error) return <p className={styles["roombooking-error-message"]}>Error: {error}</p>;
    if (!roomDetails) return <div>No room details available.</div>;


    return (
      <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
        <div className={styles["roombooking-page"]}>
          <div className={styles["roombooking-white-container"]}>
            <div className={styles["roombooking-header"]}>
              <div>
                <h1 className={styles["roombooking-title"]}>
                  {roomDetails.room_type?.type_name || "Room"}
                </h1>
                <p className={styles["roombooking-location"]}>
                  📍 {roomDetails.hotel?.hotel_name}, {roomDetails.hotel?.location?.location_name}
                </p>
                <div className={styles["roombooking-price"]}>
                  PHP {roomDetails.price.toFixed(2)} <span>Per Night</span>
                </div>
              </div>
            </div>

            <div className={styles["roombooking-thumbnail-wrapper"]}>
              <div
                className={styles["scroll-zone-left"]}
                onMouseEnter={() => startScroll("left")}
                onMouseLeave={stopScroll}
              />
              <div
                className={styles["scroll-zone-right"]}
                onMouseEnter={() => startScroll("right")}
                onMouseLeave={stopScroll}
              />
              <div ref={scrollRef} className={styles["roombooking-thumbnail-images"]}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`/src/assets/admin_pics/hotel${
                      ((roomDetails.room_id + i) % 3) + 1
                    }.jpg`}
                    alt={`Room Image ${i}`}
                    onClick={() =>
                      setPopupImage(`/src/assets/admin_pics/hotel${((roomDetails.room_id + i) % 3) + 1}.jpg`)
                    }
                    style={{ cursor: "pointer" }}
                  />

                ))}
              </div>
            </div>
            
            {popupImage && (
              <div
                className={styles["popup-overlay"]}
                onClick={() => setPopupImage(null)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  Index: 1000,
                }}
              >
                <img
                  src={popupImage}
                  alt="Popup"
                  style={{
                    maxHeight: "90%",
                    maxWidth: "90%",
                    boxShadow: "0 0 15px rgba(0,0,0,0.7)",
                    // border-radius: 10px,
                    borderRadius: "10px",
                  }}
                  onClick={(e) => e.stopPropagation()} // prevent closing when clicking on image
                />
              </div>
              )}
              


            <div className={styles["roombooking-content"]}>
              <div className={styles["roombooking-roomdetails"]}>
                <h2>Room Details</h2>
                <p>{roomDetails.description}</p>
              </div>

              <div className={styles["roombooking-form-container"]}>
                <div className={styles["roombooking-form"]}>
                  <h3>Book Your Stay</h3>
                  <label>Check In</label>
                  <ReactDatePicker
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    minDate={new Date()}
                    excludeDates={unavailableDates}
                    placeholderText="Select a check-in date"
                  />
                  <label>Check Out</label>
                  <ReactDatePicker
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    minDate={checkInDate || new Date()}
                    excludeDates={unavailableDates}
                    placeholderText="Select a check-out date"
                  />
                  
                  <label>Extra Adults</label>
                  <input
                    type="number"
                    min="0"
                    value={extraAdults}
                    onChange={(e) => setExtraAdults(parseInt(e.target.value))}
                  />
                  <label>Extra Children</label>
                  <input
                    type="number"
                    min="0"
                    value={extraChildren}
                    onChange={(e) => setExtraChildren(parseInt(e.target.value))}
                  />
                  <p className={styles["roombooking-total"]}>
                    Total: PHP {totalPrice.toFixed(2)}
                  </p>
                  <button onClick={handleBookNow} className={styles["roombooking-form-button"]}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  export default RoomBooking;