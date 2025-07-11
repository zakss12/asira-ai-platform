import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black/40 backdrop-blur-sm border-t border-white/10">
      {/* Hackathon Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 py-4"
      >
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">
              Join the $1M Creator Economy Hackathon - Building the Future of Content Creation
            </span>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Asira AI</span>
                <div className="text-sm text-purple-300">From idea to income — powered by AI</div>
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-md">
              Empowering creators worldwide with AI-driven tools for content creation, 
              SEO optimization, and monetization strategies. Built for the next generation 
              of digital entrepreneurs.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://twitter.com" 
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://linkedin.com" 
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a 
                href="mailto:hello@asira.ai" 
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-300">Niche Finder</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-300">Content Generator</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-300">Analytics</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-300">Collaborate</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-300">Creator Hub</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-300">Success Stories</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-300">Resources</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors duration-300">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/60 text-sm">
            © 2024 Asira AI. Built for creators, by creators. Empowering the global creator economy.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-white/60 hover:text-white text-sm transition-colors duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;