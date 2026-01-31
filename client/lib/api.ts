import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Image API
export const imageAPI = {
  generate: async (data: {
    prompt: string;
    style?: string;
    resolution?: string;
    model?: string;
    enhance?: boolean;
  }) => {
    const response = await api.post('/images/generate', data);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/images/${id}`);
    return response.data;
  },
};

// Video API
export const videoAPI = {
  generate: async (data: {
    prompt?: string;
    image?: File;
    duration?: number;
    model?: string;
  }) => {
    const formData = new FormData();
    if (data.prompt) formData.append('prompt', data.prompt);
    if (data.image) formData.append('image', data.image);
    if (data.duration) formData.append('duration', data.duration.toString());
    if (data.model) formData.append('model', data.model);

    const response = await api.post('/videos/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },
};

// Audio API
export const audioAPI = {
  generateTTS: async (data: {
    text: string;
    voice?: string;
    provider?: string;
  }) => {
    const response = await api.post('/audio/tts', data);
    return response.data;
  },
  generateMusic: async (data: {
    prompt: string;
    duration?: number;
  }) => {
    const response = await api.post('/audio/music', data);
    return response.data;
  },
  generateSoundEffect: async (data: { prompt: string }) => {
    const response = await api.post('/audio/sound-effect', data);
    return response.data;
  },
};

// Media API
export const mediaAPI = {
  combine: async (data: {
    videoId: string;
    audioId?: string;
    musicId?: string;
  }) => {
    const response = await api.post('/media/combine', data);
    return response.data;
  },
  download: async (id: string) => {
    const response = await api.get(`/media/download/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// History API
export const historyAPI = {
  getAll: async (params?: { type?: string; page?: number; limit?: number }) => {
    const response = await api.get('/history', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/history/${id}`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  },
};

export default api;



