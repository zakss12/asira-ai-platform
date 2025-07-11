import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Target, Play, ArrowRight, Eye, Star, Users, Building } from 'lucide-react';

interface HeroProps {
  setActiveSection: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ setActiveSection }) => {
  const handleViewDemo = () => {
    setActiveSection('content');
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Hackathon Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-6 py-2 mb-8"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium">🏆 Bolt AI Hackathon Demo - All Features Unlocked!</span>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-6 py-2 mb-8"
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium">AI-Powered Content Creation Platform</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Create Viral Content
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              In Minutes
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            🚀 Hackathon Demo: Generate scripts, thumbnails, and videos using AI. 
            Find trending niches and analyze channels - all features unlocked for free!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.button
              onClick={handleViewDemo}
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>🎯 Try AI Generator</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            
            <motion.button
              onClick={() => setActiveSection('niche')}
              className="group px-8 py-4 border-2 border-white/20 text-white rounded-xl font-medium text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center space-x-2">
                <Target className="w-5 h-5" />
                <span>🔍 Find Niches</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.div 
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => setActiveSection('content')}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Content Generator</h3>
              <p className="text-white/70">Generate scripts, titles, and descriptions using advanced AI models.</p>
              <div className="mt-3 flex items-center text-purple-400 text-sm">
                <Sparkles className="w-4 h-4 mr-1" />
                <span>Try now</span>
              </div>
            </motion.div>

            <motion.div 
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => setActiveSection('niche')}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Niche Discovery</h3>
              <p className="text-white/70">Find profitable niches using real Google Trends data and AI analysis.</p>
              <div className="mt-3 flex items-center text-blue-400 text-sm">
                <Target className="w-4 h-4 mr-1" />
                <span>Discover now</span>
              </div>
            </motion.div>

            <motion.div 
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
              onClick={() => setActiveSection('analytics')}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">YouTube Analytics</h3>
              <p className="text-white/70">Real YouTube analytics with AI-powered growth recommendations.</p>
              <div className="mt-3 flex items-center text-green-400 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Analyze now</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Testimonials Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-white mb-8">🏆 Hackathon Demo Features</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">🤖 AI Content Generation</h4>
                <p className="text-white/70 text-sm">Generate scripts, titles, descriptions, and hashtags using Google Gemini AI</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">📊 Real YouTube Analytics</h4>
                <p className="text-white/70 text-sm">Connect to any YouTube channel and get comprehensive analytics and insights</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">🎯 Niche Discovery</h4>
                <p className="text-white/70 text-sm">Find profitable niches using Google Trends data and AI-powered analysis</p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-white/60 text-sm">Free Demo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">8+</div>
              <div className="text-white/60 text-sm">AI Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">∞</div>
              <div className="text-white/60 text-sm">Generations</div>
            </div>
          </motion.div>

          {/* Hackathon CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-12 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 max-w-2xl mx-auto"
          >
            <h3 className="text-xl font-bold text-white mb-2">🏆 Bolt AI Hackathon Demo</h3>
            <p className="text-white/70 mb-4">All features unlocked! Try our AI-powered content creation tools</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setActiveSection('content')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                🚀 Start Creating Content
              </button>
              <button
                onClick={() => setActiveSection('tools')}
                className="px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-300"
              >
                🛠️ Explore All Tools
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;