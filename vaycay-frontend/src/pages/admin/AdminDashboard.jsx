import { gql, useSubscription } from "@apollo/client";
import { Link } from "react-router-dom";
import editIcon from "../../assets/Edit.png";
import deleteIcon from "../../assets/delete.png";
import searchIcon from "../../assets/search.png";

// Separate subscriptions
const BOOKINGS_SUBSCRIPTION = gql`
  subscription BookingsCount {
    bookings_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const USERS_SUBSCRIPTION = gql`
  subscription UsersCount {
    users_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const HOTELS_SUBSCRIPTION = gql`
  subscription HotelsList {
    hotels {
      hotel_id
      hotel_name
      description
      location {
        location_name
      }
    }
  }
`;

const AdminDashboard = () => {
  const { data: bookingsData, loading: bookingsLoading } = useSubscription(BOOKINGS_SUBSCRIPTION);
  const { data: usersData, loading: usersLoading } = useSubscription(USERS_SUBSCRIPTION);
  const { data: hotelsData, loading: hotelsLoading, error: hotelsError } = useSubscription(HOTELS_SUBSCRIPTION);

  const hotels = hotelsData?.hotels || [];
  const totalBookings = bookingsData?.bookings_aggregate?.aggregate?.count || 0;
  const activeUsers = usersData?.users_aggregate?.aggregate?.count || 0;

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <h1 className="text-2xl font-bold">Dashboard!</h1>
      <p>Welcome Admin!</p>

      <div className="w-full h-0.5 bg-black bg-opacity-20 my-4"></div>

      <div className="flex justify-center space-x-8 mt-8">
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">Total Bookings</h2>
          <p className="text-3xl font-semibold text-teal-600">
            {bookingsLoading ? "Loading..." : totalBookings}
          </p>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">Active Users</h2>
          <p className="text-3xl font-semibold text-teal-600">
            {usersLoading ? "Loading..." : activeUsers}
          </p>
        </div>
      </div>

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

        {hotelsLoading ? (
          <p>Loading hotels...</p>
        ) : hotelsError ? (
          <p className="text-red-500">Error fetching hotels: {hotelsError.message}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, index) => {
              const imageIndex = (index % 3) + 1;
              const imagePath = `/src/assets/admin_pics/hotel${imageIndex}.jpg`;

              return (
                <div
                  key={hotel.hotel_id}
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/admin/hotels/${hotel.hotel_id}`)
                  }
                >
                  <img
                    src={imagePath}
                    alt={hotel.hotel_name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-teal-600">
                      {hotel.hotel_name}
                    </h3>
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
