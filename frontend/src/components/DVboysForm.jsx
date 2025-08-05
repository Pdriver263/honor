import React, { useState } from "react";
import axios from "axios";
import API_URL from "./config"; // config.js থেকে API_URL ইম্পোর্ট করুন

const DVboysForm = () => {
    const [formData, setFormData] = useState({
        airwayBillNumber: "",
        signature: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/dvboys`, formData); // API_URL ব্যবহার করে এন্ডপয়েন্ট সম্পূর্ণ করুন
            setSuccessMessage("Data submitted successfully!");
            setFormData({
                airwayBillNumber: "",
                signature: "",
            });
        } catch (error) {
            console.error("Error submitting data:", error);
            setErrorMessage("Failed to submit data.");
        }
    };

    return (
        <div>
            <h2>SCS Express International</h2>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>Air Way Bill Number:</label>
                <input type="text" name="airwayBillNumber" value={formData.airwayBillNumber} onChange={handleChange} required />
                <label>Signature:</label>
                <input type="text" name="signature" value={formData.signature} onChange={handleChange} required />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default DVboysForm;