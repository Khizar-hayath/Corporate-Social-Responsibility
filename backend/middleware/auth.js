const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Required authentication middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.header('x-auth-token');

    // If no x-auth-token, check Authorization header
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user ID from decoded token
    const userId = decoded.user?.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Find user and attach to request
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Optional authentication middleware
const optional = async (req, res, next) => {
  try {
    // Get token from header
    let token = req.header('x-auth-token');

    // If no x-auth-token, check Authorization header
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    // If no token, continue without authentication
    if (!token) {
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user ID from decoded token
    const userId = decoded.user?.id || decoded.userId;
    if (!userId) {
      return next(); // Continue without authentication
    }

    // Find user and attach to request
    const user = await User.findById(userId).select('-password');
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (err) {
    // If token validation fails, continue without authentication
    console.error('Optional auth middleware error:', err);
    next();
  }
};

const isNGO = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.userType !== 'ngo') {
    return res.status(403).json({ message: 'Access denied. NGO only.' });
  }
  next();
};

// Check if user is an admin
const isAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.userType !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = { 
  required: auth, 
  optional,
  isNGO,
  isAdmin
}; 