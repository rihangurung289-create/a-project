const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { generateVideo } = require('../services/videoService');
const Media = require('../models/Media');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `image_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   POST /api/videos/generate
// @desc    Generate video from text or image
// @access  Private
router.post('/generate', protect, upload.single('image'), async (req, res) => {
  try {
    const { prompt, duration, model } = req.body;
    const imageFile = req.file;

    if (!prompt && !imageFile) {
      return res.status(400).json({ error: 'Prompt or image is required' });
    }

    // Create media record
    const media = await Media.create({
      user: req.user._id,
      type: 'video',
      prompt: prompt || 'Image to video',
      duration: parseInt(duration) || 5,
      model: model || 'runway',
      status: 'processing'
    });

    // Generate video
    try {
      const imageUrl = imageFile 
        ? `${req.protocol}://${req.get('host')}/uploads/${imageFile.filename}`
        : null;

      const result = await generateVideo(
        prompt || 'Generate video from image',
        imageUrl,
        parseInt(duration) || 5,
        model || 'runway'
      );

      // Update media record
      media.fileUrl = result.fileUrl;
      media.model = result.model;
      media.status = 'completed';
      await media.save();

      res.json({
        success: true,
        media: {
          id: media._id,
          fileUrl: result.fileUrl,
          prompt: prompt,
          duration: duration || 5
        }
      });
    } catch (error) {
      media.status = 'failed';
      media.error = error.message;
      await media.save();
      
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/videos/:id
// @desc    Get video by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findOne({
      _id: req.params.id,
      user: req.user._id,
      type: 'video'
    });

    if (!media) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


