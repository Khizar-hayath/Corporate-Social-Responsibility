const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['ngo', 'company', 'admin'],
    default: 'company'
  },
  organization: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Comparing passwords for user:', this.email);
  console.log('Candidate password:', candidatePassword);
  console.log('Stored hashed password:', this.password);
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log('Password comparison result:', isMatch);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema); 