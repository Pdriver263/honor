const express = require("express");
const router = express.Router();
const DVboysModel = require("../models/DVboysModel");

// POST API: ডেটা সেভ করা
router.post("/", async (req, res) => {
    try {
        const data = new DVboysModel(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ message: "Failed to save data", error: err });
    }
});

// GET API: ডেটা ফেচ করা
router.get("/", async (req, res) => {
    try {
        const data = await DVboysModel.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch data", error: err });
    }
});

module.exports = router;