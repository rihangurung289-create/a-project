# Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Set Up Environment Variables

**Backend (.env in server folder):**
```bash
cd server
cp ../.env.example .env
# Edit .env with your API keys
```

**Frontend (.env.local in client folder):**
```bash
cd client
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally, then:
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Add to backend `.env`: `MONGODB_URI=your-connection-string`

### 4. Run the Application

**Development (both frontend and backend):**
```bash
# From root directory
npm run dev
```

**Or run separately:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Keys Setup

### Required API Keys

1. **OpenAI** (for DALL·E and TTS)
   - Sign up: https://platform.openai.com
   - Get API key from: https://platform.openai.com/api-keys
   - Add to `.env`: `OPENAI_API_KEY=sk-...`

2. **Stability AI** (for Stable Diffusion)
   - Sign up: https://platform.stability.ai
   - Get API key from dashboard
   - Add to `.env`: `STABILITY_API_KEY=sk-...`

3. **ElevenLabs** (for Voice Generation)
   - Sign up: https://elevenlabs.io
   - Get API key from profile
   - Add to `.env`: `ELEVENLABS_API_KEY=...`

4. **Runway** (for Video Generation)
   - Sign up: https://runwayml.com
   - Get API key from account settings
   - Add to `.env`: `RUNWAY_API_KEY=...`

5. **Pika** (Alternative Video Generation)
   - Sign up: https://pika.art
   - Get API key
   - Add to `.env`: `PIKA_API_KEY=...`

### Optional: Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## FFmpeg Installation

For media combination features, you need FFmpeg:

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
- Download from https://ffmpeg.org/download.html
- Add to PATH

## Troubleshooting

### Port Already in Use
```bash
# Change port in server/.env
PORT=5001
```

### MongoDB Connection Error
- Check MongoDB is running
- Verify connection string in `.env`
- Check network/firewall settings

### API Key Errors
- Verify keys are correct
- Check API quotas/limits
- Ensure keys are in `.env` file (not committed to git)

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check browser console for specific error

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
ai-media-generator/
├── client/              # Next.js frontend
│   ├── app/            # Pages and routes
│   ├── components/    # React components
│   └── lib/           # Utilities and API
├── server/            # Express backend
│   ├── routes/        # API routes
│   ├── models/        # MongoDB models
│   ├── services/      # AI service integrations
│   └── middleware/    # Auth middleware
└── README.md
```

## Next Steps

1. Create an account at http://localhost:3000/register
2. Generate your first image
3. Explore video and audio generation
4. Try combining media
5. Check your history

## Development Tips

- Use browser DevTools to debug API calls
- Check server logs for backend errors
- Use MongoDB Compass to view database
- Test API endpoints with Postman/Thunder Client

## Need Help?

- Check the main README.md
- Review DEPLOYMENT.md for production setup
- Check API documentation in code comments
- Review error messages in browser console and server logs



