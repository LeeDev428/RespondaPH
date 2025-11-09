const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['fire', 'flood', 'medical', 'accident', 'crime', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'responding', 'resolved', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedResponders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  updates: [{
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: String,
    notes: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Emergency', EmergencySchema);
