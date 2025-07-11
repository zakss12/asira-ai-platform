# 🚀 Complete GitHub Setup & Deployment Guide

## Step 1: Create GitHub Repository (5 minutes)

### 1.1 Sign Up/Login to GitHub
1. Go to https://github.com
2. Sign up for free account (or login if you have one)
3. Verify your email

### 1.2 Create New Repository
1. Click the **green "New"** button (or + icon → New repository)
2. Repository name: `asira-ai` (or whatever you want)
3. Description: `AI-powered content creation platform`
4. Make it **Public** (free hosting works better)
5. ✅ Check "Add a README file"
6. Click **"Create repository"**

## Step 2: Upload Your Code to GitHub (10 minutes)

### Recommended Method: Download and Upload via GitHub Web Interface

1. **Download your project** as a ZIP file from Bolt (use the download button in the file explorer)
2. **Extract the ZIP** file on your computer
3. **Go to your GitHub repository** page
4. **Click "uploading an existing file"** link
5. **Drag and drop** all your project files (make sure to maintain folder structure)
6. **Write commit message**: "Initial commit - Asira AI platform"
7. **Click "Commit changes"**

**Important**: When uploading, make sure to preserve the folder structure:
- All files in `src/` folder should remain in `src/`
- All files in `server/` folder should remain in `server/`
- All component files should stay in `src/components/`

## Step 3: Deploy Backend to Railway (5 minutes)

### 3.1 Sign Up for Railway
1. Go to https://railway.app
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway

### 3.2 Deploy Your Backend
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **asira-ai** repository
4. Railway will start deploying automatically! ✨

### 3.3 Configure Railway Settings
1. **Click on your project** in Railway dashboard
2. Go to **"Settings"** tab
3. Set **"Root Directory"** to: `server`
4. Go to **"Variables"** tab
5. Add these environment variables:

```
NODE_ENV=production
PORT=3001
JWT_SECRET=make_this_super_long_random_string_12345678901234567890
```

## Step 4: Get API Keys (10 minutes)

### 4.1 Google Gemini API (Required for AI)
1. Go to https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy it and add to Railway: `GEMINI_API_KEY=your_key_here`

### 4.2 YouTube API (Required for analytics)
1. Go to https://console.developers.google.com/
2. Create new project
3. Enable **"YouTube Data API v3"**
4. Create **API Key**
5. Add to Railway: `YOUTUBE_API_KEY=your_key_here`

## Step 5: Deploy Frontend to Netlify (5 minutes)

### 5.1 Sign Up for Netlify
1. Go to https://netlify.com
2. Click **"Sign up"**
3. Choose **"GitHub"** to sign up

### 5.2 Deploy Your Frontend
1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select your **asira-ai** repository
4. Set these build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy site"**

### 5.3 Add Environment Variables to Netlify
1. Go to **Site settings** → **Environment variables**
2. Add: `VITE_API_URL` = `https://your-railway-app.railway.app`
   (Replace with your actual Railway URL)

## Step 6: Connect Frontend to Backend

### 6.1 Get Your Railway URL
1. In Railway dashboard, your URL will be something like:
   `https://asira-ai-backend-production.railway.app`

### 6.2 Update Netlify Environment
1. In Netlify dashboard → **Site settings** → **Environment variables**
2. Set `VITE_API_URL` to your Railway URL
3. **Redeploy** your site

## Step 7: Test Everything! 🎉

1. **Backend health check**: Visit `https://your-railway-url.railway.app/api/health`
2. **Frontend**: Visit your Netlify URL
3. **Try signing up** - it should work now!

## Quick Troubleshooting

### If signup still doesn't work:
1. Check Railway logs (Deployments tab)
2. Make sure all environment variables are set
3. Check browser console for errors

### If you get CORS errors:
1. Your Railway backend should automatically handle CORS
2. Make sure your Netlify URL is in the CORS origins

## Your URLs Will Be:
- **Backend**: `https://your-app.railway.app`
- **Frontend**: `https://your-site.netlify.app`

## Need Help?
Just tell me which step you're stuck on and I'll help you through it! 

The whole process takes about 30 minutes total. You've got this! 🚀