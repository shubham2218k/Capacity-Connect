const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  role: {
    type: String,
    enum: ['Trainee', 'Trainer', 'Admin'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'suspended'],
    default: 'active',
  },
  // Professional / Profile fields
  organization: {
    type: String,
  },
  department: {
    type: String,
  },
  designation: {
    type: String,
  },
  // Trainer specific
  qualification: {
    type: String,
  },
  expertise: [{
    type: String,
  }],
  experience: {
    type: String,
  },
  rejectionReason: {
    type: String,
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
