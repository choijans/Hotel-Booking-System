import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";  // Assuming correct path to AuthProvider
import changePasswordIcon from "../../assets/change-password.png";
import logoutIcon from "../../assets/logout.png";

const AdminDashboard = () => {
  const { logout } = useAuth();  // Assuming logout function is available in AuthProvider
  const [error, setError] = useState(null);

  const handleChangePassword = () => {
    console.log("Change Password clicked");
  };

  const handleLogout = () => {
    logout();  // Call logout from AuthProvider
  };

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      {/* Transparent horizontal line */}
      <div className="w-full h-0.5 bg-black bg-opacity-20 my-4"></div>

      {/* Change Password and Logout Buttons */}
      <div className="flex justify-center space-x-8 mt-8">
        {/* Change Password Button */}
        <button 
          className="bg-teal-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={handleChangePassword}
        >
          <img src={changePasswordIcon} alt="Change Password" className="w-6 h-6 mr-2" />
          Change Password
        </button>

        {/* Logout Button */}
        <button 
          className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={handleLogout}
        >
          <img src={logoutIcon} alt="Logout" className="w-6 h-6 mr-2" />
          Logout
        </button>
      </div>

      {/* Error Handling */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AdminDashboard;

