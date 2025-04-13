import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../api";
import "./RecommendedHotels.css";

const RecommendedHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    destination: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await hotelApi.get("/getallhotels");
        if (response.data && response.data.hotels) {
          setHotels(response.data.hotels);
          setFilteredHotels(response.data.hotels);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Error fetching hotels:", err.response?.data || err.message);
        setError("Failed to fetch hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleSearch = () => {
    const filtered = hotels.filter((hotel) => {
      return (
        !searchParams.destination ||
        hotel.location.location_name
          .toLowerCase()
          .includes(searchParams.destination.toLowerCase())
      );
    });
    setFilteredHotels(filtered);
  };

  const handleViewRooms = (hotelId) => {
    navigate(`/hotels/${hotelId}/rooms`);
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <>
      <div className="search-section-container">
        <div className="search-section">
          <h1><b>Where to?</b></h1>
          <div className="search-fields">
            <div className="search-field">
              <label>Destination</label>
              <input
                type="text"
                placeholder="Select Destination"
                value={searchParams.destination}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, destination: e.target.value })
                }
              />
            </div>
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="recommended-hotels-container">
        <div className="hotels-list">
          {filteredHotels.map((hotel) => (
            <div key={hotel.hotel_id} className="hotel-card">
              <div className="hotel-image">
                <img
                  src="https://via.placeholder.com/300x200" // Replace with actual hotel image URL if available
                  alt={hotel.hotel_name}
                />
              </div>
              <div className="hotel-details">
                <h3 className="hotel-name">{hotel.hotel_name}</h3>
                <p className="hotel-location">{hotel.location.location_name}</p>
                <p className="hotel-address">📍 {hotel.location.location_name}</p>
                <div className="price-section">
                  <span className="price">₱{hotel.price?.toFixed(2) || "7,842.30"}</span>
                  <span className="per-night">Per Night</span>
                </div>
                <button
                  className="view-rooms-button"
                  onClick={() => handleViewRooms(hotel.hotel_id)}
                >
                  See Available Rooms
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecommendedHotels;