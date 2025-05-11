import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const HotelDetails = () => {
  const { hotel_id } = useParams();
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomTypeToDelete, setRoomTypeToDelete] = useState(null); 
  const [showDeleteRoomTypeConfirmation, setShowDeleteRoomTypeConfirmation] = useState(false); 
  const [activeTab, setActiveTab] = useState("rooms");
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [showDeleteBookingConfirmation, setShowDeleteBookingConfirmation] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]); 
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [showDeletePaymentConfirmation, setShowDeletePaymentConfirmation] = useState(false);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/gethoteldata", {
          params: { hotel_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          },
        });

        const bookingIds = response.data.bookings.map((booking) => booking.booking_id); // Extract booking IDs

        // Fetch payments using the booking IDs
        const paymentsResponse = await axios.post(
          "http://localhost:8080/api/rest/getpayments",
          { booking_ids: bookingIds }, // Pass booking IDs dynamically
          {
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data); // Log the API response
        setHotelData({
          ...response.data.hotels_by_pk,
          bookings: response.data.bookings, // Include bookings in the state
          payments: paymentsResponse.data.payments,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hotel data:", err);
        setError("Failed to load hotel data. Please try again later.");
        setLoading(false);
      }
    };

    fetchHotelData();

    const getAllRoomTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/rest/getroomtypesbyhotel", // REST API endpoint
          {
            params: { hotel_id }, // Pass the hotel_id as a query parameter
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            },
          }
        );

        console.log("Fetched Room Types:", response.data.room_types); // Debugging log
        setRoomTypes(response.data.room_types); // Set the fetched room types
      } catch (err) {
        console.error("Error fetching room types:", err.response?.data || err.message);
        setError("Failed to fetch room types. Please try again.");
      }
    };

    getAllRoomTypes();
  }, [hotel_id]);
  
  const handleDeleteRoomType = (type_id) => {
    setRoomTypeToDelete(type_id); 
    setShowDeleteRoomTypeConfirmation(true); 
  };

  const confirmDeleteRoomType = async () => {
    try {
      console.log("Deleting room type with ID:", roomTypeToDelete);
  
      await axios.post(
        "http://localhost:8080/api/rest/deleteroomtype", // REST API endpoint
        {
          type_id: roomTypeToDelete,
        },
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            "Content-Type": "application/json",
          },
        }
      );
  
      // Refresh the room types list after deleting the room type
      const response = await axios.get(
        "http://localhost:8080/api/rest/getroomtypesbyhotel", // REST API endpoint to fetch room types
        {
          params: { hotel_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret",
          },
        }
      );
  
      setRoomTypes(response.data.room_types);
      setShowDeleteRoomTypeConfirmation(false);
      setRoomTypeToDelete(null);
      alert("Room type deleted successfully.");
    } catch (err) {
      console.error("Error deleting room type:", err.response?.data || err.message);
  
      if (err.response?.data?.code === "constraint-violation") {
        alert(
          "Cannot delete this room type because it is associated with existing rooms. Please delete the associated rooms first."
        );
      } else {
        alert("Failed to delete room type. Please try again.");
      }
    }
  };

  const handleDeleteBooking = (booking_id) => {
    setBookingToDelete(booking_id);
    setShowDeleteBookingConfirmation(true); 
  };
  
  const confirmDeleteBooking = async () => {
    try {
      await axios.request({
        method: "DELETE",
        url: "http://localhost:8080/api/rest/deletebooking",
        data: { booking_id: bookingToDelete },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          "Content-Type": "application/json",
        },
      });
  
      // Refresh the hotel data after deletion
      const response = await axios.get("http://localhost:8080/api/rest/gethoteldata", {
        params: { hotel_id },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret",
        },
      });
  
      setHotelData({
        ...response.data.hotels_by_pk,
        bookings: response.data.bookings, // Update bookings in the state
      });
      setShowDeleteBookingConfirmation(false);
      setBookingToDelete(null);
    } catch (err) {
      console.error("Error deleting booking:", err.response?.data || err.message);
      alert("Failed to delete the booking. Please try again.");
    }
  };

  const handleDeletePayment = (payment_id) => {
    setPaymentToDelete(payment_id);
    setShowDeletePaymentConfirmation(true);
  };
  
  const confirmDeletePayment = async () => {
    try {
      await axios.request({
        method: "DELETE",
        url: "http://localhost:8080/api/rest/deletepayment", // REST API endpoint for deleting payment
        data: { payment_id: paymentToDelete },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
          "Content-Type": "application/json",
        },
      });
  
      // Refresh the hotel data after deletion
      const response = await axios.get("http://localhost:8080/api/rest/gethoteldata", {
        params: { hotel_id },
        headers: {
          "x-hasura-admin-secret": "supersecureadminsecret",
        },
      });
  
      setHotelData({
        ...response.data.hotels_by_pk,
        payments: response.data.payments, // Update payments in the state
      });
      setShowDeletePaymentConfirmation(false);
      setPaymentToDelete(null);
      alert("Payment deleted successfully.");
    } catch (err) {
      console.error("Error deleting payment:", err.response?.data || err.message);
      alert("Failed to delete the payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="flex items-center space-x-2 mb-4"
      >
        <img src={backIcon} alt="Back" />
        <span className="hover:underline">Back</span>
      </button>

      <div className="flex">
        <h1 className="text-2xl font-bold text-teal-600">Hotel Details</h1>
        <button
          onClick={() => navigate(`/admin/hotels/${hotel_id}/edit`)}
          className="ml-4"
        >
          <img src="/src/assets/edit.png" alt="Edit" className="w-6 h-6" />
        </button>
      </div>
      {loading ? (
        <p className="text-teal-600 mt-4">Loading hotel details...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <div>
          <div className="mt-4">
            <p><strong>Hotel Name:</strong> {hotelData.hotel_name}</p>
            <p><strong>Description:</strong> {hotelData.description}</p>
            <p><strong>Location:</strong> {hotelData.location.location_name}</p>
            <p><strong>Location Description:</strong> {hotelData.location.description}</p>
          </div>

          <div className="mt-8">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "rooms" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("rooms")}
              >
                Room Types
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "bookings" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("bookings")}
              >
                Bookings
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "payments" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("payments")}
              >
                Payments
              </button>
            </div>

            {activeTab === "rooms" && (
            <div className="mt-4">
              {/* Room Types Section */}
              <div className="mt-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Room Types</h2>
                  <div className="flex space-x-4">
                    {/* Add New Room Button */}
                    <button
                      className="bg-teal-600 text-white px-4 py-2 rounded-md"
                      onClick={() => navigate(`/admin/hotels/${hotel_id}/addroom`)}
                    >
                      Add New Room
                    </button>
                    {/* Add Room Type Button */}
                    <button
                      className="bg-teal-600 text-white px-4 py-2 rounded-md"
                      onClick={() => navigate(`/admin/hotels/${hotel_id}/addroomtype`)}
                    >
                      Add Room Type
                    </button>
                  </div>
                </div>
                <table className="w-full bg-white shadow-md rounded-lg mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Type Name</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomTypes && roomTypes.length > 0 ? (
                      roomTypes.map((type) => (
                        <tr key={type.type_id}>
                          <td
                            className="px-4 py-2 text-teal-600 cursor-pointer hover:underline"
                            onClick={() =>
                              navigate(`/admin/hotels/${hotel_id}/roomtypes/${type.type_id}/rooms`)
                            }
                          >
                            {type.type_name}
                          </td>
                          <td className="px-4 py-2">{type.description}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => navigate(`/admin/hotels/${hotel_id}/roomtypes/${type.type_id}/edit`)}
                              className="mr-4"
                            >
                              <img
                                src="/src/assets/edit.png"
                                alt="Edit"
                                className="w-6 h-6 hover:opacity-80"
                              />
                            </button>
                            <button
                              onClick={() => handleDeleteRoomType(type.type_id)}
                            >
                              <img
                                src="/src/assets/delete.png"
                                alt="Delete"
                                className="w-6 h-6 hover:opacity-80"
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                          No room types found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

            {activeTab === "bookings" && (
              <div className="mt-4">
                
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Bookings</h2>
                  <div className="flex space-x-4">
                    {/* Add New Room Button */}
                    <button
                      onClick={() => navigate(`/admin/hotels/${hotel_id}/addbooking`)}
                      className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                    >
                      Add Booking
                    </button>
                  </div>
                </div>
                
                <table className="w-full bg-white shadow-md rounded-lg mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Booking ID</th>
                      <th className="px-4 py-2 text-left">Guest ID</th>
                      <th className="px-4 py-2 text-left">Room Number</th>
                      <th className="px-4 py-2 text-left">Check-In</th>
                      <th className="px-4 py-2 text-left">Check-Out</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Total Amount</th>
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelData?.bookings?.length > 0 ? (
                      hotelData.bookings.map((booking) => (
                        <tr key={booking.booking_id}>
                          <td className="px-4 py-2">{booking.booking_id}</td>
                          <td className="px-4 py-2">{booking.guest_id}</td>
                          <td className="px-4 py-2">{booking.room.room_number}</td>
                          <td className="px-4 py-2">{booking.check_in_date}</td>
                          <td className="px-4 py-2">{booking.check_out_date}</td>
                          <td className="px-4 py-2">{booking.status}</td>
                          <td className="px-4 py-2">₱{booking.total_amount}</td>
                          <td className="px-4 py-2">
                            {/* Edit Booking Button */}
                            <button
                              onClick={() => navigate(`/admin/hotels/${hotel_id}/bookings/${booking.booking_id}/edit`)}
                              className="mr-4"
                            >
                              <img
                                src="/src/assets/edit.png"
                                alt="Edit"
                                className="w-6 h-6 hover:opacity-80"
                              />
                            </button>

                            {/* Delete Booking Button */}
                            <button
                              onClick={() => handleDeleteBooking(booking.booking_id)}
                            >
                              <img
                                src="/src/assets/delete.png"
                                alt="Delete"
                                className="w-6 h-6 hover:opacity-80"
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                          No bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="mt-4">
                <h2 className="text-xl font-bold">Payments</h2>
                <table className="w-full bg-white shadow-md rounded-lg mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Payment ID</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Method</th>
                      <th className="px-4 py-2 text-left">Booking ID</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotelData?.payments?.length > 0 ? (
                      hotelData.payments.map((payment) => (
                        <tr key={payment.payment_id}>
                          <td className="px-4 py-2">{payment.payment_id}</td>
                          <td className="px-4 py-2">₱{payment.amount}</td>
                          <td className="px-4 py-2">
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(payment.payment_date))}
                          </td>
                          <td className="px-4 py-2">{payment.payment_status}</td>
                          <td className="px-4 py-2">{payment.payment_method}</td>
                          <td className="px-4 py-2">{payment.booking_id}</td>
                          <td className="px-4 py-2">
                            {/* Edit Payment Button */}
                            <button
                              onClick={() => navigate(`/admin/hotels/${hotel_id}/payments/${payment.payment_id}/edit`)}
                              className="mr-4"
                            >
                              <img
                                src="/src/assets/edit.png"
                                alt="Edit"
                                className="w-6 h-6 hover:opacity-80"
                              />
                            </button>

                            {/* Delete Payment Button */}
                            <button
                              onClick={() => handleDeletePayment(payment.payment_id)}
                            >
                              <img
                                src="/src/assets/delete.png"
                                alt="Delete"
                                className="w-6 h-6 hover:opacity-80"
                              />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                          No payments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

      
          {showDeleteRoomTypeConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-medium mb-4">
                  Are you sure you want to delete this room type?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteRoomTypeConfirmation(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteRoomType}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteBookingConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-medium mb-4">
                  Are you sure you want to delete this booking?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteBookingConfirmation(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteBooking}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeletePaymentConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-lg font-medium mb-4">
                  Are you sure you want to delete this payment?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeletePaymentConfirmation(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeletePayment}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelDetails;