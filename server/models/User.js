const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password not required if using Google OAuth
    },
    minlength: 6
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  avatar: {
    type: String
  },
  credits: {
    type: Number,
    default: 100 // Free credits for new users
  },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);


