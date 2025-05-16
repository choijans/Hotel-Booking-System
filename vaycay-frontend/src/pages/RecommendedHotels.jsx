import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../api";
import styles from "./RecommendedHotels.module.css";
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

const RecommendedHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    hotelName: "",
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getallhotels", {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret",
          },
        });
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
      const matchesHotelName = !searchParams.hotelName || hotel.hotel_name.toLowerCase().includes(searchParams.hotelName.toLowerCase());
      const matchesLocation = !searchParams.location || hotel.location.location_name.toLowerCase().includes(searchParams.location.toLowerCase());
      return matchesHotelName && matchesLocation;
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
      <CrossfadeBackground />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles["recohotels-search-section-container"]}>
            <div className={styles["recohotels-search-section"]}>
              <h1 className="text-2xl font-bold" style={{ color: '#10716D' }}>Where to?</h1>
              <div className={styles["recohotels-search-fields"]}>
                <div className={styles["recohotels-search-field"]}>
                  <label>Hotel Name</label>
                  <input
                    type="text"
                    placeholder="Search by hotel name"
                    value={searchParams.hotelName}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, hotelName: e.target.value })
                    }
                  />
                </div>
                <div className={styles["recohotels-search-field"]}>
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="Search by location"
                    value={searchParams.location}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, location: e.target.value })
                    }
                  />
                </div>
                <button className={styles["recohotels-search-button"]} onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className={styles["recohotels-recommended-hotels-container"]}>
            <div className={styles["recohotels-hotels-list"]}>
              {filteredHotels.map((hotel) => (
                <div key={hotel.hotel_id} className={styles["recohotels-hotel-card"]}>
                  <div className={styles["recohotels-hotel-image"]}>
                    <img
                      src={`/src/assets/admin_pics/hotel${(hotel.hotel_id % 3) + 1}.jpg`}
                      alt={hotel.hotel_name}
                    />
                  </div>
                  <div className={styles["recohotels-hotel-details"]}>
                    <h3 className={styles["recohotels-hotel-name"]}>{hotel.hotel_name}</h3>
                    <p className={styles["recohotels-hotel-location"]}>{hotel.location.location_name}</p>
                    <p className={styles["recohotels-hotel-address"]}>📍 {hotel.location.location_name}</p>
                    <div className={styles["recohotels-price-section"]}>
                      <span className={styles["recohotels-price"]}>
                        Starting from ₱{hotel.rooms_aggregate.aggregate.min.price?.toFixed(2) || "N/A"}
                      </span>
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
        </motion.div>
    </>
  );
};

export default RecommendedHotels;
