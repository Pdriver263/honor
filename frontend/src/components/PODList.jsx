import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import "./PODList.css"; //  CSS ফাইল ব্যবহার করা হচ্ছে
import API_URL from "../config"; // config.js ফাইল থেকে API_URL ইম্পোর্ট করুন

const PODList = () => {
  const [podData, setPodData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    airwayBillNumber: "",
    deliveryDate: "",
    deliveryTime: "",
    statusCode: "",
    signature: "",
  });

  // Fetch POD data
  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dvboys`);
      // ডাটাকে রিভার্স করে সেট করুন যাতে নতুন ডাটা উপরে আসে
      setPodData(response.data.reverse());
    } catch (error) {
      console.error("Error fetching POD data:", error);
    }
  };
  fetchData();
}, []);

  // Delete POD
  const deletePOD = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/api/dvboys/${id}`); // API_URL ব্যবহার করুন
        alert("POD deleted successfully!");
        setPodData((prevData) => prevData.filter((pod) => pod._id !== id));
      } catch (error) {
        console.error("Error deleting POD:", error);
        alert("Failed to delete POD.");
      }
    }
  };

  // Open edit modal
  const openEditModal = (pod) => {
    setEditData(pod);
    setEditModalVisible(true);
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save changes
  const saveChanges = async () => {
    try {
      await axios.put(`${API_URL}/api/dvboys/${editData._id}`, editData); // API_URL ব্যবহার করুন
      alert("POD updated successfully!");
      setPodData((prevData) =>
        prevData.map((pod) => (pod._id === editData._id ? editData : pod))
      );
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating POD:", error);
      alert("Failed to update POD.");
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="main-content">
        <h2 className="admin-panel-title">POD List</h2>
        {podData.length === 0 ? (
          <p>No POD data available.</p>
        ) : (
          <div className="responsive-table-container">
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Airway Bill Number</th>
                  <th>Delivery Date</th>
                  <th>Delivery Time</th>
                  <th>Status Code</th>
                  <th>Signature</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {podData.map((pod, index) => (
                  <tr key={pod._id}>
                    <td>{index + 1}</td>
                    <td>{pod.airwayBillNumber}</td>
                    <td>{pod.deliveryDate}</td>
                    <td>{pod.deliveryTime}</td>
                    <td>{pod.statusCode}</td>
                    <td>{pod.signature}</td>
                    <td>
                      <button
                        onClick={() => openEditModal(pod)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePOD(pod._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit POD</h2>
            <form>
              <label>
                Airway Bill Number:
                <input
                  type="text"
                  name="airwayBillNumber"
                  value={editData.airwayBillNumber}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Delivery Date:
                <input
                  type="date"
                  name="deliveryDate"
                  value={editData.deliveryDate}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Delivery Time:
                <input
                  type="time"
                  name="deliveryTime"
                  value={editData.deliveryTime}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Status Code:
                <input
                  type="text"
                  name="statusCode"
                  value={editData.statusCode}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Signature:
                <input
                  type="text"
                  name="signature"
                  value={editData.signature}
                  onChange={handleEditChange}
                />
              </label>
            </form>
            <div className="modal-buttons">
              <button onClick={saveChanges} className="save-button">
                Save
              </button>
              <button
                onClick={() => setEditModalVisible(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PODList;