const express = require('express');
const path = require('path');
const { protect } = require('../middleware/auth');
const { combineMedia, addAudioToVideo } = require('../services/mediaService');
const Media = require('../models/Media');
const router = express.Router();

// @route   POST /api/media/combine
// @desc    Combine video, voice, and background music
// @access  Private
router.post('/combine', protect, async (req, res) => {
  try {
    const { videoId, audioId, musicId } = req.body;

    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }

    // Fetch media files
    const video = await Media.findOne({
      _id: videoId,
      user: req.user._id,
      type: 'video'
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    let audio = null;
    let music = null;

    if (audioId) {
      audio = await Media.findOne({
        _id: audioId,
        user: req.user._id,
        type: 'audio'
      });
    }

    if (musicId) {
      music = await Media.findOne({
        _id: musicId,
        user: req.user._id,
        type: 'audio'
      });
    }

    // Create combined media record
    const combinedMedia = await Media.create({
      user: req.user._id,
      type: 'combined',
      prompt: `Combined: ${video.prompt}`,
      status: 'processing'
    });

    try {
      // Get file paths
      const videoPath = path.join(__dirname, '..', video.fileUrl);
      const audioPath = audio ? path.join(__dirname, '..', audio.fileUrl) : null;
      const musicPath = music ? path.join(__dirname, '..', music.fileUrl) : null;
      
      const outputFilename = `combined_${Date.now()}.mp4`;
      const outputPath = path.join(__dirname, '../uploads', outputFilename);

      // Combine media
      await combineMedia(videoPath, audioPath, musicPath, outputPath);

      // Update combined media record
      combinedMedia.fileUrl = `/uploads/${outputFilename}`;
      combinedMedia.status = 'completed';
      combinedMedia.metadata = {
        videoId: videoId,
        audioId: audioId,
        musicId: musicId
      };
      await combinedMedia.save();

      res.json({
        success: true,
        media: {
          id: combinedMedia._id,
          fileUrl: combinedMedia.fileUrl
        }
      });
    } catch (error) {
      combinedMedia.status = 'failed';
      combinedMedia.error = error.message;
      await combinedMedia.save();
      
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/media/download/:id
// @desc    Download media file
// @access  Private
router.get('/download/:id', protect, async (req, res) => {
  try {
    const media = await Media.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const filePath = path.join(__dirname, '..', media.fileUrl);
    res.download(filePath, (err) => {
      if (err) {
        res.status(500).json({ error: 'File download failed' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


