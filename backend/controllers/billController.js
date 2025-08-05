const Bill = require("../models/BillModel"); // ✅ মডেল ইমপোর্ট করা হয়েছে

// Create a bill
exports.createBill = async (req, res) => {
  try {
    const newBill = new Bill(req.body);
    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(500).json({ error: "Failed to create bill", details: error.message });
  }
};

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find();
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve bills", details: error.message });
  }
};

// Update a bill
exports.updateBill = async (req, res) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBill) return res.status(404).json({ error: "Bill not found" });
    res.status(200).json(updatedBill);
  } catch (error) {
    res.status(500).json({ error: "Failed to update bill", details: error.message });
  }
};

// Delete a bill
exports.deleteBill = async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);
    if (!deletedBill) return res.status(404).json({ error: "Bill not found" });
    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bill", details: error.message });
  }
};
