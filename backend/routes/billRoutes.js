const express = require("express");
const router = express.Router();
const {
  createBill,
  getAllBills,
  deleteBill,
  updateBill
} = require("../controllers/billController");

router.post("/", createBill);
router.get("/", getAllBills);
router.delete("/:id", deleteBill);       // <-- ✅ New
router.put("/:id", updateBill);          // <-- ✅ New

module.exports = router;
// Additional routes can be added here if needed in the future