import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GuestProfile.module.css"; // Updated import for CSS Modules

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

      const payload = {
        address1: formData.address,
        birthdate1: formData.birthdate,
        contact_info1: formData.contact_info,
        full_name: formData.full_name,
        guest_id: parseInt(userId),
      };

      const response = await fetch("http://localhost:8080/api/rest/insertguest", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/dashboard", { state: { profileCompleted: true } });
      } else {
        throw new Error("Failed to save profile.");
      }
    } catch (error) {
      setServerError("Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles["guest-profile-container"]}>
      <div className={styles["guest-profile-card"]}>
        <h2>Complete Your Profile</h2>
        <p className={styles["guest-subtitle"]}>Please provide your personal details to continue</p>

        {serverError && <div className={styles["guest-server-error"]}>{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className={`${styles["guest-form-group"]} ${errors.full_name ? styles["guest-error"] : ""}`}>
            <label htmlFor="full_name">Full Name *</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            {errors.full_name && <span className={styles["guest-error-message"]}>{errors.full_name}</span>}
          </div>

          <div className={styles["guest-form-group"]}>
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

          <div className={`${styles["guest-form-group"]} ${errors.contact_info ? styles["guest-error"] : ""}`}>
            <label htmlFor="contact_info">Contact Info *</label>
            <input
              type="text"
              id="contact_info"
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              placeholder="@"
            />
            {errors.contact_info && (
              <span className={styles["guest-error-message"]}>{errors.contact_info}</span>
            )}
          </div>

          <div className={`${styles["guest-form-group"]} ${errors.address ? styles["guest-error"] : ""}`}>
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="123 Main St, Cebu City, Philippines"
            />
            {errors.address && <span className={styles["guest-error-message"]}>{errors.address}</span>}
          </div>

          <button type="submit" className={styles["guest-submit-btn"]} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className={styles["guest-spinner"]}></span> Saving...
              </>
            ) : (
              "Complete Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestProfile;