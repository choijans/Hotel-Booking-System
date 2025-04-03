import React, { useEffect, useState } from "react";
import axios from "axios";

const RecommendedHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:4001/rooms", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await response.json();
        
                // Check for GraphQL errors
                if (data.errors) {
                    throw new Error(`Hasura error: ${data.errors[0].message}`);
                }
        
                // Successful response
                setHotels(data.data.rooms); 
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
                        <p>Price: ${typeof hotel.price === "number" ? hotel.price.toFixed(2) : "N/A"}</p>
                        <p>Availability: {hotel.availability ? "Available" : "Unavailable"}</p>
                        <p>Status: {hotel.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedHotels;