// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    maxlength: 150,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'technician', 'employee'],
    default: 'employee',
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compare password method (we'll use bcrypt.compare directly in controller)
userSchema.methods.comparePassword = async function(candidatePassword) {
  // We'll handle this in the controller to avoid bcrypt import in model
  return false; // Placeholder, actual implementation in controller
};

module.exports = mongoose.model('User', userSchema);