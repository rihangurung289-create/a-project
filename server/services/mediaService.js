const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;

/**
 * Combine video, voice, and background music into a single file
 */
async function combineMedia(videoPath, audioPath, backgroundMusicPath = null, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      let command = ffmpeg(videoPath);

      // Add voice audio
      if (audioPath && await fileExists(audioPath)) {
        command = command.input(audioPath);
      }

      // Add background music (if provided)
      if (backgroundMusicPath && await fileExists(backgroundMusicPath)) {
        command = command.input(backgroundMusicPath);
      }

      // Complex filter for combining audio tracks
      if (audioPath && backgroundMusicPath) {
        command = command
          .complexFilter([
            {
              filter: 'amix',
              options: {
                inputs: audioPath && backgroundMusicPath ? 2 : 1,
                duration: 'longest',
                dropout_transition: 2
              }
            }
          ])
          .audioCodec('aac')
          .audioBitrate('192k');
      } else if (audioPath) {
        command = command.audioCodec('aac').audioBitrate('192k');
      }

      command
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('end', () => {
          console.log('Media combination completed');
          resolve(outputPath);
        })
        .on('error', (err) => {
          console.error('FFmpeg error:', err);
          reject(err);
        })
        .run();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Extract audio from video
 */
async function extractAudio(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}

/**
 * Add audio to video
 */
async function addAudioToVideo(videoPath, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .input(audioPath)
      .outputOptions([
        '-c:v copy',
        '-c:a aac',
        '-map 0:v:0',
        '-map 1:a:0',
        '-shortest'
      ])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}

/**
 * Check if file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get video thumbnail
 */
async function generateThumbnail(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '640x360'
      })
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}

module.exports = {
  combineMedia,
  extractAudio,
  addAudioToVideo,
  generateThumbnail
};



