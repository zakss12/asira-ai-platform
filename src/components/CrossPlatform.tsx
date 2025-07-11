import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Facebook, Music, Clock, Hash, Copy, Check, Loader, AlertCircle } from 'lucide-react';

interface PlatformContent {
  platform: string;
  titles: string[];
  hashtags: string[];
  script: string;
  bestTime: string;
  tips: string[];
}

const CrossPlatform: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [niche, setNiche] = useState('');
  const [content, setContent] = useState<PlatformContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600' },
    { id: 'facebook', name: 'Facebook Reels', icon: Facebook, color: 'from-blue-500 to-blue-600' },
    { id: 'tiktok', name: 'TikTok', icon: Music, color: 'from-pink-500 to-purple-600' }
  ];

  const generateContent = async () => {
    // Validate inputs
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    if (!niche.trim()) {
      setError('Please enter a niche');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // Generate content for each platform
      const platformContents: PlatformContent[] = [];
      
      for (const platform of platforms) {
        const response = await fetch('http://localhost:3001/api/content/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            topic: topic.trim(), 
            niche: niche.trim(),
            contentType: platform.id,
            targetAudience: 'general',
            tone: 'engaging'
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          platformContents.push({
            platform: platform.id,
            titles: data.data.titles || [],
            hashtags: data.data.hashtags || [],
            script: data.data.script || '',
            bestTime: getBestPostingTime(platform.id),
            tips: getPlatformTips(platform.id)
          });
        } else {
          throw new Error(data.message || `Failed to generate content for ${platform.name}`);
        }
      }
      
      setContent(platformContents);
    } catch (error) {
      console.error('Error generating cross-platform content:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate content');
      
      // Generate fallback content
      const fallbackContent = generateFallbackContent(topic, niche);
      setContent(fallbackContent);
    } finally {
      setLoading(false);
    }
  };

  const getBestPostingTime = (platform: string) => {
    const times = {
      youtube: '2-4 PM EST',
      facebook: '1-3 PM EST',
      tiktok: '6-10 PM EST'
    };
    return times[platform as keyof typeof times] || '12-2 PM EST';
  };

  const getPlatformTips = (platform: string) => {
    const tips = {
      youtube: [
        'Use compelling thumbnails with bright colors',
        'Include timestamps in descriptions',
        'Engage with comments in first hour',
        'Create playlists for better discoverability'
      ],
      facebook: [
        'Keep videos under 60 seconds for better reach',
        'Add captions for silent viewing',
        'Use trending audio and effects',
        'Post consistently during peak hours'
      ],
      tiktok: [
        'Hook viewers in first 3 seconds',
        'Use trending sounds and hashtags',
        'Keep it vertical and high-energy',
        'Participate in trending challenges'
      ]
    };
    return tips[platform as keyof typeof tips] || [];
  };

  const generateFallbackContent = (topic: string, niche: string): PlatformContent[] => {
    return platforms.map(platform => ({
      platform: platform.id,
      titles: [
        `${topic} Tips for ${niche} (${platform.name})`,
        `Master ${topic} in ${niche} - ${platform.name} Guide`,
        `${niche} ${topic} Secrets Revealed`
      ],
      hashtags: [
        `#${topic.replace(/\s+/g, '')}`,
        `#${niche.replace(/\s+/g, '')}`,
        `#${platform.id}`,
        '#viral',
        '#trending',
        '#tips'
      ],
      script: `Hey everyone! Today we're talking about ${topic} in the ${niche} space. This is perfect for ${platform.name} because [platform-specific reason]. Let me share the top strategies that actually work...`,
      bestTime: getBestPostingTime(platform.id),
      tips: getPlatformTips(platform.id)
    }));
  };

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
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
            Cross-Platform <span className="text-purple-400">Content Optimizer</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Generate platform-specific content optimized for YouTube, Facebook Reels, 
            and TikTok with tailored scripts, hashtags, and posting strategies.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
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
                  Topic Category *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., tech, fashion, fitness, cooking"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Specific Niche *
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., AI Productivity Tools, Sustainable Fashion"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              <motion.button
                onClick={generateContent}
                disabled={loading || !topic.trim() || !niche.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating Platform Content...</span>
                  </span>
                ) : (
                  'Generate Cross-Platform Content'
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {content.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {content.map((platformContent, index) => {
                const platform = platforms.find(p => p.id === platformContent.platform);
                if (!platform) return null;

                const Icon = platform.icon;

                return (
                  <motion.div
                    key={platformContent.platform}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
                  >
                    {/* Platform Header */}
                    <div className={`bg-gradient-to-r ${platform.color} p-6`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                          <div className="flex items-center space-x-2 text-white/80">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Best time: {platformContent.bestTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Titles */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white">Optimized Titles</h4>
                          <button
                            onClick={() => copyToClipboard(platformContent.titles.join('\n'), `${platformContent.platform}-titles`)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                          >
                            {copiedItem === `${platformContent.platform}-titles` ? 
                              <Check className="w-4 h-4 text-green-400" /> : 
                              <Copy className="w-4 h-4 text-white/70" />
                            }
                          </button>
                        </div>
                        <div className="space-y-2">
                          {platformContent.titles.map((title, titleIndex) => (
                            <div key={titleIndex} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <p className="text-white/90 text-sm">{title}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Script */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white">Platform Script</h4>
                          <button
                            onClick={() => copyToClipboard(platformContent.script, `${platformContent.platform}-script`)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                          >
                            {copiedItem === `${platformContent.platform}-script` ? 
                              <Check className="w-4 h-4 text-green-400" /> : 
                              <Copy className="w-4 h-4 text-white/70" />
                            }
                          </button>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/80 text-sm leading-relaxed">{platformContent.script}</p>
                        </div>
                      </div>

                      {/* Hashtags */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-white">Hashtags</h4>
                          <button
                            onClick={() => copyToClipboard(platformContent.hashtags.join(' '), `${platformContent.platform}-hashtags`)}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                          >
                            {copiedItem === `${platformContent.platform}-hashtags` ? 
                              <Check className="w-4 h-4 text-green-400" /> : 
                              <Copy className="w-4 h-4 text-white/70" />
                            }
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {platformContent.hashtags.map((hashtag, hashIndex) => (
                            <span key={hashIndex} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Platform Tips */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Platform Tips</h4>
                        <div className="space-y-2">
                          {platformContent.tips.map((tip, tipIndex) => (
                            <div key={tipIndex} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-white/70 text-sm">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Comparison Table */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Platform Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-white/80 py-3 px-4">Platform</th>
                      <th className="text-left text-white/80 py-3 px-4">Best Posting Time</th>
                      <th className="text-left text-white/80 py-3 px-4">Content Length</th>
                      <th className="text-left text-white/80 py-3 px-4">Key Focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.map((platformContent, index) => {
                      const platform = platforms.find(p => p.id === platformContent.platform);
                      if (!platform) return null;

                      const contentSpecs = {
                        youtube: { length: '8-12 minutes', focus: 'Educational & Detailed' },
                        facebook: { length: '15-60 seconds', focus: 'Engaging & Social' },
                        tiktok: { length: '15-30 seconds', focus: 'Trendy & Viral' }
                      };

                      return (
                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center`}>
                                <platform.icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white font-medium">{platform.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white/80">{platformContent.bestTime}</td>
                          <td className="py-4 px-4 text-white/80">{contentSpecs[platformContent.platform as keyof typeof contentSpecs]?.length}</td>
                          <td className="py-4 px-4 text-white/80">{contentSpecs[platformContent.platform as keyof typeof contentSpecs]?.focus}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CrossPlatform;