const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'resident', 'responder'],
    default: 'resident'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Responder specific fields
  responderDetails: {
    specialization: {
      type: String,
      enum: ['fire', 'medical', 'police', 'rescue', 'general']
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
