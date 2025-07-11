# 🚀 Complete Deployment Guide: GitHub + Backend + Frontend

## Step 1: Upload Your Project to GitHub (5 minutes)

### Option A: Using GitHub Website (Easiest)
1. **Download your project**
   - In Bolt, click the download button to get your project as a ZIP file
   - Extract the ZIP file on your computer

2. **Create GitHub Repository**
   - Go to https://github.com
   - Click the green "New" button
   - Repository name: `asira-ai-platform`
   - Make it **Public** (required for free hosting)
   - ✅ Check "Add a README file"
   - Click "Create repository"

3. **Upload your files**
   - In your new repository, click "uploading an existing file"
   - Drag and drop ALL your project files (including the `server` folder)
   - Write commit message: "Initial commit - Asira AI Platform"
   - Click "Commit changes"

### Option B: Using Git Commands (If you have Git installed)
```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - Asira AI Platform"
git branch -M main
git remote add origin https://github.com/yourusername/asira-ai-platform.git
git push -u origin main
```

## Step 2: Deploy Backend to Railway (Free & Easy)

### 2.1 Sign Up for Railway
1. Go to https://railway.app
2. Click "Login"
3. Choose "Login with GitHub"
4. Authorize Railway to access your GitHub

### 2.2 Deploy Your Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `asira-ai-platform` repository
4. Railway will automatically detect it's a Node.js project

### 2.3 Configure Railway for Backend
1. **Set Root Directory**
   - In Railway dashboard, go to "Settings"
   - Find "Root Directory"
   - Set it to: `server`
   - This tells Railway your backend code is in the server folder

2. **Add Environment Variables**
   - Go to "Variables" tab in Railway
   - Add these variables:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your_super_long_random_secret_key_12345678901234567890
GEMINI_API_KEY=your_gemini_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2.4 Get Your API Keys (Required)

**Google Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and add to Railway: `GEMINI_API_KEY=your_key_here`

**YouTube API Key:**
1. Go to https://console.developers.google.com/
2. Create new project or select existing
3. Enable "YouTube Data API v3"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the key and add to Railway: `YOUTUBE_API_KEY=your_key_here`

**Google OAuth (for login):**
1. In Google Console, go to "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Set Application type to "Web application"
4. Add your Railway URL to authorized origins (you'll get this after deployment)
5. Copy Client ID and Secret

## Step 3: Update Your Netlify Frontend

### 3.1 Get Your Railway Backend URL
After Railway deploys your backend, you'll get a URL like:
`https://asira-ai-platform-production.railway.app`

### 3.2 Update Frontend Environment Variables
1. **In Netlify Dashboard:**
   - Go to your site settings
   - Click "Environment variables"
   - Add: `VITE_API_URL` = `https://your-railway-url.railway.app`

2. **Update Your Code (if needed):**
   - Make sure all API calls use `import.meta.env.VITE_API_URL`
   - Example: `fetch(`${import.meta.env.VITE_API_URL}/api/health`)`

### 3.3 Redeploy Frontend
1. In Netlify, go to "Deploys"
2. Click "Trigger deploy" → "Deploy site"
3. Your frontend will rebuild with the new backend URL

## Step 4: Connect Everything Together

### 4.1 Update CORS in Backend
Your backend should already handle CORS, but make sure your Railway backend allows your Netlify domain.

### 4.2 Update OAuth Redirect URLs
1. In Google Console → Credentials → OAuth 2.0 Client IDs
2. Add these to "Authorized redirect URIs":
   - `https://your-railway-url.railway.app/api/auth/google/callback`
3. Add these to "Authorized JavaScript origins":
   - `https://your-netlify-url.netlify.app`
   - `https://your-railway-url.railway.app`

## Step 5: Test Everything

### 5.1 Test Backend
Visit: `https://your-railway-url.railway.app/api/health`
You should see: `{"status":"OK","timestamp":"...","server":"CreatorBoost AI v1.0"}`

### 5.2 Test Frontend
1. Visit your Netlify URL
2. Try signing up/logging in
3. Test content generation
4. Check analytics features

## Step 6: Get Your Custom Domain (Entri)

### 6.1 Get Domain from Entri
1. Go to https://entri.com
2. Search for available domains
3. Register your domain (usually free for hackathons)

### 6.2 Connect Domain to Netlify
1. In Netlify dashboard → "Domain settings"
2. Click "Add custom domain"
3. Enter your Entri domain
4. Follow Netlify's DNS setup instructions
5. Update your domain's DNS settings in Entri dashboard

### 6.3 Update OAuth URLs with Custom Domain
1. In Google Console, update OAuth settings
2. Replace Netlify URL with your custom domain
3. Update Railway environment variables if needed

## 🎯 Final URLs Structure

After everything is set up, you'll have:
- **Frontend**: `https://yourdomain.com` (custom domain)
- **Backend**: `https://your-app.railway.app`
- **GitHub**: `https://github.com/yourusername/asira-ai-platform`

## 🔧 Troubleshooting

### Backend Won't Start
- Check Railway logs in "Deployments" tab
- Verify all environment variables are set
- Make sure `server/package.json` exists

### Frontend Can't Connect to Backend
- Check CORS settings in backend
- Verify `VITE_API_URL` environment variable in Netlify
- Test backend URL directly in browser

### Authentication Not Working
- Check Google OAuth settings
- Verify redirect URLs include both domains
- Check JWT_SECRET is set in Railway

### API Errors
- Verify all API keys are correct
- Check API quotas in Google Console
- Test individual endpoints

## 🚀 Quick Commands Summary

```bash
# Test your backend
curl https://your-railway-url.railway.app/api/health

# Test your frontend
curl https://your-netlify-url.netlify.app

# Check if APIs are working
curl https://your-railway-url.railway.app/api/content/test
```

## 📞 Need Help?

If you get stuck:
1. Check Railway deployment logs
2. Check Netlify build logs
3. Test each component individually
4. Verify all environment variables are set correctly

Your complete platform will be live at your custom domain! 🎉