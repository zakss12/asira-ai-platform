import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import NicheFinder from './components/NicheFinder';
import ContentGenerator from './components/ContentGenerator';
import Analytics from './components/Analytics';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import VideoGenerator from './components/VideoGenerator';
import CrossPlatform from './components/CrossPlatform';
import Collaborate from './components/Collaborate';
import CampaignWizard from './components/CampaignWizard';
import BoostAcademy from './components/BoostAcademy';
import Tools from './components/Tools';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('hero');

  const renderSection = () => {
    switch (activeSection) {
      case 'hero':
        return <Hero setActiveSection={setActiveSection} />;
      case 'content':
        return <ContentGenerator />;
      case 'niche':
        return <NicheFinder />;
      case 'analytics':
        return <Analytics />;
      case 'collaborate':
        return <Collaborate />;
      case 'campaign':
        return <CampaignWizard />;
      case 'academy':
        return <BoostAcademy />;
      case 'tools':
        return <Tools setActiveSection={setActiveSection} />;
      case 'thumbnail':
        return <ThumbnailGenerator />;
      case 'video':
        return <VideoGenerator />;
      case 'crossplatform':
        return <CrossPlatform />;
      default:
        return <Hero setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hackathon Notice */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-medium">
        🚀 Hackathon Demo Version - Authentication temporarily disabled. Full features coming after Bolt AI Hackathon! 🎉
      </div>
      
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
      />
      
      <main className="relative pt-8">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default App;