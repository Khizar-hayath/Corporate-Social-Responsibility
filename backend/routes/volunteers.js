const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const { auth } = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Get all volunteers (admin only)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Error fetching volunteers' });
  }
});

// Get single volunteer (admin only)
router.get('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).populate('projects');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    console.error('Error fetching volunteer:', error);
    res.status(500).json({ message: 'Error fetching volunteer' });
  }
});

// Submit volunteer application (public route)
router.post('/', async (req, res) => {
  try {
    console.log('Received volunteer application:', req.body);
    
    // Validate required fields
    const { name, email, phone, availability, message } = req.body;
    if (!name || !email || !phone || !availability || !message) {
      console.error('Missing required fields:', { name, email, phone, availability, message });
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    const volunteer = new Volunteer({
      name,
      email,
      phone,
      skills: req.body.skills || [],
      interests: req.body.interests || [],
      availability,
      message,
      status: 'pending'
    });
    
    const newVolunteer = await volunteer.save();
    console.log('Volunteer application saved successfully:', newVolunteer);
    
    res.status(201).json(newVolunteer);
  } catch (error) {
    console.error('Error creating volunteer application:', error);
    res.status(400).json({ message: 'Error creating volunteer application' });
  }
});

// Update volunteer status (admin only)
router.put('/:id/status', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    console.error('Error updating volunteer status:', error);
    res.status(400).json({ message: 'Error updating volunteer status' });
  }
});

// Delete volunteer (admin only)
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ message: 'Error deleting volunteer' });
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