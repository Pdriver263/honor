import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import "./CustomerForm.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_URL from "../config"; // ✅ সঠিক ইম্পোর্ট

const TrackingForm = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  const [formData, setFormData] = useState({
    airwayBillNumber: "",
    deliveryDate: "",
    deliveryTime: "",
    statusCode: "",
    signature: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth) {
      navigate("/login"); // লগিন না থাকলে রিডাইরেক্ট
      return;
    }

    // Validate required fields
    if (
      !formData.airwayBillNumber ||
      !formData.deliveryDate ||
      !formData.deliveryTime ||
      !formData.statusCode ||
      !formData.signature
    ) {
      toast.configure();
      setErrorMessage("All fields are required.");
      toast.error("All fields are required."); // Toastify এর মাধ্যমে এরর মেসেজ দেখান
      return;
    }

    try {
      // ✅ API_URL ব্যবহার করে এন্ডপয়েন্ট কল করুন
      await axios.post(`${API_URL}/api/customers`, formData);
      setSuccessMessage("Tracking information submitted successfully!");
      toast.success("Tracking information submitted successfully!"); // Toastify এর মাধ্যমে সাফল্য মেসেজ দেখান

      // Clear only Air Way Bill Number
      setFormData((prevData) => ({
        ...prevData,
        airwayBillNumber: "",
      }));

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000); // Clear success message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to submit tracking information."
      );
      toast.error("Failed to submit tracking information."); // Toastify এর মাধ্যমে এরর মেসেজ দেখান
    }
  };

  // Handle form reset (clear all fields)
  const handleReset = () => {
    setFormData({
      airwayBillNumber: "",
      deliveryDate: "",
      deliveryTime: "",
      statusCode: "",
      signature: "",
    });
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Handle logout
  const handleLogout = () => {
    setAuth(false); // লগআউট স্টেট আপডেট করুন
    navigate("/login"); // লগিন পেজে রিডাইরেক্ট করুন
  };

  return (
    <div className="form-container">
      <h2 className="form-header">SCS Express International</h2>

      {successMessage && <p className="form-success">{successMessage}</p>}
      {errorMessage && <p className="form-error">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="tracking-form">
        <label className="form-label">Air Way Bill Number:</label>
        <input
          type="number"
          name="airwayBillNumber"
          value={formData.airwayBillNumber}
          onChange={handleChange}
          className="form-input"
          required
        />

        <label className="form-label">Delivery Date:</label>
        <input
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleChange}
          className="form-input"
          required
        />

        <label className="form-label">Delivery Time:</label>
        <input
          type="time"
          name="deliveryTime"
          value={formData.deliveryTime}
          onChange={handleChange}
          className="form-input"
          required
        />

        <label className="form-label">Status Code:</label>
        <select
          name="statusCode"
          value={formData.statusCode}
          onChange={handleChange}
          className="form-select"
          required
        >
          <option value="">Select</option>
          <option value="Check In">Check In</option>
          <option value="Check Out">Check Out</option>
          <option value="Signature">Signature</option>
        </select>

        <label className="form-label">Signature:</label>
        <input
          type="text"
          name="signature"
          value={formData.signature}
          onChange={handleChange}
          className="form-input"
          required
        />

        <button type="submit" className="form-button">
          Submit
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="form-button reset-button"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="form-button logout-button"
        >
          Logout
        </button>
      </form>
    </div>
  );
};

export default TrackingForm;