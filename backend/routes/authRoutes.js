const express = require("express");
const Customer = require("../models/customerModel"); // Customer মডেল ইমপোর্ট করুন

const router = express.Router();

// GET Route for Testing (e.g., Health Check)
router.get("/login", (req, res) => {
    res.status(200).send("Login endpoint is active.");
});

// Login Route
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Example hardcoded credentials for simplicity
    const adminUsername = "admin";
    const adminPassword = "123456";

    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
        res.status(200).json({
            token: "fake-jwt-token", // Replace with a real JWT token in production
            message: "Login successful!",
        });
    } else {
        res.status(401).json({ error: "Invalid username or password!" });
    }
});

// Fetch all customers
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find(); // ডেটাবেস থেকে সব কাস্টমার ডেটা আনুন
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Failed to fetch customers." });
    }
});

// Delete a customer by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCustomer = await Customer.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        res.status(200).json({ message: "Customer deleted successfully." });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Failed to delete customer." });
    }
});

module.exports = router;