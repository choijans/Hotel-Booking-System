import { useState } from "react";
import { useAuth } from "../../context/AuthProvider"; // Assuming correct path to AuthProvider
import { authApi } from "../../api"; // Import authApi for API calls
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming logout function is available in AuthProvider
  const [selectedSection, setSelectedSection] = useState("Change Password"); // Track selected section
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await authApi.post(
        "/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message || "Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout(); // Call logout from AuthProvider
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-2/5 lg:w-2/5">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
                <nav className="space-y-4">
                  <button
                    onClick={() => setSelectedSection("Change Password")}
                    className={`block py-2 px-4 ${
                      selectedSection === "Change Password"
                        ? "bg-teal-100 text-teal-800"
                        : "text-gray-700 hover:bg-gray-100"
                    } rounded-md font-medium`}
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => setSelectedSection("Logout")}
                    className={`block py-2 px-4 ${
                      selectedSection === "Logout"
                        ? "bg-teal-100 text-teal-800"
                        : "text-gray-700 hover:bg-gray-100"
                    } rounded-md font-medium`}
                  >
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/5 lg:w-3/5">
            {selectedSection === "Change Password" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h1>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                        Old Password
                      </label>
                      <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
                    >
                      {loading ? "Changing Password..." : "Change Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {selectedSection === "Logout" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">Logout</h1>
                  <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;