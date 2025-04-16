const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Get all contact messages (admin only)
router.get('/', auth.required, auth.isAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Error fetching contact messages' });
  }
});

// Get single message (admin only)
router.get('/:id', auth.required, auth.isAdmin, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({ message: 'Error fetching contact message' });
  }
});

// Submit contact message (public route)
router.post('/', async (req, res) => {
  try {
    console.log('Received contact form submission:', req.body);
    
    // Validate required fields
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      console.error('Missing required fields:', { name, email, subject, message });
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      status: 'pending'
    });
    
    const newContact = await contact.save();
    console.log('Contact message saved successfully:', newContact);
    
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(400).json({ message: 'Error creating contact message' });
  }
});

// Update contact message status (admin only)
router.put('/:id/status', auth.required, auth.isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact message status:', error);
    res.status(400).json({ message: 'Error updating contact message status' });
  }
});

// Delete contact message (admin only)
router.delete('/:id', auth.required, auth.isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ message: 'Error deleting contact message' });
  }
});

module.exports = router; 