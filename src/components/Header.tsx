import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Menu, X, User, LogOut } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeSection, 
  setActiveSection
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'content', label: 'AI Generator' },
    { id: 'niche', label: 'Niche Finder' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'collaborate', label: 'Collaborate' },
    { id: 'tools', label: 'Tools' },
    { id: 'campaign', label: 'Campaign Wizard' },
    { id: 'academy', label: 'Academy' }
  ];

  return (
    <motion.header 
      className="fixed top-8 left-0 right-0 z-40 bg-black/20 backdrop-blur-lg border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveSection('hero')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Asira AI</span>
              <div className="text-xs text-purple-300 -mt-1">From idea to income — powered by AI</div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                  activeSection === item.id 
                    ? 'text-purple-400 bg-purple-500/20 border border-purple-500/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* Hackathon Badge */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm">
              🏆 Hackathon Demo
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden py-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 text-sm ${
                    activeSection === item.id 
                      ? 'text-purple-400 bg-purple-500/20' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;