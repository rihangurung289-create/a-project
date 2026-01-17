const express = require('express');
const { protect } = require('../middleware/auth');
const { generateImage, enhancePrompt } = require('../services/imageService');
const Media = require('../models/Media');
const router = express.Router();

// @route   POST /api/images/generate
// @desc    Generate image from text prompt
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    const { prompt, style, resolution, model, enhance } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Enhance prompt if requested
    let finalPrompt = prompt;
    let enhancedPromptText = null;
    
    if (enhance) {
      enhancedPromptText = await enhancePrompt(prompt);
      finalPrompt = enhancedPromptText;
    }

    // Create media record
    const media = await Media.create({
      user: req.user._id,
      type: 'image',
      prompt: prompt,
      enhancedPrompt: enhancedPromptText,
      style: style || 'realistic',
      resolution: resolution || '1024x1024',
      model: model || 'stable-diffusion',
      status: 'processing'
    });

    // Generate image
    try {
      const result = await generateImage(
        finalPrompt,
        style || 'realistic',
        resolution || '1024x1024',
        model || 'stable-diffusion'
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
          enhancedPrompt: enhancedPromptText,
          style: style || 'realistic',
          resolution: resolution || '1024x1024'
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

// @route   GET /api/images/:id
// @desc    Get image by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findOne({
      _id: req.params.id,
      user: req.user._id,
      type: 'image'
    });

    if (!media) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



