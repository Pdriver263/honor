import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BillSubmitForm.css";
import API_URL from "../config";


const BillSubmitForm = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(localStorage.getItem("bill_date") || "");
  const [name, setName] = useState(localStorage.getItem("bill_name") || "");
  const [billNumbers, setBillNumbers] = useState([""]);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save name & date in localStorage
  useEffect(() => {
    localStorage.setItem("bill_name", name);
    localStorage.setItem("bill_date", date);
  }, [name, date]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  const handleBillNumberChange = (index, value) => {
    const updated = [...billNumbers];
    updated[index] = value;
    setBillNumbers(updated);
  };

  const addBillNumberField = () => {
    setBillNumbers([...billNumbers, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/bills`, {
        date,
        name,
        billNumbers: billNumbers.filter(bn => bn.trim() !== ""),
        amount,
      });

      if (response.status === 201) {
        alert("✅ Bill submitted successfully!");
        setBillNumbers([""]);
        setAmount("");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert(`❌ Failed to submit bill: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("bill_name");
    localStorage.removeItem("bill_date");
    navigate("/login");
  };

  return (
    <div className="bill-form-container">
      <h2 className="form-title">🧾 Bill Submission Form</h2>
      <form className="bill-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Date:</label>
          <input
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bill Numbers:</label>
          {billNumbers.map((bn, index) => (
            <input
              key={index}
              type="text"
              className="form-input bill-number-input"
              value={bn}
              onChange={(e) => handleBillNumberChange(index, e.target.value)}
              placeholder={`Bill Number ${index + 1}`}
              required={index === 0}
            />
          ))}
          <button
            type="button"
            className="add-button"
            onClick={addBillNumberField}
          >
            + Add Another Bill
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Amount:</label>
          <input
            type="number"
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="button-group">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillSubmitForm;