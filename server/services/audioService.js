const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');

/**
 * Generate text-to-speech using ElevenLabs
 */
async function generateTTSWithElevenLabs(text, voice = 'default', model = 'eleven_multilingual_v2') {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Voice IDs mapping
    const voiceMap = {
      'default': '21m00Tcm4TlvDq8ikWAM', // Rachel
      'male': 'pNInz6obpgDQGcFmaJgB', // Adam
      'female': 'EXAVITQu4vr4xnSDxMaL', // Bella
      'british': 'ThT5KcBeYPX3keUQqHPh', // Dorothy
      'australian': 'VR6AewLTigWG4xSOukaG', // Arnold
    };

    const voiceId = voiceMap[voice] || voiceMap.default;

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        responseType: 'arraybuffer'
      }
    );

    // Save audio file
    const filename = `tts_${Date.now()}.mp3`;
    const filepath = path.join(__dirname, '../uploads', filename);

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, Buffer.from(response.data));

    return {
      fileUrl: `/uploads/${filename}`,
      model: 'elevenlabs'
    };
  } catch (error) {
    console.error('ElevenLabs TTS error:', error.response?.data || error.message);
    throw new Error(`TTS generation failed: ${error.message}`);
  }
}

/**
 * Generate text-to-speech using OpenAI TTS
 */
async function generateTTSWithOpenAI(text, voice = 'alloy') {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const voiceOptions = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    const selectedVoice = voiceOptions.includes(voice) ? voice : 'alloy';

    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        input: text,
        voice: selectedVoice
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // Save audio file
    const filename = `tts_${Date.now()}.mp3`;
    const filepath = path.join(__dirname, '../uploads', filename);

    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, Buffer.from(response.data));

    return {
      fileUrl: `/uploads/${filename}`,
      model: 'openai-tts'
    };
  } catch (error) {
    console.error('OpenAI TTS error:', error.response?.data || error.message);
    throw new Error(`TTS generation failed: ${error.message}`);
  }
}

/**
 * Generate background music (placeholder - would use MusicLM or AudioCraft)
 */
async function generateBackgroundMusic(prompt, duration = 30) {
  try {
    // Note: This is a placeholder implementation
    // In production, you would integrate with MusicLM or Meta AudioCraft
    // For now, we'll return a placeholder response
    
    // Example: Using a music generation API (you'd replace this with actual API)
    // const response = await axios.post('https://api.musiclm.example.com/generate', {
    //   prompt: prompt,
    //   duration: duration
    // });

    // For demo purposes, return a placeholder
    throw new Error('Music generation API not configured. Please integrate MusicLM or AudioCraft.');
  } catch (error) {
    throw error;
  }
}

/**
 * Generate sound effects (placeholder)
 */
async function generateSoundEffect(prompt) {
  try {
    // Placeholder for sound effect generation
    // Would integrate with appropriate API
    throw new Error('Sound effect generation API not configured.');
  } catch (error) {
    throw error;
  }
}

/**
 * Main TTS generation function
 */
async function generateTTS(text, voice = 'default', provider = 'elevenlabs') {
  try {
    if (provider === 'openai') {
      return await generateTTSWithOpenAI(text, voice);
    } else {
      return await generateTTSWithElevenLabs(text, voice);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateTTS,
  generateBackgroundMusic,
  generateSoundEffect
};



