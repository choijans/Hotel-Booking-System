import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../api"; // Use the same API instance as RecommendedHotels and HotelRooms
import "./GuestProfile.css";
import bgbg from "../assets/bgbg.jpg"; // Import the background image

const GuestProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    birthdate: "",
    contact_info: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!formData.contact_info.trim()) newErrors.contact_info = "Contact info is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setIsSubmitting(true);
    setServerError("");
  
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log("userId from localStorage:", userId);
  
      // Map the payload to match the mutation variables
      const payload = {
        address1: formData.address, // Map to $address1
        birthdate1: formData.birthdate, // Map to $birthdate1
        contact_info1: { phone: formData.contact_info }, // Map to $contact_info1
        full_name: formData.full_name, // Map to $full_name
        guest_id: parseInt(userId), // Map to $guest_id
      };
  
      console.log("Payload:", payload);
  
      const response = await hotelApi.post("/insertguest", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Response:", response.data);
  
      if (response.status === 200) {
        navigate("/dashboard", { state: { profileCompleted: true } });
      }
    } catch (error) {
      console.error("Profile submission failed:", error.response?.data || error.message);
      setServerError(
        error.response?.data?.message || "Failed to save profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }; 

  return (
    <div
      className="min-h-screen bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgbg})`,
        backgroundSize: "100%",
      }}
    >
      <div className="guest-profile-container">
        
        <div className="guest-profile-card">
          <h2>Complete Your Profile</h2>
          <p className="subtitle">Please provide your personal details to continue</p>

          {serverError && <div className="server-error">{serverError}</div>}

          <form onSubmit={handleSubmit}>
            <div className={`form-group ${errors.full_name ? "error" : ""}`}>
              <label htmlFor="full_name">Full Name *</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
              />
              {errors.full_name && <span className="error-message">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="birthdate">Birthdate</label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className={`form-group ${errors.contact_info ? "error" : ""}`}>
              <label htmlFor="contact_info">Contact Info *</label>
              <input
                type="text"
                id="contact_info"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleChange}
                placeholder="XXXX-XXX-XXXX"
              />
              {errors.contact_info && <span className="error-message">{errors.contact_info}</span>}
            </div>

            <div className={`form-group ${errors.address ? "error" : ""}`}>
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="123 Main St, Cebu City, Philippines"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestProfile;