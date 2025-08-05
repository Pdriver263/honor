const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
    airwayBillNumber: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    deliveryTime: { type: String, required: true },
    statusCode: { type: String, required: true },
    signature: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Tracking", trackingSchema);