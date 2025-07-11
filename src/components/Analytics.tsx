import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, ThumbsUp, Lightbulb, Loader, Clock, Target, DollarSign, Search, ExternalLink, AlertCircle, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface AnalyticsData {
  channel: {
    id: string;
    title: string;
    description: string;
    thumbnails: any;
  };
  overview: {
    totalViews: number;
    subscribers: number;
    totalVideos: number;
    avgViewsPerVideo: number;
    estimatedRevenue: number;
  };
  recentVideos: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    engagementRate: number;
    publishedAt: string;
    thumbnail: string;
  }>;
  trends: Array<{
    date: string;
    views: number;
    subscribers: number;
    engagement: number;
    revenue: number;
  }>;
  demographics: {
    ageGroups: Array<{ range: string; percentage: number }>;
    gender: Array<{ type: string; percentage: number }>;
    topCountries: Array<{ country: string; percentage: number }>;
  };
  recommendations: Array<{
    type: string;
    priority: string;
    title: string;
    description: string;
    actionItems: string[];
  }>;
}

const Analytics: React.FC = () => {
  const [channelQuery, setChannelQuery] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check server status on component mount
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      console.log('🔍 Checking server status...');
      const response = await fetch('http://localhost:3001/api/health');
      const data = await response.json();
      
      if (data.status === 'OK') {
        setServerStatus('online');
        console.log('✅ Server is online');
      } else {
        setServerStatus('offline');
        console.log('❌ Server responded but not healthy');
      }
    } catch (error) {
      setServerStatus('offline');
      console.error('❌ Server is offline:', error);
    }
  };

  const getErrorIcon = (errorType: string | null) => {
    switch (errorType) {
      case 'quota_exceeded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'server_offline':
        return <WifiOff className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getErrorStyles = (errorType: string | null) => {
    switch (errorType) {
      case 'quota_exceeded':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
      case 'server_offline':
        return 'bg-red-500/10 border-red-500/20 text-red-300';
      default:
        return 'bg-red-500/10 border-red-500/20 text-red-300';
    }
  };

  const searchChannels = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      setError(null);
      setErrorType(null);
      return;
    }

    if (serverStatus === 'offline') {
      setError('Server is offline. Please make sure the backend is running on port 3001.');
      setErrorType('server_offline');
      return;
    }

    try {
      console.log('🔍 Searching for channels:', query);
      const response = await fetch(`http://localhost:3001/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=5`);
      
      if (!response.ok) {
        // Handle HTTP error responses
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          setError(errorData.message || 'YouTube API quota exceeded. Please try again tomorrow.');
          setErrorType('quota_exceeded');
        } else if (response.status === 401) {
          setError('YouTube API authentication failed. Please check API configuration.');
          setErrorType('auth_error');
        } else {
          setError(errorData.message || `HTTP ${response.status}: Failed to search channels`);
          setErrorType('api_error');
        }
        
        setSearchResults([]);
        setShowSearch(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data || []);
        setShowSearch(true);
        setError(null);
        setErrorType(null);
        console.log('✅ Search results:', data.data);
      } else {
        // Handle API-level errors
        setError(data.message || 'Search failed');
        setErrorType(data.errorType || 'api_error');
        setSearchResults([]);
        setShowSearch(false);
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Cannot connect to server. Please make sure the backend is running.');
        setErrorType('network_error');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to search channels');
        setErrorType('network_error');
      }
      
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const analyzeChannel = async (channelId: string, channelTitle?: string) => {
    if (serverStatus === 'offline') {
      setError('Server is offline. Please make sure the backend is running on port 3001.');
      setErrorType('server_offline');
      return;
    }

    setLoading(true);
    setShowSearch(false);
    setError(null);
    setErrorType(null);
    
    try {
      console.log('📊 Analyzing channel:', channelId);
      const response = await fetch(`http://localhost:3001/api/analytics/channel/${channelId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to analyze channel`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
        setChannelQuery(channelTitle || channelId);
        console.log('✅ Analytics data received:', data.data);
      } else {
        setError(data.message || 'Failed to analyze channel');
        setErrorType(data.errorType || 'api_error');
      }
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Cannot connect to server. Please make sure the backend is running.');
        setErrorType('network_error');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to analyze channel');
        setErrorType('api_error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeClick = () => {
    if (!channelQuery.trim()) {
      setError('Please enter a channel name or ID');
      setErrorType('validation_error');
      return;
    }

    setError(null);
    setErrorType(null);

    // Check if it's a channel ID (starts with UC) or handle
    if (channelQuery.includes('UC') || channelQuery.startsWith('@')) {
      // Direct channel ID or handle
      analyzeChannel(channelQuery);
    } else {
      // Search for channel first
      searchChannels(channelQuery);
    }
  };

  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real YouTube <span className="text-purple-400">Analytics</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Connect to any YouTube channel and get comprehensive analytics, 
            performance insights, and AI-powered growth recommendations.
          </p>
          
          {/* Server Status Indicator */}
          <div className="flex items-center justify-center mt-4">
            {serverStatus === 'checking' && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Checking server status...</span>
              </div>
            )}
            {serverStatus === 'online' && (
              <div className="flex items-center space-x-2 text-green-400">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Server online • YouTube API ready</span>
              </div>
            )}
            {serverStatus === 'offline' && (
              <div className="flex items-center space-x-2 text-red-400">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">Server offline • Please start the backend</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12 relative"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {error && (
              <div className={`mb-4 p-4 border rounded-xl flex items-start space-x-3 ${getErrorStyles(errorType)}`}>
                {getErrorIcon(errorType)}
                <div className="flex-1">
                  <div className="font-medium mb-1">
                    {errorType === 'quota_exceeded' ? 'YouTube API Quota Exceeded' : 
                     errorType === 'server_offline' ? 'Server Offline' :
                     errorType === 'auth_error' ? 'Authentication Error' :
                     errorType === 'validation_error' ? 'Input Required' : 'Error'}
                  </div>
                  <div className="text-sm opacity-90">{error}</div>
                  {errorType === 'quota_exceeded' && (
                    <div className="mt-2 text-xs opacity-75">
                      💡 Tip: YouTube API has daily usage limits. Try again tomorrow or contact support to increase your quota.
                    </div>
                  )}
                  {errorType === 'server_offline' && (
                    <div className="mt-2 text-xs opacity-75">
                      💡 Tip: Make sure to run "npm run dev" to start both frontend and backend servers.
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={channelQuery}
                  onChange={(e) => {
                    setChannelQuery(e.target.value);
                    if (e.target.value.trim()) {
                      // Debounce search to avoid too many API calls
                      const timeoutId = setTimeout(() => {
                        searchChannels(e.target.value);
                      }, 500);
                      return () => clearTimeout(timeoutId);
                    } else {
                      setSearchResults([]);
                      setShowSearch(false);
                      setError(null);
                      setErrorType(null);
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeClick()}
                  placeholder="Search for YouTube channels or enter channel ID..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
                
                {/* Search Results Dropdown */}
                {showSearch && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-xl z-10 max-h-60 overflow-y-auto">
                    {searchResults.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => analyzeChannel(channel.id, channel.title)}
                        className="w-full p-4 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          {channel.thumbnail && (
                            <img 
                              src={channel.thumbnail} 
                              alt={channel.title}
                              className="w-12 h-12 rounded-full"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div>
                            <div className="text-white font-medium">{channel.title}</div>
                            <div className="text-white/60 text-sm line-clamp-1">{channel.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <motion.button
                onClick={handleAnalyzeClick}
                disabled={loading || !channelQuery.trim() || serverStatus === 'offline'}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  'Analyze Channel'
                )}
              </motion.button>
            </div>

            <div className="mt-4 text-white/60 text-sm">
              💡 Try searching: "MrBeast", "PewDiePie", or enter a channel ID like "UC-lHJZR3Gqxm24_Vd_AJ5Yw"
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto space-y-8"
          >
            {/* Channel Header */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-4">
                {analytics.channel.thumbnails?.medium?.url && (
                  <img 
                    src={analytics.channel.thumbnails.medium.url} 
                    alt={analytics.channel.title}
                    className="w-20 h-20 rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h3 className="text-2xl font-bold text-white">{analytics.channel.title}</h3>
                  <p className="text-white/70 mt-1 line-clamp-2">{analytics.channel.description}</p>
                  <a 
                    href={`https://youtube.com/channel/${analytics.channel.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 mt-2"
                  >
                    <span>View Channel</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-white mb-1">
                  {analytics.overview.totalViews.toLocaleString()}
                </div>
                <div className="text-white/60 text-xs">Total Views</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-white mb-1">
                  {analytics.overview.subscribers.toLocaleString()}
                </div>
                <div className="text-white/60 text-xs">Subscribers</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-white mb-1">
                  {analytics.overview.totalVideos.toLocaleString()}
                </div>
                <div className="text-white/60 text-xs">Total Videos</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-white mb-1">
                  {analytics.overview.avgViewsPerVideo.toLocaleString()}
                </div>
                <div className="text-white/60 text-xs">Avg Views/Video</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="text-xl font-bold text-white mb-1">
                  ${analytics.overview.estimatedRevenue.toLocaleString()}
                </div>
                <div className="text-white/60 text-xs">Est. Revenue</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Performance Trends */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Performance Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                      <XAxis dataKey="date" stroke="#ffffff60" fontSize={12} />
                      <YAxis stroke="#ffffff60" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="subscribers" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Demographics */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Audience Demographics</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.demographics.ageGroups}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                        label={({ range, percentage }) => `${range}: ${percentage}%`}
                      >
                        {analytics.demographics.ageGroups.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Videos Performance */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Videos Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/80 py-3 px-4">Video</th>
                      <th className="text-right text-white/80 py-3 px-4">Views</th>
                      <th className="text-right text-white/80 py-3 px-4">Likes</th>
                      <th className="text-right text-white/80 py-3 px-4">Comments</th>
                      <th className="text-right text-white/80 py-3 px-4">Engagement</th>
                      <th className="text-right text-white/80 py-3 px-4">Published</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentVideos.slice(0, 10).map((video) => (
                      <tr key={video.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-16 h-9 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div className="max-w-xs">
                              <div className="text-white font-medium line-clamp-2">{video.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right text-white/80">
                          {video.views.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right text-white/80">
                          {video.likes.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right text-white/80">
                          {video.comments.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-purple-400 font-semibold">{video.engagementRate}%</span>
                        </td>
                        <td className="py-4 px-4 text-right text-white/80">
                          {new Date(video.publishedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI Growth Recommendations</h3>
              </div>

              <div className="space-y-6">
                {analytics.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`p-6 rounded-xl border ${
                      recommendation.priority === 'high' 
                        ? 'bg-red-500/10 border-red-500/20' 
                        : recommendation.priority === 'medium'
                        ? 'bg-yellow-500/10 border-yellow-500/20'
                        : 'bg-blue-500/10 border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{recommendation.title}</h4>
                        <p className="text-white/80">{recommendation.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        recommendation.priority === 'high' 
                          ? 'bg-red-500/20 text-red-300' 
                          : recommendation.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {recommendation.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-white/90 font-medium">Action Items:</h5>
                      <ul className="space-y-1">
                        {recommendation.actionItems.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2 text-white/70">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Analytics;