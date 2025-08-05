const Customer = require("../models/customerModel");

/**
 * Search for customers by Airway Bill Number
 * @route GET /api/customers/search/:airwayBillNumber
 */
exports.searchCustomers = async (req, res) => {
    const { airwayBillNumber } = req.params;

    try {
        const customers = await Customer.find({ airwayBillNumber });

        if (!customers || customers.length === 0) {
            return res.status(404).json({ message: "No data found for the provided Airway Bill Number." });
        }

        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching tracking data:", error);
        res.status(500).json({ message: "Server error while fetching data." });
    }
};