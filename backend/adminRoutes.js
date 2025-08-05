const express = require("express");
const Customer = require("../models/customerModel"); // Customer মডেল ইমপোর্ট
const mongoose = require("mongoose");
const router = express.Router();

/**
 * Route: GET /api/admin
 * Description: Get all customers
 */
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find(); // MongoDB থেকে সব ডেটা আনুন

        if (!customers || customers.length === 0) {
            return res.status(404).json({ message: "No customers found." }); // যদি ডেটা খালি থাকে
        }

        res.status(200).json(customers); // ডেটাগুলো JSON ফর্ম্যাটে পাঠান
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: "Failed to fetch customers." }); // সার্ভার এরর
    }
});

/**
 * Route: DELETE /api/admin/:id
 * Description: Delete a customer by ID
 */
const mongoose = require("mongoose");

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid customer ID." });
    }

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id); // কাস্টমার ডিলিট করুন

        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found." }); // যদি ID মিলে না
        }

        res.status(200).json({ message: "Customer deleted successfully.", customer: deletedCustomer });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ message: "Failed to delete customer." }); // সার্ভার এরর
    }
});

// Removed duplicate route handler

/**
 * Route: PUT /api/admin/:id
 * Description: Update a customer by ID
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { StatusCode, AirwayBillNumber ,DeliveryDate,Signature } = req.body; // ফ্রন্টএন্ড থেকে পাঠানো ডেটা

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { newStatusCode, newAirwayBillNumber:newAirwayBillNumber ,newDeliveryDate,newDeliveryTime,newSignature },
            { new: true, runValidators: true } // নতুন আপডেটেড ডেটা রিটার্ন করুন
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found." }); // যদি ID মিলে না
        }

        res.status(200).json({ message: "Customer updated successfully.", customer: updatedCustomer });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Failed to update customer." }); // সার্ভার এরর
    }
});

/**
 * Route: POST /api/admin
 * Description: Add a new customer
 */
router.post("/", async (req, res) => {
    const { name, email, phone, message } = req.body; // ফ্রন্টএন্ড থেকে পাঠানো ডেটা

    if (!name || !email || !phone) {
        return res.status(400).json({ message: "Name, email, and phone are required." }); // ভ্যালিডেশন
    }

    try {
        const newCustomer = new Customer({ name, email, phone, message }); // নতুন কাস্টমার তৈরি
        const savedCustomer = await newCustomer.save(); // MongoDB তে সংরক্ষণ করুন

        res.status(201).json({ message: "Customer added successfully.", customer: savedCustomer });
    } catch (error) {
        console.error("Error adding customer:", error);
        res.status(500).json({ message: "Failed to add customer." }); // সার্ভার এরর
    }
});

module.exports = router;