import express from 'express';
import { google } from 'googleapis';

const router = express.Router();
const youtube = google.youtube('v3');
const youtubeAnalytics = google.youtubeAnalytics('v2');

// Get comprehensive channel analytics
router.get('/channel/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const { startDate, endDate } = req.query;

    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get channel basic info
    const channelResponse = await youtube.channels.list({
      part: ['statistics', 'snippet', 'brandingSettings'],
      id: [channelId],
      key: process.env.YOUTUBE_API_KEY
    });

    if (!channelResponse.data.items?.length) {
      return res.status(404).json({
        success: false,
        message: 'Channel not found'
      });
    }

    const channel = channelResponse.data.items[0];

    // Get analytics data (requires OAuth - for demo, we'll simulate)
    const analyticsData = await getChannelAnalytics(channelId, start, end);

    // Get recent videos
    const videosResponse = await youtube.search.list({
      part: ['snippet'],
      channelId: channelId,
      order: 'date',
      maxResults: 20,
      type: 'video',
      key: process.env.YOUTUBE_API_KEY
    });

    // Get video statistics
    const videoIds = videosResponse.data.items.map(item => item.id.videoId);
    const videoStatsResponse = await youtube.videos.list({
      part: ['statistics', 'snippet', 'contentDetails'],
      id: videoIds,
      key: process.env.YOUTUBE_API_KEY
    });

    // Process and format data
    const analytics = {
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        publishedAt: channel.snippet.publishedAt,
        thumbnails: channel.snippet.thumbnails,
        statistics: channel.statistics
      },
      overview: {
        totalViews: parseInt(channel.statistics.viewCount) || 0,
        subscribers: parseInt(channel.statistics.subscriberCount) || 0,
        totalVideos: parseInt(channel.statistics.videoCount) || 0,
        avgViewsPerVideo: Math.round((parseInt(channel.statistics.viewCount) || 0) / (parseInt(channel.statistics.videoCount) || 1)),
        estimatedRevenue: calculateEstimatedRevenue(channel.statistics)
      },
      recentVideos: videoStatsResponse.data.items.map(video => ({
        id: video.id,
        title: video.snippet.title,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        views: parseInt(video.statistics.viewCount) || 0,
        likes: parseInt(video.statistics.likeCount) || 0,
        comments: parseInt(video.statistics.commentCount) || 0,
        thumbnail: video.snippet.thumbnails.medium.url,
        engagementRate: calculateEngagementRate(video.statistics)
      })),
      trends: analyticsData.trends,
      demographics: analyticsData.demographics,
      recommendations: generateDetailedRecommendations(channel, videoStatsResponse.data.items)
    };

    res.json({
      success: true,
      data: analytics,
      dateRange: { start, end },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

// Get video performance analytics
router.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    const videoResponse = await youtube.videos.list({
      part: ['statistics', 'snippet', 'contentDetails'],
      id: [videoId],
      key: process.env.YOUTUBE_API_KEY
    });

    if (!videoResponse.data.items?.length) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const video = videoResponse.data.items[0];
    const stats = video.statistics;

    // Simulate detailed analytics (in production, use YouTube Analytics API)
    const analytics = {
      video: {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        thumbnail: video.snippet.thumbnails.high.url
      },
      performance: {
        views: parseInt(stats.viewCount) || 0,
        likes: parseInt(stats.likeCount) || 0,
        dislikes: parseInt(stats.dislikeCount) || 0,
        comments: parseInt(stats.commentCount) || 0,
        shares: Math.floor((parseInt(stats.viewCount) || 0) * 0.02), // Estimated
        engagementRate: calculateEngagementRate(stats),
        clickThroughRate: (Math.random() * 8 + 2).toFixed(2) + '%',
        averageViewDuration: generateAverageViewDuration(video.contentDetails.duration)
      },
      audienceRetention: generateAudienceRetention(),
      trafficSources: generateTrafficSources(),
      demographics: generateDemographics(),
      recommendations: generateVideoRecommendations(video, stats)
    };

    res.json({
      success: true,
      data: analytics,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Video Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video analytics',
      error: error.message
    });
  }
});

// Helper functions
async function getChannelAnalytics(channelId, startDate, endDate) {
  // In production, this would use YouTube Analytics API with OAuth
  // For now, we'll generate realistic mock data
  return {
    trends: generateTrendData(startDate, endDate),
    demographics: generateDemographics()
  };
}

function calculateEstimatedRevenue(statistics) {
  const views = parseInt(statistics.viewCount) || 0;
  const estimatedCPM = 2; // $2 per 1000 views (average)
  return Math.round((views / 1000) * estimatedCPM);
}

function calculateEngagementRate(statistics) {
  const views = parseInt(statistics.viewCount) || 0;
  const likes = parseInt(statistics.likeCount) || 0;
  const comments = parseInt(statistics.commentCount) || 0;
  
  if (views === 0) return 0;
  
  const engagementRate = ((likes + comments) / views) * 100;
  return Math.round(engagementRate * 100) / 100;
}

function generateTrendData(startDate, endDate) {
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const trends = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    trends.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 5000) + 1000,
      subscribers: Math.floor(Math.random() * 100) + 10,
      engagement: Math.floor(Math.random() * 10) + 5,
      revenue: Math.floor(Math.random() * 50) + 10
    });
  }
  
  return trends;
}

function generateDemographics() {
  return {
    ageGroups: [
      { range: '18-24', percentage: 25 },
      { range: '25-34', percentage: 35 },
      { range: '35-44', percentage: 20 },
      { range: '45-54', percentage: 15 },
      { range: '55+', percentage: 5 }
    ],
    gender: [
      { type: 'Male', percentage: 60 },
      { type: 'Female', percentage: 38 },
      { type: 'Other', percentage: 2 }
    ],
    topCountries: [
      { country: 'United States', percentage: 45 },
      { country: 'United Kingdom', percentage: 12 },
      { country: 'Canada', percentage: 8 },
      { country: 'Australia', percentage: 6 },
      { country: 'Germany', percentage: 5 }
    ]
  };
}

function generateAudienceRetention() {
  const retention = [];
  for (let i = 0; i <= 100; i += 5) {
    const retentionRate = Math.max(20, 100 - (i * 0.8) + (Math.random() * 20 - 10));
    retention.push({
      timePercentage: i,
      retentionRate: Math.round(retentionRate)
    });
  }
  return retention;
}

function generateTrafficSources() {
  return [
    { source: 'YouTube Search', percentage: 35 },
    { source: 'Suggested Videos', percentage: 25 },
    { source: 'Browse Features', percentage: 15 },
    { source: 'External', percentage: 10 },
    { source: 'Direct/Unknown', percentage: 8 },
    { source: 'Playlists', percentage: 7 }
  ];
}

function generateDetailedRecommendations(channel, videos) {
  const recommendations = [];
  
  const avgViews = videos.reduce((sum, video) => sum + (parseInt(video.statistics.viewCount) || 0), 0) / videos.length;
  const avgEngagement = videos.reduce((sum, video) => sum + calculateEngagementRate(video.statistics), 0) / videos.length;
  
  if (avgViews < 1000) {
    recommendations.push({
      type: 'growth',
      priority: 'high',
      title: 'Improve SEO Optimization',
      description: 'Your average views are below 1K. Focus on keyword research and optimize titles, descriptions, and tags.',
      actionItems: [
        'Use tools like TubeBuddy or VidIQ for keyword research',
        'Include target keywords in the first 125 characters of descriptions',
        'Create compelling thumbnails with high contrast and readable text'
      ]
    });
  }
  
  if (avgEngagement < 2) {
    recommendations.push({
      type: 'engagement',
      priority: 'medium',
      title: 'Boost Audience Engagement',
      description: 'Your engagement rate is below average. Encourage more interaction with your audience.',
      actionItems: [
        'Ask questions throughout your videos',
        'Respond to comments within the first hour',
        'Create community posts to maintain engagement between uploads'
      ]
    });
  }
  
  recommendations.push({
    type: 'content',
    priority: 'medium',
    title: 'Optimize Upload Schedule',
    description: 'Consistency is key for YouTube growth. Establish a regular upload schedule.',
    actionItems: [
      'Analyze your audience retention to find optimal posting times',
      'Aim for 2-3 videos per week minimum',
      'Use YouTube Shorts to increase visibility'
    ]
  });
  
  return recommendations;
}

function generateVideoRecommendations(video, stats) {
  const recommendations = [];
  const views = parseInt(stats.viewCount) || 0;
  const engagement = calculateEngagementRate(stats);
  
  if (views < 500) {
    recommendations.push('Consider promoting this video on social media platforms');
  }
  
  if (engagement < 2) {
    recommendations.push('Add more calls-to-action throughout the video');
  }
  
  recommendations.push('Create follow-up content based on popular comments');
  recommendations.push('Use this video\'s best-performing elements in future content');
  
  return recommendations;
}

function generateAverageViewDuration(duration) {
  // Parse ISO 8601 duration (PT4M13S) to seconds
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  // Average view duration is typically 40-60% of total duration
  const avgDurationSeconds = Math.floor(totalSeconds * (0.4 + Math.random() * 0.2));
  const avgMinutes = Math.floor(avgDurationSeconds / 60);
  const avgSeconds = avgDurationSeconds % 60;
  
  return `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`;
}

export default router;