const mongoose = require("mongoose");

const podSchema = new mongoose.Schema(
  {
    airwayBillNumber: { type: String, required: true },
    deliveryDate: { type: String, required: true },
    deliveryTime: { type: String, required: true },
    statusCode: { type: String, required: true },
    signature: { type: String, required: true },
  },
  { timestamps: true } // createdAt এবং updatedAt ফিল্ড যুক্ত হবে
);

module.exports = mongoose.model("POD", podSchema);
