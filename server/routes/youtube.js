import express from 'express';
import { google } from 'googleapis';
import { authenticateToken } from './auth.js';

const router = express.Router();
const youtube = google.youtube('v3');

// Mock users database (should match auth.js)
const users = new Map();

// OAuth2 client setup for YouTube
const youtubeOAuth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3001/api/youtube/callback'
);

// Generate YouTube OAuth URL
router.get('/auth', authenticateToken, (req, res) => {
  try {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtubepartner'
    ];

    const url = youtubeOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: req.user.userId // Pass user ID in state
    });

    res.json({ 
      success: true, 
      authUrl: url 
    });
  } catch (error) {
    console.error('YouTube OAuth URL Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate YouTube OAuth URL',
      error: error.message
    });
  }
});

// YouTube OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code, state: userId } = req.query;
    
    if (!code) {
      return res.redirect('http://localhost:5173?youtube=error&message=No authorization code');
    }

    // Exchange code for tokens
    const { tokens } = await youtubeOAuth2Client.getAccessToken(code);
    youtubeOAuth2Client.setCredentials(tokens);

    // Get channel information
    const channelResponse = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings'],
      mine: true,
      auth: youtubeOAuth2Client
    });

    if (!channelResponse.data.items?.length) {
      return res.redirect('http://localhost:5173?youtube=error&message=No YouTube channel found');
    }

    const channel = channelResponse.data.items[0];
    
    // Store YouTube tokens and channel info for user
    const user = Array.from(users.values()).find(u => u.id === userId);
    if (user) {
      user.youtubeTokens = tokens;
      user.youtubeChannels = [{
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails?.medium?.url,
        subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
        videoCount: parseInt(channel.statistics.videoCount) || 0,
        viewCount: parseInt(channel.statistics.viewCount) || 0,
        connectedAt: new Date().toISOString()
      }];
    }

    res.redirect('http://localhost:5173?youtube=success');

  } catch (error) {
    console.error('YouTube OAuth Callback Error:', error);
    res.redirect('http://localhost:5173?youtube=error&message=Authentication failed');
  }
});

// Get user's YouTube channel
router.get('/channel', authenticateToken, async (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.user.userId);
    
    if (!user || !user.youtubeChannels?.length) {
      return res.status(404).json({
        success: false,
        message: 'No YouTube channel connected'
      });
    }

    res.json({
      success: true,
      data: user.youtubeChannels[0]
    });

  } catch (error) {
    console.error('Get YouTube Channel Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get YouTube channel',
      error: error.message
    });
  }
});

// Disconnect YouTube channel
router.post('/disconnect', authenticateToken, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.user.userId);
    
    if (user) {
      user.youtubeTokens = null;
      user.youtubeChannels = [];
    }

    res.json({
      success: true,
      message: 'YouTube channel disconnected successfully'
    });

  } catch (error) {
    console.error('Disconnect YouTube Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect YouTube channel',
      error: error.message
    });
  }
});

// Helper function to check if error is quota-related
const isQuotaError = (error) => {
  if (!error) return false;
  
  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code;
  
  // Check for quota-related error indicators
  return (
    errorCode === 403 ||
    errorMessage.includes('quota') ||
    errorMessage.includes('exceeded') ||
    errorMessage.includes('limit') ||
    (error.response?.status === 403 && 
     error.response?.data?.error?.message?.toLowerCase().includes('quota'))
  );
};

// Search channels (public API)
router.get('/search', async (req, res) => {
  try {
    const { q, maxResults = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const response = await youtube.search.list({
      part: ['snippet'],
      q: q,
      type: 'channel',
      maxResults: parseInt(maxResults),
      key: process.env.YOUTUBE_API_KEY
    });

    const channels = response.data.items.map(item => ({
      id: item.id.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url,
      publishedAt: item.snippet.publishedAt
    }));

    res.json({
      success: true,
      data: channels
    });

  } catch (error) {
    console.error('YouTube Search Error:', error);
    
    // Check if this is a quota error
    if (isQuotaError(error)) {
      return res.status(429).json({
        success: false,
        message: 'YouTube API quota exceeded. The daily limit for API requests has been reached. Please try again tomorrow or check your Google Cloud Console to increase your quota limits.',
        errorType: 'quota_exceeded',
        error: 'API quota limit reached'
      });
    }
    
    // Check for other specific API errors
    if (error.code === 400) {
      return res.status(400).json({
        success: false,
        message: 'Invalid search request. Please check your search query and try again.',
        errorType: 'bad_request',
        error: error.message
      });
    }
    
    if (error.code === 401) {
      return res.status(401).json({
        success: false,
        message: 'YouTube API authentication failed. Please check your API key configuration.',
        errorType: 'auth_error',
        error: 'Invalid API credentials'
      });
    }
    
    // Generic error fallback
    res.status(500).json({
      success: false,
      message: 'Failed to search YouTube channels. Please try again later.',
      errorType: 'api_error',
      error: error.message || 'Unknown error occurred'
    });
  }
});

export default router;