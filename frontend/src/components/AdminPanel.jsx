import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";
import API_URL from "../config"; // ✅ সঠিক ইম্পোর্ট


const AdminPanel = () => {
  // State variables
  const [trackingList, setTrackingList] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    airwayBillNumber: "",
    deliveryDate: "",
    deliveryTime: "",
    statusCode: "",
    signature: "",
  });

  // Fetch tracking data from API
  const fetchTrackingData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customers`); // ✅ API_URL ব্যবহার করুন
      setTrackingList(response.data.reverse());
    } catch (error) {
      console.error("Error fetching tracking data:", error);
      setError("Failed to load tracking data.");
    }
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

  // Delete customer
  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/api/customers/${id}`); // ✅ API_URL ব্যবহার করুন
        alert("Customer deleted successfully!");
        fetchTrackingData();
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("Failed to delete customer.");
      }
    }
  };

  // Open edit modal
  const openEditModal = (customer) => {
    setEditData(customer);
    setEditModalVisible(true);
  };

  // Handle input changes in edit modal
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save changes made in edit modal
  const saveChanges = async () => {
    try {
      await axios.put(`${API_URL}/api/customers/${editData._id}`, editData); // ✅ API_URL ব্যবহার করুন
      alert("Customer updated successfully!");
      setEditModalVisible(false);
      fetchTrackingData();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer.");
    }
  };

  // Search filter logic
  const filteredData = trackingList.filter((item) =>
    item.airwayBillNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="admin-panel-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <h3>Admin Panel</h3>
          <li><a href="/dashboard" target="_blank" title="Dashboard">Dashboard</a></li>
          <li><a href="/customer-form" target="_blank" title="Add Customer">Add Customer</a></li>
          <li><a href="/tracking-result" target="_blank" title="Tracking">Tracking</a></li>
          <li><a href="/admin-panel" target="_blank" title="Tracking List">Tracking List</a></li>
          <li><a href="/pod-form" target="_blank" title="Add POD">Add POD</a></li>
          <li><a href="/pod-list" target="_blank" title="POD List">POD List</a></li>
          <li><a href="/bill-submit-form" target="_blank">Bill Submit</a></li>
<li><a href="/bill-submission-list" target="_blank">Bill Submission List</a></li>
<li><a href="/igm-processor" target="_blank" title="igm Processor">IGM Processor</a></li>
<li><a href="/Daily-Bill" target="_blank" title="Daily Bill">Daily Bill</a></li>
<li><a href="/Monthly-Bill" target="_blank" title="Monthly-Bill">Monthly-Bill</a></li>

          <li><a href="/sample-list" target="_blank" title="Sample List">Sample List</a></li>
            </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>Tracking List</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Airway Bill Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />

        {error && <p className="error-message">{error}</p>}
        {filteredData.length === 0 ? (
          <p>No tracking data available.</p>
        ) : (
          <table className="tracking-table">
            <thead>
              <tr>
                <th>NO.</th>
                <th>Airway Bill Number</th>
                <th>Delivery Date</th>
                <th>Delivery Time</th>
                <th>Status Code</th>
                <th>Signature</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.airwayBillNumber}</td>
                  <td>{item.deliveryDate}</td>
                  <td>{item.deliveryTime}</td>
                  <td>{item.statusCode}</td>
                  <td>{item.signature}</td>
                  <td>
                    <button
                      onClick={() => deleteCustomer(item._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button onClick={previousPage} disabled={currentPage === 1}>
            Back Page
          </button>
          <span>
            Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
          >
            Next Page
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Customer</h2>
            <form>
              <label>
                Airway Bill Number:
                <input
                  type="text"
                  name="airwayBillNumber"
                  value={editData.airwayBillNumber}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Delivery Date:
                <input
                  type="date"
                  name="deliveryDate"
                  value={editData.deliveryDate}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Delivery Time:
                <input
                  type="time"
                  name="deliveryTime"
                  value={editData.deliveryTime}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Status Code:
                <input
                  type="text"
                  name="statusCode"
                  value={editData.statusCode}
                  onChange={handleFormChange}
                />
              </label>
              <label>
                Signature:
                <input
                  type="text"
                  name="signature"
                  value={editData.signature}
                  onChange={handleFormChange}
                />
              </label>
            </form>
            <div className="modal-buttons">
              <button onClick={saveChanges} className="save-button">Save</button>
              <button onClick={() => setEditModalVisible(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;