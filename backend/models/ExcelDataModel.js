const mongoose = require('mongoose');

const excelDataSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  headers: {
    type: [String],
    required: [true, 'Headers are required'],
    validate: {
      validator: (headers) => headers.length > 0,
      message: 'At least one header is required'
    }
  },
  data: {
    type: [[mongoose.Schema.Types.Mixed]],
    required: [true, 'Data is required'],
    validate: {
      validator: (data) => data.length > 0,
      message: 'Data cannot be empty'
    }
  },
  processedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
excelDataSchema.index({ createdBy: 1, processedAt: -1 });

// Add instance methods if needed
excelDataSchema.methods.toJSON = function() {
  const excelData = this.toObject();
  delete excelData.__v;
  return excelData;
};

module.exports = mongoose.model('ExcelData', excelDataSchema);