import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config"; // config.js ফাইল থেকে API_URL ইম্পোর্ট করুন

const TrackingResult = () => {
  const [trackingData, setTrackingData] = useState([]);
  const [searchAWB, setSearchAWB] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    setErrorMessage("");
    setTrackingData([]);
    if (!searchAWB.trim()) {
      setErrorMessage("Please enter an Airway Bill Number.");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/customers/search/${searchAWB}`);
      if (response.data.length > 0) {
        setTrackingData(response.data);
      } else {
        setErrorMessage("No data found for the entered Airway Bill Number.");
      }
    } catch (error) {
      setTrackingData([]);
      setErrorMessage("Error fetching tracking data. Please try again.");
      console.error("Error fetching tracking data:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tracking Result</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Airway Bill Number"
          value={searchAWB}
          onChange={(e) => setSearchAWB(e.target.value)}
          style={{ padding: "10px", marginRight: "10px", width: "250px" }}
        />
        <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
          Track
        </button>
      </div>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {trackingData.length > 0 && (
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Airway Bill Number</th>
              <th>Delivery Date</th>
              <th>Delivery Time</th>
              <th>Status Code</th>
              <th>Signature</th>
            </tr>
          </thead>
          <tbody>
            {trackingData.map((item, index) => (
              <tr key={index}>
                <td>{item.airwayBillNumber}</td>
                <td>{item.deliveryDate}</td>
                <td>{item.deliveryTime}</td>
                <td>{item.statusCode}</td>
                <td>{item.signature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrackingResult;