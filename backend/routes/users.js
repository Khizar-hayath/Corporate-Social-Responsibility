const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
router.get('/', auth.required, auth.isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get single user (admin or same user)
router.get('/:id', auth.required, async (req, res) => {
  try {
    // Allow admins to access any user, but regular users can only access their own
    if (req.user.userType !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to access this user' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create new user (admin only)
router.post('/', auth.required, auth.isAdmin, async (req, res) => {
  try {
    const { name, email, password, userType, organization } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const newUser = new User({
      name,
      email,
      userType,
      organization: organization || '',
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    
    // Save user
    await newUser.save();
    
    // Return user without password
    const userResponse = await User.findById(newUser._id).select('-password');
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Error creating user' });
  }
});

// Update user (admin or same user)
router.put('/:id', auth.required, async (req, res) => {
  try {
    // Allow admins to update any user, but regular users can only update themselves
    if (req.user.userType !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    const { name, email, organization, bio } = req.body;
    const updateData = {};
    
    // Only add fields that were provided
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (organization !== undefined) updateData.organization = organization;
    if (bio !== undefined) updateData.bio = bio;
    
    // Allow admins to update userType
    if (req.user.userType === 'admin' && req.body.userType) {
      updateData.userType = req.body.userType;
    }
    
    // Update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }
    
    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Error updating user' });
  }
});

// Update user type (admin only)
router.put('/:id/userType', auth.required, auth.isAdmin, async (req, res) => {
  try {
    const { userType } = req.body;
    
    // Validate user type
    const validUserTypes = ['admin', 'ngo', 'company', 'user'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { userType },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user type:', error);
    res.status(400).json({ message: 'Error updating user type' });
  }
});

// Delete user (admin only)
router.delete('/:id', auth.required, auth.isAdmin, async (req, res) => {
  try {
    // Prevent deleting the last admin
    if (req.params.id !== req.user.id) {
      const adminCount = await User.countDocuments({ userType: 'admin' });
      const userToDelete = await User.findById(req.params.id);
      
      if (adminCount <= 1 && userToDelete.userType === 'admin') {
        return res.status(400).json({ message: 'Cannot delete the only admin user' });
      }
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router; 