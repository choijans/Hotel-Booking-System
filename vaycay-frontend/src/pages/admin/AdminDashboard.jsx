import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
import editIcon from "../../assets/Edit.png"
import deleteIcon from "../../assets/delete.png";
import searchIcon from "../../assets/search.png";

const AdminDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]); // State to store booking data
    const [loadingBookings, setLoadingBookings] = useState(true); // State to handle booking loading
    const [errorBookings, setErrorBookings] = useState(null); // State to handle booking errors
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [errorRooms, setErrorRooms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalBookings, setTotalBookings] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

  // Fetch hotels from the REST API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getallhotels", {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });
        console.log("Hotels API Response:", response.data);
        setHotels(response.data.hotels); // Set the fetched hotels data
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError("Failed to fetch hotels. Please try again later.");
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchHotels();
  }, []);


  // Fetch bookings from the REST API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getbookings", {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });
        console.log("Bookings API Response:", response.data);
        setBookings(response.data.bookings); // Set the fetched bookings data
        setLoadingBookings(false); // Set loading to false after data is fetched
      } catch (err) {
        setErrorBookings("Failed to fetch bookings. Please try again later.");
        setLoadingBookings(false); // Set loading to false even if there's an error
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/v1/graphql",
          {
            query: `
              query GetDashboardStats {
                bookings_aggregate {
                  aggregate {
                    count
                  }
                }
                users_aggregate {
                  aggregate {
                    count
                  }
                }
              }
            `,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            },
          }
        );
  
        // Correctly access the data
        const data = response.data.data;
        console.log("Dashboard Stats:", data);
        setTotalBookings(data.bookings_aggregate.aggregate.count);
        setActiveUsers(data.users_aggregate.aggregate.count);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
  
    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <h1 className="text-2xl font-bold">Dashboard!</h1>
      <p>Welcome Admin!</p>

      {/* Transparent horizontal line */}
      <div className="w-full h-0.5 bg-black bg-opacity-20 my-4"></div>

      {/* Centered stats section */}
      <div className="flex justify-center space-x-8 mt-8">
        {/* Total Bookings */}
        <div className=" p-6 text-center">
          <h2 className="text-xl font-bold">Total Bookings</h2>
          <p className="text-3xl font-semibold text-teal-600">{totalBookings}</p>
        </div>

        {/* Active Users */}
        <div className=" p-6 text-center">
          <h2 className="text-xl font-bold">Active Users</h2>
          <p className="text-3xl font-semibold text-teal-600">{activeUsers}</p>
        </div>
      </div>

      {/* Hotels Management Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Hotels Management</h2>
          <button
            className="bg-teal-600 text-white px-4 py-2 rounded-md"
            onClick={() => (window.location.href = "/admin/hotels/addhotel")}
          >
            Add New Hotel
          </button>
        </div>

        {/* Display loading, error, or grid */}
        {loading ? (
          <p>Loading hotels...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, index) => {
              // Cycle through static images
              const imageIndex = (index % 3) + 1; // Cycles between 1, 2, and 3
              const imagePath = `/src/assets/admin_pics/hotel${imageIndex}.jpg`;

              return (
                <div
                  key={hotel.hotel_id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => (window.location.href = `/admin/hotels/${hotel.hotel_id}`)} // Redirect to hotel details page
                >
                  {/* Hotel Image */}
                  <img
                    src={imagePath}
                    alt={hotel.hotel_name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-teal-600">{hotel.hotel_name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Location: {hotel.location.location_name}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                      {hotel.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;