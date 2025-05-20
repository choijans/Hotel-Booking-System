import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../api";
import { motion } from 'framer-motion';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    address: "",
    birthdate: "", // Add birthdate to the profile state
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const guest_id = localStorage.getItem("userId");

        if (!token || !guest_id) {
          navigate("/login");
          return;
        }

        const response = await hotelApi.get("/getguestprofile", {
          params: { guest_id: parseInt(guest_id) },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { guests_by_pk } = response.data;

        if (guests_by_pk) {
          // Populate the profile state with existing data
          setProfile({
            full_name: guests_by_pk.full_name || "",
            phone: guests_by_pk.contact_info?.phone || "",
            address: guests_by_pk.address || "",
            birthdate: guests_by_pk.birthdate || "", // Populate birthdate
          });
        } else {
          // If no profile exists, initialize with empty fields
          setProfile({
            full_name: "",
            phone: "",
            address: "",
            birthdate: "",
          });
        }
      } catch (err) {
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!profile.full_name || !profile.phone || !profile.address || !profile.birthdate) {
      setError("All fields are required. Please fill out every field.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const guest_id = localStorage.getItem("userId");

      if (!guest_id) {
        setError("Guest ID is missing. Please log in again.");
        return;
      }

      const payload = {
        guest_id: parseInt(guest_id),
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
        birthdate: profile.birthdate, // Include birthdate in the payload
      };

      console.log("Payload being sent:", payload);

      const response = await hotelApi.put(
        "/updateguestprofile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Profile updated successfully.");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      console.error("Error response:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={profile.full_name || ""}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                Birthdate
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={profile.birthdate || ""}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Contact Information
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={profile.phone || ""}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address || ""}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfile;