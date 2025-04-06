import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import RecommendedHotels from "./pages/RecommendedHotels";
import PrivateRoute from "./components/PrivateRoute";
import BaseLayout from "./layout/baselayout";
import AuthLayout from "./layout/authlayout";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protected routes with auth navigation */}
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} /> {/* Same component */}
            <Route path="/hotels" element={<RecommendedHotels />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Auth pages with guest navigation */}
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotels" element={<RecommendedHotels />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
