const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generate image using Stable Diffusion (Stability AI)
 */
async function generateWithStableDiffusion(prompt, style, resolution) {
  try {
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      throw new Error('Stability API key not configured');
    }

    // Map style to Stable Diffusion parameters
    const stylePrompts = {
      realistic: 'photorealistic, high quality, detailed',
      cinematic: 'cinematic lighting, dramatic, film grain',
      anime: 'anime style, vibrant colors, detailed',
      artistic: 'artistic, painting style, creative',
      futuristic: 'futuristic, sci-fi, cyberpunk'
    };

    const enhancedPrompt = `${prompt}, ${stylePrompts[style] || stylePrompts.realistic}`;

    // Stability AI API endpoint
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [{ text: enhancedPrompt }],
        cfg_scale: 7,
        height: parseInt(resolution.split('x')[1]),
        width: parseInt(resolution.split('x')[0]),
        steps: 30,
        samples: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    // Save image locally
    const imageData = response.data.artifacts[0].base64;
    const buffer = Buffer.from(imageData, 'base64');
    const filename = `image_${Date.now()}.png`;
    const filepath = path.join(__dirname, '../uploads', filename);

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);

    return {
      fileUrl: `/uploads/${filename}`,
      model: 'stable-diffusion-xl'
    };
  } catch (error) {
    console.error('Stable Diffusion error:', error.response?.data || error.message);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Generate image using DALL·E (OpenAI)
 */
async function generateWithDALLE(prompt, style, resolution) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const stylePrompts = {
      realistic: 'photorealistic',
      cinematic: 'cinematic, dramatic lighting',
      anime: 'anime style',
      artistic: 'artistic painting',
      futuristic: 'futuristic sci-fi'
    };

    const enhancedPrompt = `${prompt}, ${stylePrompts[style] || stylePrompts.realistic}`;

    // Map resolution to DALL·E sizes
    const sizeMap = {
      '1024x1024': '1024x1024',
      '512x512': '512x512',
      '256x256': '256x256'
    };

    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: enhancedPrompt,
        n: 1,
        size: sizeMap[resolution] || '1024x1024',
        response_format: 'url'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Download and save image
    const imageUrl = response.data.data[0].url;
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const filename = `image_${Date.now()}.png`;
    const filepath = path.join(__dirname, '../uploads', filename);

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, Buffer.from(imageResponse.data));

    return {
      fileUrl: `/uploads/${filename}`,
      model: 'dalle-3'
    };
  } catch (error) {
    console.error('DALL·E error:', error.response?.data || error.message);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Main image generation function
 */
async function generateImage(prompt, style, resolution, model = 'stable-diffusion') {
  try {
    if (model === 'dalle' || model === 'dalle-3') {
      return await generateWithDALLE(prompt, style, resolution);
    } else {
      return await generateWithStableDiffusion(prompt, style, resolution);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Enhance prompt using AI
 */
async function enhancePrompt(prompt) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return prompt; // Return original if no API key
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a prompt engineering expert. Enhance image generation prompts to be more detailed and effective while keeping the original intent.'
          },
          {
            role: 'user',
            content: `Enhance this image generation prompt: "${prompt}"`
          }
        ],
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Prompt enhancement error:', error.message);
    return prompt; // Return original on error
  }
}

module.exports = {
  generateImage,
  enhancePrompt
};



