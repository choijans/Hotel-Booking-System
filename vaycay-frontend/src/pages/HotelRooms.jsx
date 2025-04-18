import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelApi } from "../api";
import "./HotelRooms.css";

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
        const response = await hotelApi.get(`/getroomsbyhotel?hotel_id=${hotelId}`);
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
    // Apply sorting
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
    navigate(`/rooms/${roomId}/book`); // Navigate to RoomBooking with room_id
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <>
      <div className="search-section-container">
        <div className="search-section">
          <h1><b>Filter Rooms</b></h1>
          <div className="search-fields">
            <div className="date-field">
              <label>Check In</label>
              <input
                type="date"
                value={searchParams.checkIn}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, checkIn: e.target.value })
                }
              />
            </div>

            <div className="date-field">
              <label>Check Out</label>
              <input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, checkOut: e.target.value })
                }
              />
            </div>

            <div className="number-field">
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

            <div className="number-field">
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

            <div className="number-field">
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

            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="sort-options">
          <span className="sort-label">Sort by:</span>
          <select
            className="sort-dropdown"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="rooms-list">
        <h2>Rooms</h2>
        <div className="room-cards-container">
          {filteredRooms.map((room) => (
            <div key={room.room_id} className="room-card">
              <div className="room-details">
                <h3 className="room-name">Room {room.room_number}</h3>
                <p className="room-type"><strong>Type:</strong> {room.room_type?.type_name || "Unknown Type"}</p>
                <p className="room-price"><strong>Price:</strong> PHP {room.price}</p>
                <p className={`room-availability ${room.availability ? "available" : "unavailable"}`}>
                  {room.availability ? "Available" : "Unavailable"}
                </p>
                <button
                  className="book-now-button"
                  onClick={() => handleBookNow(room.room_id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HotelRooms;

