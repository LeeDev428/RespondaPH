const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/emergencies
// @desc    Create new emergency report
// @access  Private (Resident)
router.post('/', auth, async (req, res) => {
  try {
    const { type, description, location, contactNumber, priority } = req.body;

    const emergency = new Emergency({
      reportedBy: req.user.id,
      type,
      description,
      location,
      contactNumber,
      priority: priority || 'medium'
    });

    await emergency.save();
    await emergency.populate('reportedBy', 'name phoneNumber email');

    res.status(201).json(emergency);
  } catch (error) {
    console.error('Error creating emergency:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/emergencies
// @desc    Get all emergencies (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = {};

    // Residents can only see their own emergencies
    if (req.user.role === 'resident') {
      query.reportedBy = req.user.id;
    }

    // Responders can see assigned emergencies
    if (req.user.role === 'responder') {
      query.assignedResponders = req.user.id;
    }

    // Apply filters
    if (status) query.status = status;
    if (type) query.type = type;

    const emergencies = await Emergency.find(query)
      .populate('reportedBy', 'name phoneNumber email')
      .populate('assignedResponders', 'name phoneNumber email')
      .sort({ createdAt: -1 });

    res.json(emergencies);
  } catch (error) {
    console.error('Error fetching emergencies:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/emergencies/stats/dashboard
// @desc    Get emergency statistics for dashboard
// @access  Private (Admin)
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const total = await Emergency.countDocuments();
    const pending = await Emergency.countDocuments({ status: 'pending' });
    const active = await Emergency.countDocuments({ 
      status: { $in: ['dispatched', 'responding'] } 
    });
    const resolved = await Emergency.countDocuments({ status: 'resolved' });

    const byType = await Emergency.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      pending,
      active,
      resolved,
      byType
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/emergencies/:id
// @desc    Get emergency by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('reportedBy', 'name phoneNumber email')
      .populate('assignedResponders', 'name phoneNumber email')
      .populate('updates.updatedBy', 'name role');

    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    // Check authorization
    if (req.user.role === 'resident' && emergency.reportedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(emergency);
  } catch (error) {
    console.error('Error fetching emergency:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/emergencies/:id
// @desc    Update emergency (dispatch, status update)
// @access  Private (Admin/Responder)
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, assignedResponders, priority, notes } = req.body;
    
    const emergency = await Emergency.findById(req.params.id);
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    // Admin can dispatch and update
    if (req.user.role === 'admin') {
      if (assignedResponders) emergency.assignedResponders = assignedResponders;
      if (priority) emergency.priority = priority;
      if (status) emergency.status = status;
    }

    // Responder can update status
    if (req.user.role === 'responder') {
      if (status) emergency.status = status;
    }

    // Add update log
    if (status || notes) {
      emergency.updates.push({
        updatedBy: req.user.id,
        status: status || emergency.status,
        notes: notes || '',
        timestamp: new Date()
      });
    }

    // Mark as resolved if status is resolved
    if (status === 'resolved' && !emergency.resolvedAt) {
      emergency.resolvedAt = new Date();
    }

    await emergency.save();
    await emergency.populate('reportedBy', 'name phoneNumber email');
    await emergency.populate('assignedResponders', 'name phoneNumber email');

    res.json(emergency);
  } catch (error) {
    console.error('Error updating emergency:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/emergencies/:id
// @desc    Cancel emergency
// @access  Private (Admin or Reporter)
router.delete('/:id', auth, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }

    // Only admin or the person who reported can cancel
    if (req.user.role !== 'admin' && emergency.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    emergency.status = 'cancelled';
    await emergency.save();

    res.json({ message: 'Emergency cancelled', emergency });
  } catch (error) {
    console.error('Error cancelling emergency:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
