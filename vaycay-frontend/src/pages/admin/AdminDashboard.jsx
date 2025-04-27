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
          <div className="flex space-x-4">
            {/* <Link
              to="/admin/hotels"
              className="bg-gray-100 text-teal-600 px-4 py-2 rounded-md border border-teal-600 hover:bg-C1E3E2"
            >
              Explore Hotels
            </Link> */}
            <button className="bg-teal-600 text-white px-4 py-2 rounded-md">
              Add New Hotel
            </button>
          </div>
        </div>

        {/* Display loading, error, or table */}
        {loading ? (
          <p>Loading hotels...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Hotel Name</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.hotel_id}>
                  <td className="px-4 py-2">{hotel.hotel_id}</td>
                  <td className="px-4 py-2">{hotel.hotel_name}</td>
                  <td className="px-4 py-2">{hotel.location.location_name}</td>
                  <td className="px-4 py-2">{hotel.description}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                        <button>
                        <img src={editIcon} alt="Edit" className="w-6 h-6" />
                        </button>
                        <button>
                        <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bookings Management Section 
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Bookings Management</h2>
          <div className="flex space-x-4">
            <Link
              to="/admin/bookings"
              className="bg-gray-100 text-teal-600 px-4 py-2 rounded-md border border-teal-600 hover:bg-C1E3E2"
            >
              Explore Bookings
            </Link>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-md">
              Add New Booking
            </button>
          </div>
        </div>

        {/* Display loading, error, or table 
        {loadingBookings ? (
          <p>Loading bookings...</p>
        ) : errorBookings ? (
          <p className="text-red-500">{errorBookings}</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Booking ID</th>
                <th className="px-4 py-2 text-left">Hotel Name</th>
                <th className="px-4 py-2 text-left">Room Description</th>
                <th className="px-4 py-2 text-left">Check-In</th>
                <th className="px-4 py-2 text-left">Check-Out</th>
                <th className="px-4 py-2 text-left">Guest ID</th>
                <th className="px-4 py-2 text-left">Payment Status</th>
                <th className="px-4 py-2 text-left">Total Amount</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td className="px-4 py-2">{booking.booking_id}</td>
                  <td className="px-4 py-2">{booking.room.hotel.hotel_name}</td>
                  <td className="px-4 py-2">{booking.room.description}</td>
                  <td className="px-4 py-2">{booking.check_in_date}</td>
                  <td className="px-4 py-2">{booking.check_out_date}</td>
                  <td className="px-4 py-2">{booking.guest_id}</td>
                  <td className="px-4 py-2">{booking.payment_status}</td>
                  <td className="px-4 py-2">₱{booking.total_amount}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button>
                        <img src={editIcon} alt="Edit" className="w-6 h-6" />
                      </button>
                      <button>
                        <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> */}
    </div>
  );
};

export default AdminDashboard;