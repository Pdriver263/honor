import React from 'react';
import axios from "axios";
import { useState } from "react";
import "./PODForm.css"; 
import API_URL from "../config"; // ✅ সঠিক ইম্পোর্ট

const PODForm = () => {
  const [formData, setFormData] = useState({
    airwayBillNumber: "",
    deliveryDate: "",
    deliveryTime: "",
    statusCode: "",
    signature: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ API_URL ব্যবহার করা হয়েছে
      const response = await axios.post(`${API_URL}/api/dvboys`, formData);
      alert("POD data submitted successfully!");
      console.log(response.data);
      setFormData({
        airwayBillNumber: "",
        deliveryDate: "",
        deliveryTime: "",
        statusCode: "",
        signature: "",
      });
    } catch (error) {
      console.error("Error submitting POD data:", error);
      alert("Error submitting POD data.");
    }
  };

  return (
    <div className="pod-container">
      <h2 className="pod-header">POD Submission Form</h2>
      <form onSubmit={handleSubmit} className="pod-form">
        <label className="pod-label">Air Way Bill Number</label>
        <input
          type="number"
          name="airwayBillNumber"
          value={formData.airwayBillNumber}
          onChange={handleChange}
          className="pod-input"
          placeholder="Enter Air Way Bill Number"
          required
        />

        <label className="pod-label">Delivery Date</label>
        <input
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleChange}
          className="pod-input"
          required
        />

        <label className="pod-label">Delivery Time</label>
        <input
          type="time"
          name="deliveryTime"
          value={formData.deliveryTime}
          onChange={handleChange}
          className="pod-input"
          required
        />

        <label className="pod-label">Status Code</label>
        <select
          name="statusCode"
          value={formData.statusCode}
          onChange={handleChange}
          className="pod-select"
          required
        >
          <option value="">Select Status</option>
          <option value="PARCEL">PARCEL</option>
          <option value="PAPER">PAPER</option>
          <option value="COMPANY STAMP">COMPANY STAMP</option>
          <option value="SName">Name</option>
        </select>

        <label className="pod-label">Signature</label>
        <input
          type="text"
          name="signature"
          value={formData.signature}
          onChange={handleChange}
          className="pod-input"
          placeholder="Enter Signature"
          required
        />

        <button type="submit" className="pod-button">Submit</button>
        <button
          type="reset"
          className="pod-reset-button"
          onClick={() =>
            setFormData({
              airwayBillNumber: "",
              deliveryDate: "",
              deliveryTime: "",
              statusCode: "",
              signature: "",
            })
          }
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default PODForm;