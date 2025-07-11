import React from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Hash, FileText, Palette, Mic, Download, ExternalLink, Users } from 'lucide-react';

interface ToolsProps {
  setActiveSection: (section: string) => void;
}

const Tools: React.FC<ToolsProps> = ({ setActiveSection }) => {
  const tools = [
    {
      id: 'thumbnail',
      icon: Image,
      title: 'Thumbnail Generator',
      description: 'Create eye-catching YouTube thumbnails with AI-powered design',
      color: 'from-red-500 to-pink-500',
      features: ['Custom text overlay', 'Multiple styles', 'HD export', 'Instant download']
    },
    {
      id: 'video',
      icon: Video,
      title: 'Video Generator',
      description: 'Transform scripts into engaging videos with AI visuals',
      color: 'from-blue-500 to-cyan-500',
      features: ['AI voiceover', 'Auto animations', 'Multiple formats', 'Professional quality']
    },
    {
      id: 'crossplatform',
      icon: Hash,
      title: 'Cross-Platform Optimizer',
      description: 'Adapt content for YouTube, TikTok, and Instagram',
      color: 'from-green-500 to-teal-500',
      features: ['Platform-specific', 'Hashtag optimization', 'Best posting times', 'Engagement tips']
    },
    {
      id: 'content',
      icon: FileText,
      title: 'AI Content Generator',
      description: 'Generate scripts, titles, and descriptions using AI',
      color: 'from-purple-500 to-indigo-500',
      features: ['Script generation', 'SEO titles', 'Hashtag suggestions', 'Multi-platform']
    }
  ];

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
            Creator <span className="text-purple-400">Tools</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Professional-grade tools to create, optimize, and publish your content across all platforms.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveSection(tool.id)}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {tool.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-semibold">Free Forever</span>
                    <div className="flex items-center space-x-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                      <span>Try Now</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Actions</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <motion.button
                onClick={() => setActiveSection('content')}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-purple-500/30 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium">Generate Script</div>
              </motion.button>

              <motion.button
                onClick={() => setActiveSection('thumbnail')}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-purple-500/30 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium">Create Thumbnail</div>
              </motion.button>

              <motion.button
                onClick={() => setActiveSection('niche')}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-purple-500/30 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Hash className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium">Find Niches</div>
              </motion.button>

              <motion.button
                onClick={() => setActiveSection('analytics')}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-purple-500/30 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Video className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-white font-medium">Analyze Channel</div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Tools;