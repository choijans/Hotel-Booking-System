import React, { useEffect, useState } from "react";
import axios from "axios";

const RecommendedHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const token = localStorage.getItem("jwtToken"); // Assuming token is stored in localStorage
                const response = await axios.get("http://localhost:4001/rooms", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHotels(Array.isArray(response.data.rooms) ? response.data.rooms : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Recommended Hotels</h1>
            <div className="hotel-list">
                {hotels.map((hotel) => (
                    <div key={hotel.room_id} className="hotel-card">
                        <h2>Room {hotel.room_number}</h2>
                        <p>Type ID: {hotel.type_id}</p>
                        <p>Description: {hotel.description}</p>
                        <p>Price: ${hotel.price.toFixed(2)}</p>
                        <p>Availability: {hotel.availability ? "Available" : "Unavailable"}</p>
                        <p>Status: {hotel.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedHotels;