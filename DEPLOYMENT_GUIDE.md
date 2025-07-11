# 🚀 Complete Backend Deployment Guide

## Step 1: Get Your Backend Ready

First, let's make sure your backend is properly configured for deployment.

### Check Your server/package.json
Your server needs its own package.json file. Let's create it:

```json
{
  "name": "asira-ai-backend",
  "version": "1.0.0",
  "description": "Asira AI Backend Server",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.6.0",
    "@google/generative-ai": "^0.2.1",
    "googleapis": "^128.0.0",
    "google-trends-api": "^4.9.2",
    "helmet": "^7.1.5",
    "express-rate-limit": "^7.1.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    "node-cron": "^3.0.3",
    "node-fetch": "^3.3.2"
  }
}
```

## Step 2: Deploy to Railway (Easiest Option)

### 2.1 Sign Up for Railway
1. Go to https://railway.app
2. Click "Login" 
3. Choose "Login with GitHub"
4. Authorize Railway to access your GitHub

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository (asira-ai or whatever you named it)
4. Railway will automatically detect it's a Node.js project

### 2.3 Configure Environment Variables
In Railway dashboard:
1. Click on your project
2. Go to "Variables" tab
3. Add these variables:

```
NODE_ENV=production
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
JWT_SECRET=your_random_secret_here_make_it_long_and_random
```

### 2.4 Set Root Directory
1. In Railway dashboard, go to "Settings"
2. Find "Root Directory" 
3. Set it to: `server`
4. This tells Railway your backend code is in the server folder

## Step 3: Get Your API Keys

### 3.1 Google Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and save it

### 3.2 YouTube API Key
1. Go to https://console.developers.google.com/
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the key

### 3.3 Google OAuth (for login)
1. In Google Console, go to "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Set Application type to "Web application"
4. Add your Railway URL to authorized origins
5. Copy Client ID and Client Secret

## Step 4: Update Your Frontend

Once Railway gives you a URL (like https://your-app.railway.app), update your frontend:

### 4.1 Create Environment File
Create `.env` in your project root:

```
VITE_API_URL=https://your-app.railway.app
```

### 4.2 Update API Calls
In your React components, change all API calls from:
```javascript
fetch('http://localhost:3001/api/...')
```
To:
```javascript
fetch(`${import.meta.env.VITE_API_URL}/api/...`)
```

## Step 5: Test Everything

1. Your Railway backend should be live at: https://your-app.railway.app
2. Test the health endpoint: https://your-app.railway.app/api/health
3. Try signing up on your frontend
4. Check Railway logs if something breaks

## Alternative: Render Deployment

If Railway doesn't work, try Render:

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Set:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in Render dashboard

## Troubleshooting

### Backend Won't Start
- Check Railway/Render logs
- Make sure package.json is in server folder
- Verify all environment variables are set

### CORS Errors
- Add your Netlify domain to CORS origins in server/index.js
- Make sure both http and https versions are included

### API Keys Not Working
- Double-check all API keys are correct
- Make sure APIs are enabled in Google Console
- Check quotas and billing

## Need Help?

If you get stuck:
1. Check Railway/Render deployment logs
2. Test API endpoints directly in browser
3. Check browser console for errors
4. Make sure environment variables are set correctly

Your backend will be live at: `https://your-app.railway.app`
Your frontend will be at: `https://your-site.netlify.app`

Both will work together once deployed! 🚀