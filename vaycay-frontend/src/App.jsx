import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ApolloClient, ApolloProvider, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

import AuthLayout from "./layout/authlayout";
import BaseLayout from "./layout/baselayout";
import AdminLayout from "./layout/adminlayout";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RecommendedHotels from "./pages/RecommendedHotels";
import HotelRooms from "./pages/HotelRooms";
import RoomBooking from "./pages/RoomBooking";
import GuestProfile from "./pages/GuestProfile";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PaymentScreen from "./pages/PaymentScreen";
import ConfirmationPage from "./pages/ConfirmationPage";
import EditProfile from "./pages/EditProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/users";
import UserDetails from "./pages/admin/userdetails";
import HotelDetails from "./pages/admin/hoteldetails"; 
import EditHotel from "./pages/admin/editHotel";
import AddHotel from "./pages/admin/addhotel";
import AddRoomType from "./pages/admin/addRoomType";
import AddRooms from "./pages/admin/addrooms";
import EditRooms from "./pages/admin/editrooms";
import Settings from "./pages/admin/Settings";
import RoomByType from "./pages/admin/roomByType"; 
import EditRoomType from "./pages/admin/editRoomType";

// Apollo HTTP link for queries/mutations
const httpLink = new HttpLink({
  uri: "http://localhost:8080/v1/graphql",
  headers: {
    "x-hasura-admin-secret": "supersecureadminsecret",
  },
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(createClient({
  url: "ws://localhost:8080/v1/graphql",
  connectionParams: {
    headers: {
      "x-hasura-admin-secret": "supersecureadminsecret",
    },
  },
}));

// Split link depending on operation type
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === "OperationDefinition" && def.operation === "subscription";
  },
  wsLink,
  httpLink
);

// Apollo Client setup
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Protected routes */}
            <Route element={<AuthLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/hotels" element={<RecommendedHotels />} />
              <Route path="/hotels/:hotelId/rooms" element={<HotelRooms />} />
              <Route path="/rooms/:roomId/book" element={<RoomBooking />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/guest_profile" element={<GuestProfile />} />
              <Route path="/edit_profile" element={<EditProfile />} />
            </Route>

            {/* Admin routes */}
            <Route
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/users/:guest_id" element={<UserDetails />} />
              <Route path="/admin/hotels/:hotel_id" element={<HotelDetails />} />
              <Route path="/admin/hotels/:hotel_id/edit" element={<EditHotel />} />
              <Route path="/admin/hotels/addhotel" element={<AddHotel />} />
              <Route path="/admin/hotels/:hotel_id/addroom" element={<AddRooms />} />
              <Route path="/admin/hotels/:hotel_id/addroomtype" element={<AddRoomType />} />
              <Route path="/admin/hotels/:hotel_id/rooms/:room_id/edit" element={<EditRooms />} />
              <Route path="/admin/hotels/:hotel_id/roomtypes/:type_id/rooms" element={<RoomByType />} />
              <Route path="/admin/hotels/:hotel_id/roomtypes/:type_id/edit" element={<EditRoomType />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>

            {/* Public routes */}
            <Route element={<BaseLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/guest_profile" element={<GuestProfile />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
