const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/responders
// @desc    Get all responders
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized. Admin only.' });
    }

    const responders = await User.find({ role: 'responder' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(responders);
  } catch (error) {
    console.error('Error fetching responders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/responders
// @desc    Create new responder (Admin only)
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized. Admin only.' });
    }

    const { name, email, phoneNumber, password, specialization } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone number already exists' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const responder = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: 'responder',
      responderDetails: {
        specialization: specialization || 'general',
        availability: 'available'
      }
    });

    await responder.save();

    res.status(201).json({
      id: responder._id,
      name: responder.name,
      email: responder.email,
      phoneNumber: responder.phoneNumber,
      role: responder.role,
      responderDetails: responder.responderDetails
    });
  } catch (error) {
    console.error('Error creating responder:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/responders/:id
// @desc    Update responder
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized. Admin only.' });
    }

    const { name, email, phoneNumber, isActive, specialization, availability } = req.body;

    const responder = await User.findById(req.params.id);

    if (!responder || responder.role !== 'responder') {
      return res.status(404).json({ message: 'Responder not found' });
    }

    if (name) responder.name = name;
    if (email) responder.email = email;
    if (phoneNumber) responder.phoneNumber = phoneNumber;
    if (typeof isActive === 'boolean') responder.isActive = isActive;
    
    if (specialization) responder.responderDetails.specialization = specialization;
    if (availability) responder.responderDetails.availability = availability;

    await responder.save();

    res.json({
      id: responder._id,
      name: responder.name,
      email: responder.email,
      phoneNumber: responder.phoneNumber,
      role: responder.role,
      isActive: responder.isActive,
      responderDetails: responder.responderDetails
    });
  } catch (error) {
    console.error('Error updating responder:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/responders/:id
// @desc    Delete responder (soft delete)
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized. Admin only.' });
    }

    const responder = await User.findById(req.params.id);

    if (!responder || responder.role !== 'responder') {
      return res.status(404).json({ message: 'Responder not found' });
    }

    responder.isActive = false;
    await responder.save();

    res.json({ message: 'Responder deactivated' });
  } catch (error) {
    console.error('Error deleting responder:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/responders/availability/:id
// @desc    Update responder availability (by responder themselves)
// @access  Private (Responder)
router.put('/availability/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'responder' || req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { availability } = req.body;

    const responder = await User.findById(req.params.id);

    if (!responder) {
      return res.status(404).json({ message: 'Responder not found' });
    }

    responder.responderDetails.availability = availability;
    await responder.save();

    res.json({
      id: responder._id,
      availability: responder.responderDetails.availability
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
