import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./HotelRooms.module.css";
import { motion } from "framer-motion";

const images = [
  "url('/src/assets/leftbg.jpg')",
  "url('/src/assets/bgbg.jpg')",
];

function CrossfadeBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 w-full h-[440px] pointer-events-none"
      style={{
        borderBottomLeftRadius: "25px",
        borderBottomRightRadius: "25px",
        boxShadow: "0 2px 14px rgba(0, 0, 0, 0.3)",
        zIndex: -1,
      }}
    >
      {images.map((bg, index) => (
        <div
          key={index}
          className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
          style={{
            backgroundImage: bg,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderBottomLeftRadius: "25px",
            borderBottomRightRadius: "25px",
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}
    </div>
  );
}


const HotelRooms = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    checkIn: "",
    checkOut: "",
  });
  const [sortOption, setSortOption] = useState("price-asc");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/rest/getroomsbyhotel?hotel_id=${hotelId}`,
          {
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret",
            },
          }
        );
    
        if (response.data && response.data.rooms) {
          // Log the API response to verify the data
          console.log("Rooms API Response:", response.data.rooms);
    
          // Ensure bookings are included in the response
          const roomsWithBookings = await Promise.all(
            response.data.rooms.map(async (room) => {
              const bookingsResponse = await axios.get(
                `http://localhost:8080/api/rest/getbookingsbyroom?room_id=${room.room_id}`,
                {
                  headers: {
                    "x-hasura-admin-secret": "supersecureadminsecret",
                  },
                }
              );
    
              return {
                ...room,
                bookings: bookingsResponse.data.bookings || [],
              };
            })
          );
    
          setRooms(roomsWithBookings);
          setFilteredRooms(roomsWithBookings);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Error fetching rooms:", err.response?.data || err.message);
        setError("Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    const fetchRoomTypes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/rest/getroomtypesbyhotel?hotel_id=${hotelId}`,
          {
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret",
            },
          }
        );

        if (response.data && response.data.room_types) {
          setRoomTypes(response.data.room_types);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Error fetching room types:", err.response?.data || err.message);
        setError("Failed to fetch room types");
      }
    };

    fetchRooms();
    fetchRoomTypes();
  }, [hotelId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = rooms.filter((room) => {
        // Room type filter
        if (selectedRoomType && room.room_type?.type_name !== selectedRoomType) {
          console.log("Room excluded due to type mismatch:", room.room_id);
          return false;
        }
  
        // Date filter
        if (searchParams.checkIn && searchParams.checkOut) {
          const checkInDate = new Date(searchParams.checkIn);
          const checkOutDate = new Date(searchParams.checkOut);
  
          console.log("Check-In Date:", checkInDate, "Check-Out Date:", checkOutDate);
  
          if (!(checkInDate instanceof Date) || isNaN(checkInDate) || !(checkOutDate instanceof Date) || isNaN(checkOutDate)) {
            console.log("Invalid dates provided.");
            return false;
          }
  
          if (!room.bookings || !Array.isArray(room.bookings)) {
            console.log("No bookings found for room:", room.room_id);
            return true;
          }
  
          console.log("Room Bookings for Room ID:", room.room_id, room.bookings);
  
          const isAvailable = room.bookings.every((booking) => {
            const bookingStart = new Date(booking.check_in_date);
            const bookingEnd = new Date(booking.check_out_date);
  
            console.log(
              "Booking Start:", bookingStart,
              "Booking End:", bookingEnd,
              "Check-In:", checkInDate,
              "Check-Out:", checkOutDate
            );
  
            // Room is available if the requested dates do not overlap with existing bookings
            return checkOutDate <= bookingStart || checkInDate >= bookingEnd;
          });
  
          if (!isAvailable) {
            console.log("Room unavailable for selected dates:", room.room_id);
          }
  
          return isAvailable;
        }
  
        // If no dates are selected, include all rooms
        console.log("No dates selected, including all rooms.");
        return true;
      });
  
      const sorted = [...filtered].sort((a, b) => {
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        return 0;
      });
  
      setFilteredRooms(sorted);
    }, 300);
  
    return () => clearTimeout(timer);
  }, [rooms, selectedRoomType, searchParams, sortOption]);

  const handleBookNow = (roomId) => {
    navigate(`/rooms/${roomId}/book`);
  };

  if (loading) return <div className={styles["hotelroom-loading-spinner"]}></div>;
  if (error) return <p className={styles["hotelroom-error-message"]}>Error: {error}</p>;

  return (
    <>
      <CrossfadeBackground />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles["hotelroom-search-section-container"]}>
          <div className={styles["hotelroom-search-section"]}>
            <h1 className="text-2xl font-bold" style={{ color: '#10716D' }}>Filter Rooms</h1>
            <div className={styles["hotelroom-search-fields"]}>
              <div className={styles["hotelroom-date-field"]}>
                <label>Check In</label>
                <input
                  type="date"
                  value={searchParams.checkIn}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, checkIn: e.target.value })
                  }
                />
              </div>

              <div className={styles["hotelroom-date-field"]}>
                <label>Check Out</label>
                <input
                  type="date"
                  value={searchParams.checkOut}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, checkOut: e.target.value })
                  }
                />
              </div>

              <div className={styles["hotelroom-number-field"]}>
                <label>Room Type</label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className={styles["hotelroom-sort-dropdown"]}
                >
                  <option value="">All Room Types</option>
                  {roomTypes.map((type) => (
                    <option key={type.type_id} value={type.type_name}>
                      {type.type_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles["hotelroom-filters-section"]}>
          <div className={styles["hotelroom-sort-options"]}>
            <span className={styles["hotelroom-sort-label"]}>Sort by:</span>
            <select
              className={styles["hotelroom-sort-dropdownn"]}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        <div className={styles["hotelroom-rooms-list"]}>
          <h2>Available Rooms</h2>

          {filteredRooms.length === 0 ? (
            <div className={styles["hotelroom-no-rooms"]}>
              <p>No rooms match your search criteria. Try different dates or filters.</p>
            </div>
          ) : (
            <div className={styles["hotelroom-room-cards-container"]}>
              {filteredRooms.map((room) => (
                <div key={room.room_id} className={styles["hotelroom-room-card"]}>
                  <div className={styles["hotelroom-room-image"]}>
                    <img
                      src={`/src/assets/admin_pics/hotel${(room.room_id % 3) + 1}.jpg`}
                      alt={room.room_name}
                    />
                  </div>
                  <div className={styles["hotelroom-room-details"]}>
                    {/*<h3 className={styles["hotelroom-room-name"]}>Room {room.room_number}</h3>
                        removed room number*/}
                    <p className={styles["hotelroom-room-type"]}>
                      <strong>{room.room_type?.type_name || "Standard Room"}</strong>
                    </p>
                    <p className={styles["hotelroom-room-price"]}>
                      <strong>Price:</strong> PHP {room.price.toLocaleString()}
                    </p>
                    {/* <span
                      className={`${styles["hotelroom-room-availability"]} ${
                        room.availability ? styles["hotelroom-available"] : styles["hotelroom-unavailable"]
                      }`}
                    >
                      {room.availability ? "Available" : "Unavailable"}
                    </span> */}
                    <button
                      className={styles["hotelroom-book-now-button"]}
                      onClick={() => handleBookNow(room.room_id)}
                      disabled={!room.availability}
                    >
                      {room.availability ? "Book Now" : "Not Available"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default HotelRooms;