const express = require('express');
const { protect } = require('../middleware/auth');
const { generateTTS, generateBackgroundMusic, generateSoundEffect } = require('../services/audioService');
const Media = require('../models/Media');
const router = express.Router();

// @route   POST /api/audio/tts
// @desc    Generate text-to-speech
// @access  Private
router.post('/tts', protect, async (req, res) => {
  try {
    const { text, voice, provider } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Create media record
    const media = await Media.create({
      user: req.user._id,
      type: 'audio',
      prompt: text,
      voice: voice || 'default',
      status: 'processing'
    });

    // Generate TTS
    try {
      const result = await generateTTS(text, voice || 'default', provider || 'elevenlabs');

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
          text: text,
          voice: voice || 'default'
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

// @route   POST /api/audio/music
// @desc    Generate background music
// @access  Private
router.post('/music', protect, async (req, res) => {
  try {
    const { prompt, duration } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Create media record
    const media = await Media.create({
      user: req.user._id,
      type: 'audio',
      prompt: prompt,
      duration: parseInt(duration) || 30,
      status: 'processing'
    });

    // Generate music
    try {
      const result = await generateBackgroundMusic(prompt, parseInt(duration) || 30);

      media.fileUrl = result.fileUrl;
      media.status = 'completed';
      await media.save();

      res.json({
        success: true,
        media: {
          id: media._id,
          fileUrl: result.fileUrl
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

// @route   POST /api/audio/sound-effect
// @desc    Generate sound effect
// @access  Private
router.post('/sound-effect', protect, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Create media record
    const media = await Media.create({
      user: req.user._id,
      type: 'audio',
      prompt: prompt,
      status: 'processing'
    });

    // Generate sound effect
    try {
      const result = await generateSoundEffect(prompt);

      media.fileUrl = result.fileUrl;
      media.status = 'completed';
      await media.save();

      res.json({
        success: true,
        media: {
          id: media._id,
          fileUrl: result.fileUrl
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

module.exports = router;



