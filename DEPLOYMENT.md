# Deployment Guide

This guide will help you deploy the AI Media Generator application to production.

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render account (for backend) or any Node.js hosting
- MongoDB Atlas account (for database)
- API keys for all AI services

## Step 1: Prepare Your Code

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for Render)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/ai-media-generator`

## Step 3: Deploy Backend (Render)

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `ai-media-generator-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   Add these in Render dashboard:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-frontend.vercel.app
   OPENAI_API_KEY=your-openai-key
   STABILITY_API_KEY=your-stability-key
   ELEVENLABS_API_KEY=your-elevenlabs-key
   RUNWAY_API_KEY=your-runway-key
   PIKA_API_KEY=your-pika-key
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-app.onrender.com`

## Step 4: Deploy Frontend (Vercel)

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Root Directory**: `client`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Your app will be live at `https://your-app.vercel.app`

## Step 5: Update CORS Settings

In your backend `.env` file on Render, make sure:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

## Step 6: File Storage (Optional)

For production, consider using cloud storage:

### Option 1: AWS S3
1. Create S3 bucket
2. Set up IAM user with S3 permissions
3. Add to backend `.env`:
   ```
   STORAGE_TYPE=s3
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_BUCKET_NAME=your-bucket
   ```

### Option 2: Cloudinary
1. Create Cloudinary account
2. Add to backend `.env`:
   ```
   STORAGE_TYPE=cloudinary
   CLOUDINARY_CLOUD_NAME=your-name
   CLOUDINARY_API_KEY=your-key
   CLOUDINARY_API_SECRET=your-secret
   ```

## Step 7: Install FFmpeg (for Media Combination)

If using Render, add a build script to install FFmpeg:

1. Create `server/.build.sh`:
   ```bash
   #!/bin/bash
   apt-get update
   apt-get install -y ffmpeg
   ```

2. Or use a Dockerfile (recommended for production)

## Step 8: Testing

1. Visit your frontend URL
2. Register a new account
3. Test image generation
4. Check backend logs in Render dashboard

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Check CORS settings match frontend URL

### Frontend Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for errors
- Ensure backend is accessible

### Media Generation Issues
- Verify API keys are correct
- Check API rate limits
- Review service-specific error messages

## Security Checklist

- [ ] Use strong JWT secret
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set up rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Set up proper CORS
- [ ] Implement request size limits

## Monitoring

Consider setting up:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Uptime Robot** for uptime monitoring
- **MongoDB Atlas** monitoring dashboard

## Scaling

As your app grows:
- Use CDN for static assets
- Implement Redis for caching
- Set up database indexes
- Use queue system (Bull/BullMQ) for async tasks
- Consider serverless functions for heavy processing

## Cost Optimization

- Use free tiers where possible
- Implement usage limits per user
- Cache frequently used data
- Optimize image/video sizes
- Use compression for API responses


