import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RecommendedHotels.css"; // Create this CSS file

const RecommendedHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({
        destination: "",
        checkIn: "",
        checkOut: "",
        rooms: 1,
        adults: 1,
        children: 0
    });
    const [sortOption, setSortOption] = useState("price-asc");

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:4001/rooms", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const rooms = response.data.rooms || response.data.data?.rooms || [];
                setHotels(Array.isArray(rooms) ? rooms : []);
                setFilteredHotels(Array.isArray(rooms) ? rooms : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    useEffect(() => {
        // Apply sorting
        const sorted = [...filteredHotels].sort((a, b) => {
            if (sortOption === "price-asc") return a.price - b.price;
            if (sortOption === "price-desc") return b.price - a.price;
            return 0;
        });
        setFilteredHotels(sorted);
    }, [sortOption]);

    const handleSearch = () => {
        const filtered = hotels.filter(hotel => {
            return (
                (!searchParams.destination || 
                 hotel.location.toLowerCase().includes(searchParams.destination.toLowerCase())) &&
                hotel.availability
            );
        });
        setFilteredHotels(filtered);
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
                            onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                        />
                    </div>
                    
                    <div className="date-field">
                        <label>Check In</label>
                        <input 
                            type="date" 
                            value={searchParams.checkIn}
                            onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                        />
                    </div>
                    
                    <div className="date-field">
                        <label>Check Out</label>
                        <input 
                            type="date" 
                            value={searchParams.checkOut}
                            onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                        />
                    </div>
                    
                    <div className="number-field">
                        <label>Rooms</label>
                        <input 
                            type="number" 
                            min="1" 
                            value={searchParams.rooms}
                            onChange={(e) => setSearchParams({...searchParams, rooms: e.target.value})}
                        />
                    </div>
                    
                    <div className="number-field">
                        <label>Adults</label>
                        <input 
                            type="number" 
                            min="1" 
                            value={searchParams.adults}
                            onChange={(e) => setSearchParams({...searchParams, adults: e.target.value})}
                        />
                    </div>
                    
                    <div className="number-field">
                        <label>Children</label>
                        <input 
                            type="number" 
                            min="0" 
                            value={searchParams.children}
                            onChange={(e) => setSearchParams({...searchParams, children: e.target.value})}
                        />
                    </div>
                    
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>
            </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
            <div className="sort-options">
                <span className="sort-label">Sort</span>
                <select 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                </select>
            </div>
        </div>
        
        <div className="recommended-hotels-container">

        

            {/* Hotels List */}
            <div className="hotels-list">
                {filteredHotels.map((hotel) => (
                    <div key={hotel.room_id} className="hotel-card">
                        {/* <div className="hotel-image">
                            <img src="https://via.placeholder.com/300x200" alt="Hotel" />
                        </div> */}
                        <div className="hotel-details">
                            <h3 className="hotel-name">Shangri-La</h3>
                            <p className="hotel-location">Mactan, Cebu</p>
                            <p className="hotel-address">📍 Lapu-Lapu City, Cebu, Philippines</p>
                            <button className="map-button">Show on Map</button>
                            
                            <div className="price-section">
                                <span className="price">₱{hotel.price?.toFixed(2) || '7,842.30'}</span>
                                <span className="per-night">Per Night</span>
                            </div>
                            
                            <div className="room-details">
                                <p><strong>Room:</strong> {hotel.room_number}</p>
                                <p><strong>Type:</strong> {hotel.type_id}</p>
                                <p>{hotel.description}</p>
                                <p className={hotel.availability ? "available" : "unavailable"}>
                                    {hotel.availability ? "Available" : "Unavailable"}
                                </p>
                            </div>
                            
                            <button className="view-rooms-button">See Available Rooms</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default RecommendedHotels;