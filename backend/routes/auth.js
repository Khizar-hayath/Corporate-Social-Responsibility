const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, userType, name, organization } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user - password will be hashed by the pre-save hook
    user = new User({
      email,
      password,
      userType,
      name,
      organization
    });

    // Save user
    await user.save();

    // Create JWT token
    const payload = {
      userId: user.id,
      userType: user.userType,
      name: user.name,
      organization: user.organization
    };

    // Use Promise to handle the asynchronous jwt.sign
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        }
      );
    });

    // Send response with token and user data
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        name: user.name,
        organization: user.organization
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log('User found:', { id: user._id, email: user.email, userType: user.userType });

    // Verify password using the User model's comparePassword method
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      userId: user.id,
      userType: user.userType,
      name: user.name,
      organization: user.organization
    };

    // Use Promise to handle the asynchronous jwt.sign
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        }
      );
    });

    // Send response with token and user data
    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.userType,
        name: user.name,
        organization: user.organization
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 