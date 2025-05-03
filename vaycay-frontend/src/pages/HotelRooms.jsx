import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelApi } from "../api";
import styles from "./HotelRooms.module.css";

const HotelRooms = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    checkIn: "",
    checkOut: "",
    rooms: 1,
    adults: 1,
    children: 0,
  });
  const [sortOption, setSortOption] = useState("price-asc");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/rest/getroomsbyhotel?hotel_id=${hotelId}`, {
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            },
          });
        if (response.data && response.data.rooms) {
          setRooms(response.data.rooms);
          setFilteredRooms(response.data.rooms);
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

    fetchRooms();
  }, [hotelId]);

  useEffect(() => {
    const sorted = [...filteredRooms].sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      return 0;
    });
    setFilteredRooms(sorted);
  }, [sortOption]);

  const handleSearch = () => {
    const filtered = rooms.filter((room) => {
      const isAvailable = room.bookings.every((booking) => {
        const bookingStart = new Date(booking.check_in_date);
        const bookingEnd = new Date(booking.check_out_date);
        const searchStart = new Date(searchParams.checkIn);
        const searchEnd = new Date(searchParams.checkOut);

        return searchEnd <= bookingStart || searchStart >= bookingEnd;
      });

      return isAvailable;
    });

    setFilteredRooms(filtered);
  };

  const handleBookNow = (roomId) => {
    navigate(`/rooms/${roomId}/book`);
  };

  if (loading) return <div className={styles["hotelroom-loading-spinner"]}></div>;
  if (error) return <p className={styles["hotelroom-error-message"]}>Error: {error}</p>;

  return (
    <>
      <div
        className="absolute top-0 left-0 w-full z-[-1]"
        style={{
          height: '440px',
          backgroundImage: `url('/src/assets/leftbg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderBottomLeftRadius: '25px',
          borderBottomRightRadius: '25px',
          boxShadow: '0 2px 14px rgba(0, 0, 0, 0.3)',
        }}
      ></div>
      <div className={styles["hotelroom-search-section-container"]}>
        <div className={styles["hotelroom-search-section"]}>
          {/* <h1>Filter Rooms</h1> */}
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
              <label>Rooms</label>
              <input
                type="number"
                min="1"
                value={searchParams.rooms}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, rooms: e.target.value })
                }
              />
            </div>

            <div className={styles["hotelroom-number-field"]}>
              <label>Adults</label>
              <input
                type="number"
                min="1"
                value={searchParams.adults}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, adults: e.target.value })
                }
              />
            </div>

            <div className={styles["hotelroom-number-field"]}>
              <label>Children</label>
              <input
                type="number"
                min="0"
                value={searchParams.children}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, children: e.target.value })
                }
              />
            </div>

            <button className={styles["hotelroom-search-button"]} onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className={styles["hotelroom-filters-section"]}>
        <div className={styles["hotelroom-sort-options"]}>
          <span className={styles["hotelroom-sort-label"]}>Sort by:</span>
          <select
            className={styles["hotelroom-sort-dropdown"]}
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
                  <h3 className={styles["hotelroom-room-name"]}>Room {room.room_number}</h3>
                  <p className={styles["hotelroom-room-type"]}><strong>Type:</strong> {room.room_type?.type_name || "Standard Room"}</p>
                  <p className={styles["hotelroom-room-price"]}><strong>Price:</strong> PHP {room.price.toLocaleString()}</p>
                  <span className={`${styles["hotelroom-room-availability"]} ${room.availability ? styles["hotelroom-available"] : styles["hotelroom-unavailable"]}`}>
                    {room.availability ? "Available" : "Unavailable"}
                  </span>
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
    </>
  );
};

export default HotelRooms;