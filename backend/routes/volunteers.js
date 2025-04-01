const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// Get all volunteers (admin only)
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate('projects');
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single volunteer (admin only)
router.get('/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('projects');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create volunteer application
router.post('/', async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    const newVolunteer = await volunteer.save();
    res.status(201).json(newVolunteer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update volunteer status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete volunteer (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json({ message: 'Volunteer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add project to volunteer
router.post('/:id/projects', async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    volunteer.projects.push(req.body.projectId);
    await volunteer.save();
    res.json(volunteer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 