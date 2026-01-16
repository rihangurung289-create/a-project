# AI Media Generator

A complete, production-ready AI-powered web application for generating images, videos, and audio from text prompts.

## 🚀 Features

- **Image Generation**: Create realistic images from text using Stable Diffusion, DALL·E, or SDXL
- **Video Generation**: Generate AI videos from text or images using Runway, Pika, or Stable Video Diffusion
- **Audio Generation**: 
  - Text-to-speech voice synthesis
  - Background music generation
  - Sound effects generation
- **Media Combination**: Combine video + voice + audio into a single downloadable output
- **User Authentication**: Email/password and Google OAuth
- **History Management**: Save and re-generate previous creations
- **Prompt Enhancement**: AI-powered prompt improvement

## 📁 Project Structure

```
ai-media-generator/
├── client/                 # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/               # Utilities and API clients
│   └── public/            # Static assets
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── models/            # MongoDB models
│   ├── services/          # AI service integrations
│   ├── middleware/        # Auth and other middleware
│   └── uploads/           # Generated media storage
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- API keys for AI services (see .env.example)

### Setup Steps

1. **Clone and install dependencies:**

```bash
npm install
cd server && npm install
cd ../client && npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env
# Edit .env with your API keys
```

3. **Start MongoDB:**

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
```

4. **Run the application:**

```bash
# Development (runs both frontend and backend)
npm run dev

# Or run separately:
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:3000
```

## 🔑 API Keys Setup

You'll need API keys from:

1. **OpenAI** - For DALL·E and TTS: https://platform.openai.com/api-keys
2. **Stability AI** - For Stable Diffusion: https://platform.stability.ai/
3. **ElevenLabs** - For voice generation: https://elevenlabs.io/
4. **Runway** - For video generation: https://runwayml.com/
5. **Pika** - Alternative video generation: https://pika.art/
6. **Google Cloud** - For OAuth: https://console.cloud.google.com/

## 📦 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Render)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables
6. Deploy

### Database (MongoDB Atlas)

1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Add to backend .env as MONGODB_URI

## 🎯 Usage

1. **Sign up / Login** - Create an account or use Google OAuth
2. **Generate Images** - Enter a text prompt and select style/resolution
3. **Generate Videos** - Use text or upload an image
4. **Generate Audio** - Create voice, music, or sound effects
5. **Combine Media** - Merge video, voice, and audio into one file
6. **Download** - Save your creations in various formats

## 🛡️ Security Notes

- Never commit `.env` files
- Use environment variables for all API keys
- Implement rate limiting in production
- Use HTTPS in production
- Validate and sanitize all user inputs

## 📝 License

MIT


