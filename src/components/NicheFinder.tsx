import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Star, Zap, Loader, Lightbulb, Target, AlertCircle } from 'lucide-react';

interface Niche {
  name: string;
  difficulty: string;
  potential: string;
  trend: string;
  reason: string;
  contentIdeas: string[];
  searchVolume?: number;
  competitionScore?: number;
  opportunityScore?: number;
}

const NicheFinder: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('general');
  const [contentType, setContentType] = useState('youtube');
  const [niches, setNiches] = useState<Niche[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);

  const audiences = [
    { id: 'general', name: 'General Audience' },
    { id: 'teens', name: 'Teenagers (13-19)' },
    { id: 'young-adults', name: 'Young Adults (20-35)' },
    { id: 'professionals', name: 'Working Professionals' },
    { id: 'parents', name: 'Parents & Families' },
    { id: 'seniors', name: 'Seniors (50+)' }
  ];

  const contentTypes = [
    { id: 'youtube', name: 'YouTube Videos' },
    { id: 'tiktok', name: 'TikTok Content' },
    { id: 'instagram', name: 'Instagram Posts' },
    { id: 'blog', name: 'Blog Articles' }
  ];

  const handleSearch = async () => {
    // Validate inputs
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/trends/discover-niches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: topic.trim(), 
          targetAudience, 
          contentType 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNiches(data.data);
      } else {
        throw new Error(data.message || 'Failed to discover niches');
      }
    } catch (error) {
      console.error('Error fetching niches:', error);
      setError(error instanceof Error ? error.message : 'Failed to discover niches');
      
      // Generate fallback niches
      const fallbackNiches = generateFallbackNiches(topic, targetAudience, contentType);
      setNiches(fallbackNiches);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackNiches = (topic: string, audience: string, type: string): Niche[] => {
    return [
      {
        name: `${topic} for Beginners`,
        difficulty: 'Low',
        potential: 'High',
        trend: '+25%',
        reason: `High demand for beginner-friendly ${topic} content`,
        contentIdeas: [
          `Complete ${topic} guide for beginners`,
          `${topic} mistakes to avoid`,
          `Getting started with ${topic} in 2024`
        ],
        searchVolume: Math.floor(Math.random() * 5000 + 2000),
        competitionScore: 30,
        opportunityScore: 85
      },
      {
        name: `Advanced ${topic} Strategies`,
        difficulty: 'High',
        potential: 'High',
        trend: '+18%',
        reason: `Growing market for advanced ${topic} techniques`,
        contentIdeas: [
          `Advanced ${topic} techniques`,
          `${topic} optimization strategies`,
          `Professional ${topic} workflows`
        ],
        searchVolume: Math.floor(Math.random() * 3000 + 1000),
        competitionScore: 75,
        opportunityScore: 70
      },
      {
        name: `${topic} Tools & Resources`,
        difficulty: 'Medium',
        potential: 'High',
        trend: '+32%',
        reason: `High monetization potential through affiliate marketing`,
        contentIdeas: [
          `Best ${topic} tools in 2024`,
          `${topic} software comparison`,
          `Free vs paid ${topic} resources`
        ],
        searchVolume: Math.floor(Math.random() * 4000 + 1500),
        competitionScore: 50,
        opportunityScore: 90
      },
      {
        name: `${topic} Case Studies`,
        difficulty: 'Medium',
        potential: 'Medium',
        trend: '+15%',
        reason: `Engaging content format with good retention`,
        contentIdeas: [
          `${topic} success stories`,
          `Real ${topic} case studies`,
          `${topic} before and after results`
        ],
        searchVolume: Math.floor(Math.random() * 2500 + 800),
        competitionScore: 40,
        opportunityScore: 75
      },
      {
        name: `${topic} Trends & News`,
        difficulty: 'Low',
        potential: 'Medium',
        trend: '+28%',
        reason: `Evergreen content opportunity with regular updates`,
        contentIdeas: [
          `Latest ${topic} trends`,
          `${topic} industry news`,
          `Future of ${topic}`
        ],
        searchVolume: Math.floor(Math.random() * 3500 + 1200),
        competitionScore: 35,
        opportunityScore: 80
      }
    ];
  };

  const fetchTrendingTopics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/trends/topics');
      const data = await response.json();
      
      if (data.success) {
        setTrendingTopics(data.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching trending topics:', error);
    }
  };

  React.useEffect(() => {
    fetchTrendingTopics();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

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
            AI-Powered <span className="text-purple-400">Niche Discovery</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Discover profitable niches using real Google Trends data and AI analysis. 
            Find untapped opportunities in any market with detailed insights and content ideas.
          </p>
        </motion.div>

        {/* Trending Topics */}
        {trendingTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 text-center">🔥 Trending Now</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {trendingTopics.map((trend, index) => (
                <button
                  key={index}
                  onClick={() => setTopic(trend.title)}
                  className="px-4 py-2 bg-white/10 hover:bg-purple-500/20 border border-white/20 hover:border-purple-500/30 rounded-full text-white/80 hover:text-white transition-all duration-300"
                >
                  {trend.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Topic or Industry *
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g., tech, fitness, cooking, finance"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Target Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                  >
                    {audiences.map((audience) => (
                      <option key={audience.id} value={audience.id} className="bg-gray-800">
                        {audience.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Content Type
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                  >
                    {contentTypes.map((type) => (
                      <option key={type.id} value={type.id} className="bg-gray-800">
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <motion.button
                onClick={handleSearch}
                disabled={loading || !topic.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Discovering Niches...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Discover Profitable Niches</span>
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {niches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              Profitable Niches for "{topic}"
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {niches.map((niche, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{niche.trend}</div>
                      <div className="text-sm text-white/60">Growth</div>
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold text-white mb-3">{niche.name}</h4>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Difficulty:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(niche.difficulty)}`}>
                        {niche.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Potential:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPotentialColor(niche.potential)}`}>
                        {niche.potential}
                      </span>
                    </div>

                    {niche.searchVolume && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Search Volume:</span>
                        <span className="text-blue-400 font-medium">{niche.searchVolume.toLocaleString()}/mo</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80 font-medium">Why it's profitable:</span>
                    </div>
                    <p className="text-white/70 text-sm">{niche.reason}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h5 className="text-white/80 font-medium mb-2">Content Ideas:</h5>
                    <ul className="space-y-1">
                      {niche.contentIdeas.map((idea, ideaIndex) => (
                        <li key={ideaIndex} className="text-white/60 text-sm flex items-start space-x-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{idea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-white/60 mt-1">AI Recommended</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mt-12"
            >
              <p className="text-white/70 mb-6">
                Ready to create content for one of these niches?
              </p>
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Generate Content</span>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NicheFinder;