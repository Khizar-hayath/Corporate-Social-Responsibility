const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['education', 'environment', 'health', 'community']
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Completed', 'Planned']
  },
  location: {
    type: String,
    required: true
  },
  impact: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  budget: {
    type: Number
  },
  volunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema); 