const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'combined'],
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  enhancedPrompt: {
    type: String
  },
  style: {
    type: String,
    default: 'realistic'
  },
  resolution: {
    type: String,
    default: '1024x1024'
  },
  duration: {
    type: Number, // in seconds
    default: 5
  },
  voice: {
    type: String,
    default: 'default'
  },
  model: {
    type: String, // Which AI model was used
    default: 'stable-diffusion'
  },
  fileUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // Store additional data
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  error: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
mediaSchema.index({ user: 1, createdAt: -1 });
mediaSchema.index({ type: 1 });

module.exports = mongoose.model('Media', mediaSchema);


