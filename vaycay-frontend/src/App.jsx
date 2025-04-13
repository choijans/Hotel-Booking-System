import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import AuthLayout from "./layout/authlayout";
import BaseLayout from "./layout/baselayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RecommendedHotels from "./pages/RecommendedHotels";
import HotelRooms from "./pages/HotelRooms";
import RoomBooking from "./pages/RoomBooking"; // Import the RoomBooking component

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protected routes */}
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hotels" element={<RecommendedHotels />} />
            <Route path="/hotels/:hotelId/rooms" element={<HotelRooms />} />
            <Route path="/rooms/:roomId/book" element={<RoomBooking />} /> {/* Add this route */}
          </Route>

          {/* Public routes */}
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;