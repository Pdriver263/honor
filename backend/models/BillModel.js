const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    name: { type: String, required: true },
    billNumbers: [{ type: String, required: true }],
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
