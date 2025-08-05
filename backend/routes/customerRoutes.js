const express = require("express");
const router = express.Router();
const Customer = require("../models/customerModel");
const { searchCustomers } = require("../controllers/customerController");



// Search customers by Airway Bill Number
router.get("/search/:airwayBillNumber", searchCustomers);

module.exports = router;
/**
 * DELETE: Delete customer data by ID (Admin Panel)
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCustomer = await Customer.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Failed to delete customer" });
    }
});

/**
 * PUT: Update customer data by ID (Admin Panel)
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedCustomer = await Customer.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Failed to update customer" });
    }
});

/**
 * GET: Retrieve all customers (Admin Panel)
 */
router.get("/:airwayBillNumber", async (req, res) => {
    const { airwayBillNumber } = req.params;

    try {
        const customer = await Customer.findOne({ airwayBillNumber });

        if (!customer) {
            return res.status(404).json({ message: "Data not found." });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error fetching tracking data:", error);
        res.status(500).json({ message: "Server error while fetching data." });
    }
});
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching all customers:", error);
        res.status(500).json({ message: "Server error while fetching customers." });
    }
});

/**
 * POST: Add a new customer (Tracking Form)
 */
router.post("/", async (req, res) => {
    const { airwayBillNumber, deliveryDate, deliveryTime, statusCode, signature } = req.body;

    if (!airwayBillNumber || !deliveryDate || !deliveryTime || !statusCode || !signature) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const newCustomer = new Customer({
            airwayBillNumber,
            deliveryDate,
            deliveryTime,
            statusCode,
            signature,
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        console.error("Error saving customer:", error);
        res.status(500).json({ message: "Failed to save customer." });
    }
});

module.exports = router;