# 🚀 Asira AI - From Idea to Income, Powered by AI

> **Hackathon Demo Version** - AI-powered content creation platform for creators worldwide

## 🎯 What is Asira AI?

Asira AI is a comprehensive content creation platform that helps creators generate viral content, discover profitable niches, and grow their audience using advanced AI technology.

### ✨ Key Features

- 🤖 **AI Content Generator** - Create scripts, titles, descriptions using Google Gemini
- 🎯 **Niche Discovery** - Find profitable niches using Google Trends data
- 📊 **YouTube Analytics** - Real channel analytics and growth recommendations
- 🎨 **Thumbnail Generator** - Create eye-catching thumbnails with AI
- 🎬 **Video Generator** - Transform scripts into engaging videos
- 🌐 **Cross-Platform Optimizer** - Optimize content for YouTube, TikTok, Instagram
- 🤝 **Creator Marketplace** - Connect creators with brands globally
- 📚 **Boost Academy** - Learn from expert creators

## 🏆 Hackathon Demo

This is a demo version built for the Bolt AI Hackathon. All features are unlocked and free to use!

**Live Demo:** https://heroic-daifuku-201965.netlify.app/

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for analytics visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Google Gemini AI** for content generation
- **YouTube Data API** for real analytics
- **Google Trends API** for niche discovery
- **Real-time data processing**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Cloud Console account (for API keys)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/asira-ai-platform.git
cd asira-ai-platform
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Set Up Environment Variables
```bash
# Copy example environment file
cp server/.env.example server/.env

# Edit server/.env with your API keys
# Get API keys from:
# - Gemini AI: https://makersuite.google.com/app/apikey
# - YouTube API: https://console.developers.google.com/
```

### 4. Run the Application
```bash
# Start both frontend and backend
npm run dev

# Or run separately:
# Frontend: npm run client
# Backend: npm run server
```

## 🔑 API Keys Setup

### Google Gemini AI (Required)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `server/.env`: `GEMINI_API_KEY=your_key_here`

### YouTube Data API (Required)
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create credentials → API Key
5. Add to `server/.env`: `YOUTUBE_API_KEY=your_key_here`

### Google OAuth (Optional)
1. In Google Cloud Console → Credentials
2. Create OAuth 2.0 Client ID
3. Add your domain to authorized origins
4. Add client ID and secret to `server/.env`

## 🌐 Deployment

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set root directory to `server`
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variable: `VITE_API_URL=your_railway_backend_url`

## 📁 Project Structure

```
asira-ai-platform/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── config/            # API configuration
│   └── main.tsx           # App entry point
├── server/                # Backend Node.js app
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## 🎯 Features Overview

### 🤖 AI Content Generation
- **Google Gemini Integration** - Advanced AI content creation
- **Multi-platform optimization** - YouTube, TikTok, Instagram
- **SEO optimization** - Trending hashtags and keywords
- **Real-time generation** - Instant content creation

### 📊 Analytics & Insights
- **Real YouTube API** - Live channel data
- **Performance tracking** - Views, engagement, growth
- **AI recommendations** - Data-driven growth strategies
- **Trend analysis** - Market opportunity identification

### 🎨 Creative Tools
- **Thumbnail generator** - AI-powered design concepts
- **Video creation** - Script to video transformation
- **Cross-platform optimizer** - Multi-channel content strategy
- **Brand collaboration** - Creator-brand matching

## 🌍 Global Creator Economy

Asira AI supports creators worldwide with:
- **Multi-language support** - Content in various languages
- **Global trend analysis** - Worldwide market insights
- **International creator marketplace** - Global collaboration
- **Localized content strategies** - Region-specific optimization

## 🤝 Contributing

This is a hackathon demo project. After the competition, we plan to:
- Add user authentication and profiles
- Implement advanced AI features
- Expand creator marketplace
- Add more platform integrations

## 📄 License

This project is built for the Bolt AI Hackathon. All rights reserved.

## 🏆 Hackathon Submission

**Event:** Bolt AI Hackathon 2024
**Category:** AI-Powered Creator Tools
**Demo:** https://heroic-daifuku-201965.netlify.app/

### Problem Solved
Content creators struggle with:
- Time-consuming content creation
- Finding profitable niches
- Understanding analytics
- Cross-platform optimization

### Our Solution
AI-powered platform that:
- Generates content in minutes
- Discovers trending opportunities
- Provides actionable insights
- Optimizes for all platforms

---

Built with ❤️ for creators worldwide 🌍