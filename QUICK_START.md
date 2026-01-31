# Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Install Dependencies

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

## Step 2: Create Environment Files

**Backend:**
```bash
cd server
# Copy ENV_TEMPLATE.txt to .env
# On Windows: copy ..\ENV_TEMPLATE.txt .env
# On Mac/Linux: cp ../ENV_TEMPLATE.txt .env
# Then edit .env with your API keys
```

**Frontend:**
```bash
cd client
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

## Step 3: Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally
- Start it: `mongod`
- Use: `mongodb://localhost:27017/ai-media-generator`

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string
4. Add to `server/.env`: `MONGODB_URI=your-connection-string`

## Step 4: Get API Keys (Minimum Required)

At minimum, get one API key to test:

**For Images:**
- Stability AI: https://platform.stability.ai (Free tier available)
- OR OpenAI: https://platform.openai.com (Paid)

**For Videos:**
- Runway: https://runwayml.com
- OR Pika: https://pika.art

**For Audio:**
- ElevenLabs: https://elevenlabs.io (Free tier available)
- OR OpenAI: https://platform.openai.com

Add at least one key to `server/.env` to get started!

## Step 5: Run the App

```bash
# From root directory
npm run dev
```

This starts both frontend (port 3000) and backend (port 5000).

## Step 6: Test It!

1. Open http://localhost:3000
2. Click "Sign Up" to create account
3. Go to "Generate Image"
4. Enter a prompt like "A beautiful sunset"
5. Click "Generate Image"
6. Wait for result!

## Troubleshooting

**Port already in use?**
- Change `PORT=5001` in `server/.env`

**MongoDB connection error?**
- Check MongoDB is running
- Verify connection string in `.env`

**API key errors?**
- Make sure keys are correct
- Check API service status
- Verify keys are in `server/.env` (not committed to git)

**Module not found?**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read `SETUP.md` for detailed setup
- Read `DEPLOYMENT.md` for production deployment
- Check `PROJECT_SUMMARY.md` for feature overview

Happy generating! 🚀



