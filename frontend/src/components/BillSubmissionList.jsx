import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactPaginate from "react-paginate";
import "./BillSubmissionList.css";

const BillSubmissionList = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [editingBill, setEditingBill] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", name: "", billNumbers: [""], amount: "" });

  const billsPerPage = 50;

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/bills`);
        const reversedData = res.data.reverse();
        setBills(reversedData);
        setFilteredBills(reversedData);
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError("Failed to load bill submissions.");
      }
    };

    fetchBills();
  }, []);

  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filtered = bills.filter(bill =>
      bill.name.toLowerCase().includes(searchLower) ||
      bill.billNumbers.some(num => num.toLowerCase().includes(searchLower)) ||
      bill.date.includes(search)
    );
    setFilteredBills(filtered);
    setCurrentPage(0);
  }, [search, bills]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this bill?")) return;
    try {
      await axios.delete(`${API_URL}/api/bills/${id}`);
      const updated = bills.filter(b => b._id !== id);
      setBills(updated);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Bill Submission List", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["SL", "Date", "Name", "Bill Number(s)", "Amount"]],
      body: filteredBills.map((bill, index) => [
        index + 1,
        new Date(bill.date).toLocaleDateString(),
        bill.name,
        bill.billNumbers.join(", "),
        bill.amount
      ])
    });
    doc.save("bill-submissions.pdf");
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/bills/${editingBill._id}`, editForm);
      const updated = bills.map(b =>
        b._id === editingBill._id ? res.data : b
      );
      setBills(updated);
      setEditingBill(null);
    } catch (err) {
      alert("Failed to update bill.");
      console.error(err);
    }
  };

  const pageCount = Math.ceil(filteredBills.length / billsPerPage);
  const displayBills = filteredBills.slice(
    currentPage * billsPerPage,
    (currentPage + 1) * billsPerPage
  );

  const totalAmount = filteredBills.reduce((acc, bill) => acc + Number(bill.amount), 0);

  return (
    <div className="bill-submission-list">
      <h2 className="list-title">Bill Submission List</h2>
      <input
        type="text"
        placeholder="Search by name, date or bill number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      <button className="download-btn" onClick={handleDownloadPDF}>📄 Download PDF</button>
      {error && <p className="error-message">{error}</p>}
      {displayBills.length === 0 ? (
        <p className="no-bills">No bills found.</p>
      ) : (
        <div className="table-container">
          <table className="bill-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Date</th>
                <th>Name</th>
                <th>Bill Number(s)</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayBills.map((bill, index) => (
                <tr key={bill._id}>
                  <td>{index + 1 + currentPage * billsPerPage}</td>
                  <td>{new Date(bill.date).toLocaleDateString()}</td>
                  <td>{bill.name}</td>
                  <td>
                    <ul>
                      {bill.billNumbers.map((num, idx) => (
                        <li key={idx}>{num}</li>
                      ))}
                    </ul>
                  </td>
                  <td>৳{Number(bill.amount).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingBill(bill);
                        setEditForm({
                          date: bill.date,
                          name: bill.name,
                          billNumbers: bill.billNumbers,
                          amount: bill.amount,
                        });
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(bill._id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>Total</td>
                <td style={{ fontWeight: "bold" }}>৳{totalAmount.toLocaleString()}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        pageCount={pageCount}
        onPageChange={({ selected }) => setCurrentPage(selected)}
        containerClassName={"pagination"}
        activeClassName={"active-page"}
        disabledClassName={"disabled-page"}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
      />

      {/* Modal for Editing */}
      {editingBill && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Bill</h3>

            <label>Date:</label>
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            />

            <label>Name:</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />

            <label>Bill Numbers (one per line):</label>
            <textarea
              rows="3"
              value={editForm.billNumbers.join("\n")}
              onChange={(e) =>
                setEditForm({ ...editForm, billNumbers: e.target.value.split("\n") })
              }
            />

            <label>Amount:</label>
            <input
              type="number"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={handleUpdate}>💾 Save</button>
              <button onClick={() => setEditingBill(null)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillSubmissionList;
