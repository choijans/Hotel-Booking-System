import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const AdminNav = () => {
  const { currentUser } = useAuth();

  // Don't render if not admin
  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <div className="vertical-navbar bg-white text-black w-64 min-h-screen p-4">
      <div className="mb-8">
        <ul className="space-y-3">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `block p-2 rounded ${
                  isActive
                    ? "bg-C1E3E2 text-teal-600" // Active styles
                    : "hover:bg-C1E3E2 hover:text-teal-600" // Hover styles
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/hotels"
              className={({ isActive }) =>
                `block p-2 rounded ${
                  isActive
                    ? "bg-C1E3E2 text-teal-600"
                    : "hover:bg-C1E3E2 hover:text-teal-600"
                }`
              }
            >
              Hotels
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                `block p-2 rounded ${
                  isActive
                    ? "bg-C1E3E2 text-teal-600"
                    : "hover:bg-C1E3E2 hover:text-teal-600"
                }`
              }
            >
              Bookings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block p-2 rounded ${
                  isActive
                    ? "bg-C1E3E2 text-teal-600"
                    : "hover:bg-C1E3E2 hover:text-teal-600"
                }`
              }
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                `block p-2 rounded ${
                  isActive
                    ? "bg-C1E3E2 text-teal-600"
                    : "hover:bg-C1E3E2 hover:text-teal-600"
                }`
              }
            >
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `block p-2 rounded ${
                  isActive
                    ? "bg-C1E3E2 text-teal-600"
                    : "hover:bg-C1E3E2 hover:text-teal-600"
                }`
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminNav;