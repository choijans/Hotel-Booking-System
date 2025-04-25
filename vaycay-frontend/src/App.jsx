import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import AuthLayout from "./layout/authlayout";
import BaseLayout from "./layout/baselayout";
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
import AdminLayout from "./layout/adminlayout";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/users"; 
import UserDetails from "./pages/admin/userdetails"; 
import Hotels from "./pages/admin/hotel_rooms";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protected routes */}
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hotels" element={<RecommendedHotels />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/contactUs" element={<Contact />} />
            <Route path="/hotels/:hotelId/rooms" element={<HotelRooms />} />
            <Route path="/rooms/:roomId/book" element={<RoomBooking />} /> {/* Add this route */}
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
            <Route path="/admin/hotels" element={<Hotels />} />
            {/* <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/admin/manage-bookings" element={<ManageBookings />} /> */}
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;