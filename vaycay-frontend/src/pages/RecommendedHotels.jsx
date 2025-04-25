import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../api";
import styles from "./RecommendedHotels.module.css"; // Updated import for CSS Modules

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

  if (loading) return <div className={styles["recohotels-loading-spinner"]}></div>;
  if (error) return <p className={styles["recohotels-error-message"]}>Error: {error}</p>;

  return (
    <>
      <div className={styles["recohotels-search-section-container"]}>
        <div className={styles["recohotels-search-section"]}>
          <h1><b>Where to?</b></h1>
          <div className={styles["recohotels-search-fields"]}>
            <div className={styles["recohotels-search-field"]}>
              <label>Destination</label>
              <input
                type="text"
                placeholder="Select Destination"
                value={searchParams.destination}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, destination: e.target.value })
                }
              />
              <button className={styles["recohotels-search-button"]} onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["recohotels-recommended-hotels-container"]}>
        <div className={styles["recohotels-hotels-list"]}>
          {filteredHotels.map((hotel) => (
            <div key={hotel.hotel_id} className={styles["recohotels-hotel-card"]}>
              <div className={styles["recohotels-hotel-image"]}>
                <img
                  src="https://via.placeholder.com/300x200" // Replace with actual hotel image URL if available
                  alt={hotel.hotel_name}
                />
              </div>
              <div className={styles["recohotels-hotel-details"]}>
                <h3 className={styles["recohotels-hotel-name"]}>{hotel.hotel_name}</h3>
                <p className={styles["recohotels-hotel-location"]}>{hotel.location.location_name}</p>
                <p className={styles["recohotels-hotel-address"]}>📍 {hotel.location.location_name}</p>
                <div className={styles["recohotels-price-section"]}>
                  <span className={styles["recohotels-price"]}>₱{hotel.price?.toFixed(2) || "7,842.30"}</span>
                  <span className={styles["recohotels-per-night"]}>Per Night</span>
                </div>
                <button
                  className={styles["recohotels-view-rooms-button"]}
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