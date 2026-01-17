const express = require('express');
const { protect } = require('../middleware/auth');
const Media = require('../models/Media');
const router = express.Router();

// @route   GET /api/history
// @desc    Get user's media history
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;
    
    const query = { user: req.user._id };
    if (type) {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-metadata');

    const total = await Media.countDocuments(query);

    res.json({
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/history/:id
// @desc    Get specific media item
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/history/:id
// @desc    Delete media item
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const media = await Media.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    await Media.deleteOne({ _id: req.params.id });

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



