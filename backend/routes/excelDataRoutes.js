// backend/routes/excelDataRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ExcelData = require('../models/ExcelDataModel');

// Save processed data
router.post('/', auth, async (req, res) => {
  try {
    const { fileName, headers, data } = req.body;
    
    const excelData = new ExcelData({
      fileName,
      headers,
      data,
      processedBy: req.user.id
    });

    await excelData.save();
    res.status(201).json(excelData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all excel data
router.get('/', auth, async (req, res) => {
  try {
    const excelData = await ExcelData.find().populate('processedBy', 'name');
    res.json(excelData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete excel data
router.delete('/:id', auth, async (req, res) => {
  try {
    await ExcelData.findByIdAndDelete(req.params.id);
    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;