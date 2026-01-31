const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');

/**
 * Generate video using Runway API
 */
async function generateWithRunway(prompt, imageUrl = null, duration = 5) {
  try {
    const apiKey = process.env.RUNWAY_API_KEY;
    if (!apiKey) {
      throw new Error('Runway API key not configured');
    }

    // Runway Gen-2 API
    const endpoint = imageUrl 
      ? 'https://api.runwayml.com/v1/image-to-video' 
      : 'https://api.runwayml.com/v1/text-to-video';

    const payload = imageUrl
      ? {
          image: imageUrl,
          duration: duration
        }
      : {
          prompt: prompt,
          duration: duration
        };

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Poll for completion
    const taskId = response.data.id;
    let status = 'processing';
    let videoUrl = null;

    // Poll every 5 seconds (max 2 minutes)
    for (let i = 0; i < 24; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await axios.get(
        `https://api.runwayml.com/v1/tasks/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      status = statusResponse.data.status;
      
      if (status === 'completed') {
        videoUrl = statusResponse.data.output;
        break;
      } else if (status === 'failed') {
        throw new Error('Video generation failed');
      }
    }

    if (!videoUrl) {
      throw new Error('Video generation timeout');
    }

    // Download and save video
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const filename = `video_${Date.now()}.mp4`;
    const filepath = path.join(__dirname, '../uploads', filename);

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, Buffer.from(videoResponse.data));

    return {
      fileUrl: `/uploads/${filename}`,
      model: 'runway-gen2'
    };
  } catch (error) {
    console.error('Runway error:', error.response?.data || error.message);
    throw new Error(`Video generation failed: ${error.message}`);
  }
}

/**
 * Generate video using Pika API
 */
async function generateWithPika(prompt, imageUrl = null, duration = 5) {
  try {
    const apiKey = process.env.PIKA_API_KEY;
    if (!apiKey) {
      throw new Error('Pika API key not configured');
    }

    const endpoint = 'https://api.pika.art/v1/generate';
    
    const payload = {
      prompt: prompt,
      duration: duration,
      ...(imageUrl && { image: imageUrl })
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Similar polling mechanism
    const taskId = response.data.id;
    let videoUrl = null;

    for (let i = 0; i < 24; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusResponse = await axios.get(
        `https://api.pika.art/v1/status/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      if (statusResponse.data.status === 'completed') {
        videoUrl = statusResponse.data.video_url;
        break;
      }
    }

    if (!videoUrl) {
      throw new Error('Video generation timeout');
    }

    // Download and save
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const filename = `video_${Date.now()}.mp4`;
    const filepath = path.join(__dirname, '../uploads', filename);

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, Buffer.from(videoResponse.data));

    return {
      fileUrl: `/uploads/${filename}`,
      model: 'pika'
    };
  } catch (error) {
    console.error('Pika error:', error.response?.data || error.message);
    throw new Error(`Video generation failed: ${error.message}`);
  }
}

/**
 * Main video generation function
 */
async function generateVideo(prompt, imageUrl = null, duration = 5, model = 'runway') {
  try {
    if (model === 'pika') {
      return await generateWithPika(prompt, imageUrl, duration);
    } else {
      return await generateWithRunway(prompt, imageUrl, duration);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateVideo
};



