const express = require("express");
const router = express.Router();
const POD = require("../models/POD"); // POD মডেল ইম্পোর্ট

// POST: নতুন POD ডেটা তৈরি এবং সংরক্ষণ
router.post("/", async (req, res) => {
  try {
    const newPOD = new POD(req.body);
    await newPOD.save();
    res.status(201).json({ message: "POD data saved successfully.", newPOD });
  } catch (err) {
    console.error("Error saving POD data:", err);
    res.status(500).json({ error: "Failed to save POD data." });
  }
});

// GET: সমস্ত POD ডেটা দেখানো
router.get("/", async (req, res) => {
  try {
    const pods = await POD.find();
    res.status(200).json(pods);
  } catch (err) {
    console.error("Error fetching POD data:", err);
    res.status(500).json({ error: "Failed to fetch POD data." });
  }
});

// DELETE: নির্দিষ্ট POD ডেটা মুছে ফেলা
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPOD = await POD.findByIdAndDelete(id);
    if (!deletedPOD) {
      return res.status(404).json({ message: "POD not found!" });
    }
    res.status(200).json({ message: "POD deleted successfully.", deletedPOD });
  } catch (err) {
    console.error("Error deleting POD data:", err);
    res.status(500).json({ error: "Failed to delete POD data." });
  }
});

// PUT: নির্দিষ্ট POD ডেটা আপডেট করা
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPOD = await POD.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPOD) {
      return res.status(404).json({ message: "POD not found!" });
    }
    res.status(200).json({ message: "POD updated successfully.", updatedPOD });
  } catch (err) {
    console.error("Error updating POD data:", err);
    res.status(500).json({ error: "Failed to update POD data." });
  }
});

module.exports = router;
