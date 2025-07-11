import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Star, MapPin, DollarSign, Clock, TrendingUp, Filter, Heart, ExternalLink, Award, Verified, Globe, Languages, Search, Target, Zap, User, Building, Send, X, Plus, Eye, CheckCircle } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  channelName?: string;
  channelLink?: string;
  avatar: string;
  niche: string;
  location: string;
  country: string;
  flag: string;
  language: string;
  rating: number;
  reviews: number;
  subscribers: number;
  avgViews: number;
  priceRange: string;
  verified: boolean;
  creatorScore: number;
  badges: string[];
  services: string[];
  portfolio: {
    title: string;
    thumbnail: string;
    views: number;
  }[];
  successStories: {
    brand: string;
    result: string;
    roi: string;
  }[];
  isRegistered?: boolean;
}

interface Message {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Collaboration {
  id: string;
  creatorId: string;
  businessId: string;
  status: 'pending' | 'in-discussion' | 'completed';
  title: string;
  description: string;
  budget: string;
  createdAt: string;
  rating?: number;
  review?: string;
}

const Collaborate: React.FC = () => {
  const [mode, setMode] = useState<'creator' | 'business'>('creator');
  const [activeTab, setActiveTab] = useState('browse');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Registration form state
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    channelName: '',
    channelLink: '',
    country: '',
    audienceSize: '',
    fee: '',
    niche: '',
    businessType: '',
    contactEmail: ''
  });

  // Message form state
  const [messageContent, setMessageContent] = useState('');
  const [proposalData, setProposalData] = useState({
    title: '',
    description: '',
    budget: ''
  });

  const niches = [
    'all', 'tech', 'gaming', 'lifestyle', 'fitness', 'cooking', 
    'education', 'business', 'travel', 'fashion', 'music'
  ];

  const countries = [
    { id: 'all', name: 'All Countries', flag: '🌍' },
    { id: 'uganda', name: 'Uganda', flag: '🇺🇬' },
    { id: 'india', name: 'India', flag: '🇮🇳' },
    { id: 'kenya', name: 'Kenya', flag: '🇰🇪' },
    { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬' },
    { id: 'usa', name: 'United States', flag: '🇺🇸' },
    { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' }
  ];

  const languages = [
    { id: 'all', name: 'All Languages' },
    { id: 'english', name: 'English' },
    { id: 'hindi', name: 'Hindi' },
    { id: 'swahili', name: 'Swahili' },
    { id: 'spanish', name: 'Spanish' },
    { id: 'french', name: 'French' }
  ];

  const priceRanges = [
    { id: 'all', label: 'All Budgets' },
    { id: 'budget', label: '$50 - $200' },
    { id: 'mid', label: '$200 - $500' },
    { id: 'premium', label: '$500 - $1000' },
    { id: 'enterprise', label: '$1000+' }
  ];

  const testimonials = [
    {
      id: 1,
      role: 'YouTube Creator',
      content: 'Asira AI helped me grow from 5K to 50K subscribers in just 3 months! The collaboration features connected me with amazing brands.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      platform: 'YouTube'
    },
    {
      id: 2,
      role: 'Online Business Owner',
      content: 'Found amazing creators for our startup through the platform. ROI increased by 300% with the right partnerships!',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      platform: 'Business'
    },
    {
      id: 3,
      role: 'TikTok Creator',
      content: 'The AI content generator saves me 10+ hours per week. Perfect for creating engaging content across all platforms.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
      platform: 'TikTok'
    },
    {
      id: 4,
      role: 'Instagram User',
      content: 'Love how easy it is to find creators in my niche. The collaboration tools make working together seamless.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
      platform: 'Instagram'
    }
  ];

  const calculateCreatorScore = (creator: any) => {
    let score = 0;
    
    // Followers score (0-30 points)
    if (creator.subscribers > 100000) score += 30;
    else if (creator.subscribers > 50000) score += 25;
    else if (creator.subscribers > 10000) score += 20;
    else score += 10;
    
    // Rating score (0-25 points)
    score += (creator.rating / 5) * 25;
    
    // Reviews score (0-15 points)
    if (creator.reviews > 100) score += 15;
    else if (creator.reviews > 50) score += 10;
    else score += 5;
    
    // Verification bonus (0-10 points)
    if (creator.verified) score += 10;
    
    // Badges bonus (0-20 points)
    score += Math.min(creator.badges.length * 5, 20);
    
    return Math.round(score);
  };

  useEffect(() => {
    // Generate sample creators with global diversity
    const sampleCreators: Creator[] = [
      {
        id: '1',
        name: 'Tech Creator Pro',
        channelName: 'TechReviews Channel',
        channelLink: 'https://youtube.com/@techreviews',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        niche: 'tech',
        location: 'Kampala',
        country: 'uganda',
        flag: '🇺🇬',
        language: 'english',
        rating: 4.9,
        reviews: 127,
        subscribers: 85000,
        avgViews: 12000,
        priceRange: '$200 - $500',
        verified: true,
        creatorScore: 0,
        badges: ['✅ Verified Creator', '📈 Fast Growing', '🧠 AI-Optimized', '📣 Open to Work'],
        services: ['Video Creation', 'Product Reviews', 'Tutorials'],
        portfolio: [
          { title: 'Latest Tech Review', thumbnail: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=300', views: 45000 },
          { title: 'AI Tools for Creators', thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300', views: 32000 }
        ],
        successStories: [
          { brand: 'TechStart Inc', result: '300% increase in app downloads', roi: '450%' }
        ],
        isRegistered: true
      },
      {
        id: '2',
        name: 'Lifestyle Guru',
        channelName: 'Daily Lifestyle',
        channelLink: 'https://youtube.com/@dailylifestyle',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        niche: 'lifestyle',
        location: 'Mumbai',
        country: 'india',
        flag: '🇮🇳',
        language: 'hindi',
        rating: 4.8,
        reviews: 89,
        subscribers: 120000,
        avgViews: 18000,
        priceRange: '$300 - $600',
        verified: true,
        creatorScore: 0,
        badges: ['✅ Verified Creator', '🌍 Location Verified', '🧠 AI-Optimized', '📣 Open to Work'],
        services: ['Brand Partnerships', 'Content Strategy', 'Social Media Management'],
        portfolio: [
          { title: 'Morning Routine Guide', thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300', views: 67000 },
          { title: 'Sustainable Living Tips', thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300', views: 41000 }
        ],
        successStories: [
          { brand: 'EcoLife Brand', result: '250% boost in brand awareness', roi: '380%' }
        ],
        isRegistered: true
      },
      {
        id: '3',
        name: 'Business Expert',
        channelName: 'Startup Success',
        channelLink: 'https://youtube.com/@startupsuccess',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
        niche: 'business',
        location: 'Nairobi',
        country: 'kenya',
        flag: '🇰🇪',
        language: 'swahili',
        rating: 4.7,
        reviews: 156,
        subscribers: 95000,
        avgViews: 15000,
        priceRange: '$150 - $400',
        verified: true,
        creatorScore: 0,
        badges: ['✅ Verified Creator', '📈 Fast Growing', '🌍 Location Verified', '📣 Open to Work'],
        services: ['Educational Content', 'Webinars', 'Course Creation'],
        portfolio: [
          { title: 'Start Your Business Guide', thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300', views: 89000 },
          { title: 'Digital Marketing Mastery', thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=300', views: 52000 }
        ],
        successStories: [
          { brand: 'StartupHub Africa', result: '500+ new course enrollments', roi: '600%' }
        ],
        isRegistered: true
      },
      // Placeholder creators (not registered)
      {
        id: '4',
        name: 'YouTube Creator',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
        niche: 'cooking',
        location: 'Lagos',
        country: 'nigeria',
        flag: '🇳🇬',
        language: 'english',
        rating: 4.5,
        reviews: 45,
        subscribers: 50000,
        avgViews: 8000,
        priceRange: '$100 - $300',
        verified: false,
        creatorScore: 0,
        badges: ['📣 Open to Work'],
        services: ['Recipe Development', 'Food Photography'],
        portfolio: [],
        successStories: [],
        isRegistered: false
      },
      {
        id: '5',
        name: 'Instagram Influencer',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
        niche: 'fitness',
        location: 'London',
        country: 'uk',
        flag: '🇬🇧',
        language: 'english',
        rating: 4.3,
        reviews: 32,
        subscribers: 75000,
        avgViews: 12000,
        priceRange: '$200 - $400',
        verified: false,
        creatorScore: 0,
        badges: ['📣 Open to Work'],
        services: ['Workout Programs', 'Nutrition Guides'],
        portfolio: [],
        successStories: [],
        isRegistered: false
      }
    ];

    // Calculate creator scores
    const creatorsWithScores = sampleCreators.map(creator => ({
      ...creator,
      creatorScore: calculateCreatorScore(creator)
    }));

    setCreators(creatorsWithScores);
    setFilteredCreators(creatorsWithScores);
    setLoading(false);

    // Mock current user
    setCurrentUser({
      id: 'user1',
      name: 'Current User',
      type: mode
    });
  }, [mode]);

  useEffect(() => {
    let filtered = creators;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(creator =>
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Niche filter
    if (selectedNiche !== 'all') {
      filtered = filtered.filter(creator => creator.niche === selectedNiche);
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(creator => creator.country === selectedCountry);
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(creator => creator.language === selectedLanguage);
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(creator => {
        const price = creator.priceRange.toLowerCase();
        switch (priceFilter) {
          case 'budget': return price.includes('50') || price.includes('200');
          case 'mid': return price.includes('200') || price.includes('500');
          case 'premium': return price.includes('500') || price.includes('1000');
          case 'enterprise': return price.includes('1000');
          default: return true;
        }
      });
    }

    setFilteredCreators(filtered);
  }, [searchQuery, selectedNiche, selectedCountry, selectedLanguage, priceFilter, creators]);

  const handleContactCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setShowMessageModal(true);
  };

  const handleSendMessage = () => {
    if (!messageContent.trim() || !selectedCreator) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      fromId: currentUser.id,
      toId: selectedCreator.id,
      fromName: currentUser.name,
      toName: selectedCreator.name,
      content: messageContent,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageContent('');
    setShowMessageModal(false);
    
    // Show success message
    alert(`Message sent to ${selectedCreator.name}! They will be notified via email.`);
  };

  const handleSubmitProposal = () => {
    if (!proposalData.title.trim() || !proposalData.description.trim() || !selectedCreator) return;

    const newCollaboration: Collaboration = {
      id: Date.now().toString(),
      creatorId: selectedCreator.id,
      businessId: currentUser.id,
      status: 'pending',
      title: proposalData.title,
      description: proposalData.description,
      budget: proposalData.budget,
      createdAt: new Date().toISOString()
    };

    setCollaborations(prev => [...prev, newCollaboration]);
    setProposalData({ title: '', description: '', budget: '' });
    setShowMessageModal(false);
    
    alert(`Collaboration proposal sent to ${selectedCreator.name}!`);
  };

  const handleRegistration = () => {
    if (mode === 'creator') {
      if (!registrationData.fullName || !registrationData.channelName || !registrationData.niche) {
        alert('Please fill in all required fields');
        return;
      }
    } else {
      if (!registrationData.fullName || !registrationData.businessType || !registrationData.contactEmail) {
        alert('Please fill in all required fields');
        return;
      }
    }

    // Mock registration success
    alert(`${mode === 'creator' ? 'Creator' : 'Business'} registration successful! You can now access all collaboration features.`);
    setShowRegistrationForm(false);
    setRegistrationData({
      fullName: '',
      channelName: '',
      channelLink: '',
      country: '',
      audienceSize: '',
      fee: '',
      niche: '',
      businessType: '',
      contactEmail: ''
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-orange-500/20 border-orange-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading collaboration platform...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Creator <span className="text-purple-400">Collaboration Hub</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Connect creators and businesses for profitable partnerships. 
            Find collaborators, send proposals, and manage projects all in one place.
          </p>
        </motion.div>

        {/* Mode Switch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
            <div className="flex space-x-2">
              <button
                onClick={() => setMode('creator')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  mode === 'creator'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Creator Mode</span>
              </button>
              <button
                onClick={() => setMode('business')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  mode === 'business'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Building className="w-5 h-5" />
                <span>Business Mode</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'browse'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {mode === 'business' ? 'Browse Creators' : 'Browse Opportunities'}
              </button>
              <button
                onClick={() => setActiveTab('collaborations')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'collaborations'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                My Collaborations
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'messages'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Messages
              </button>
            </div>
          </div>
        </motion.div>

        {/* Registration CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {mode === 'creator' ? '🎨 Join as a Creator' : '🏢 Join as a Business'}
              </h3>
              <p className="text-white/70">
                {mode === 'creator' 
                  ? 'Register your channel and start receiving collaboration offers from brands'
                  : 'Register your business and find the perfect creators for your campaigns'
                }
              </p>
            </div>
            <motion.button
              onClick={() => setShowRegistrationForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register Now
            </motion.button>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filters */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
                <div className="grid md:grid-cols-6 gap-4">
                  {/* Search */}
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={mode === 'business' ? 'Search creators...' : 'Search opportunities...'}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Niche Filter */}
                  <div>
                    <select
                      value={selectedNiche}
                      onChange={(e) => setSelectedNiche(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                    >
                      {niches.map(niche => (
                        <option key={niche} value={niche} className="bg-gray-800">
                          {niche === 'all' ? 'All Niches' : niche.charAt(0).toUpperCase() + niche.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Country Filter */}
                  <div>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                    >
                      {countries.map(country => (
                        <option key={country.id} value={country.id} className="bg-gray-800">
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                    >
                      {languages.map(language => (
                        <option key={language.id} value={language.id} className="bg-gray-800">
                          {language.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                    >
                      {priceRanges.map(range => (
                        <option key={range.id} value={range.id} className="bg-gray-800">
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-white/70">
                  Found {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} 
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              {/* Creators Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCreators.map((creator, index) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group"
                  >
                    {/* Creator Header */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          {creator.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Verified className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-bold text-white">{creator.name}</h3>
                            <span className="text-lg">{creator.flag}</span>
                          </div>
                          {creator.isRegistered && creator.channelName && (
                            <div className="text-purple-400 text-sm mb-1">{creator.channelName}</div>
                          )}
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-4 h-4 text-white/50" />
                            <span className="text-white/70 text-sm">{creator.location}</span>
                            <Languages className="w-4 h-4 text-white/50" />
                            <span className="text-white/70 text-sm capitalize">{creator.language}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(creator.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                            <span className="text-white/70 text-sm ml-2">
                              {creator.rating} ({creator.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Creator Score */}
                    <div className="p-4 border-b border-white/10">
                      <div className={`flex items-center justify-between p-3 rounded-xl border ${getScoreBackground(creator.creatorScore)}`}>
                        <div>
                          <div className="text-white font-semibold">Asira Score</div>
                          <div className="text-white/60 text-xs">Based on growth, engagement & reviews</div>
                        </div>
                        <div className={`text-2xl font-bold ${getScoreColor(creator.creatorScore)}`}>
                          {creator.creatorScore}
                        </div>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {creator.badges.map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="p-4 border-b border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Users className="w-4 h-4 text-purple-400" />
                            <span className="text-white font-semibold">
                              {creator.subscribers >= 1000 
                                ? `${Math.round(creator.subscribers / 1000)}K` 
                                : creator.subscribers}
                            </span>
                          </div>
                          <div className="text-white/60 text-xs">Subscribers</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-white font-semibold">
                              {creator.avgViews >= 1000 
                                ? `${Math.round(creator.avgViews / 1000)}K` 
                                : creator.avgViews}
                            </span>
                          </div>
                          <div className="text-white/60 text-xs">Avg Views</div>
                        </div>
                      </div>
                    </div>

                    {/* Niche & Services */}
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">
                          {creator.niche.charAt(0).toUpperCase() + creator.niche.slice(1)}
                        </span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                          {creator.priceRange}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {creator.services.slice(0, 2).map((service, idx) => (
                          <div key={idx} className="text-white/70 text-sm">• {service}</div>
                        ))}
                        {creator.services.length > 2 && (
                          <div className="text-purple-400 text-sm">+{creator.services.length - 2} more</div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4">
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => handleContactCreator(creator)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MessageCircle className="w-4 h-4 inline mr-2" />
                          Contact
                        </motion.button>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        {creator.channelLink && (
                          <button 
                            onClick={() => window.open(creator.channelLink, '_blank')}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'collaborations' && (
            <motion.div
              key="collaborations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-6">My Collaborations</h3>
              {collaborations.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">No collaborations yet</p>
                  <p className="text-white/50">Start by contacting creators or businesses!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {collaborations.map((collab) => (
                    <div key={collab.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{collab.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          collab.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          collab.status === 'in-discussion' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {collab.status === 'completed' ? '✅ Completed' :
                           collab.status === 'in-discussion' ? '💬 In Discussion' :
                           '⏳ Pending'}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mb-2">{collab.description}</p>
                      <div className="flex items-center justify-between text-sm text-white/60">
                        <span>Budget: {collab.budget}</span>
                        <span>{new Date(collab.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Messages</h3>
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">No messages yet</p>
                  <p className="text-white/50">Start a conversation with creators or businesses!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{message.fromName}</span>
                          <span className="text-white/60">→</span>
                          <span className="text-white/80">{message.toName}</span>
                        </div>
                        <span className="text-white/60 text-sm">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white/80">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 mb-16"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">What Our Users Are Saying</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.role}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="text-white font-medium text-sm">{testimonial.role}</div>
                    <div className="text-white/60 text-xs">{testimonial.platform}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-3xl font-bold text-white mb-4">🚀 Ready to Collaborate?</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
              Join thousands of creators and brands building successful partnerships. 
              Start your collaboration journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setShowRegistrationForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎯 Join Platform
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('browse')}
                className="px-8 py-4 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📧 Browse {mode === 'business' ? 'Creators' : 'Opportunities'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegistrationForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {mode === 'creator' ? 'Creator Registration' : 'Business Registration'}
                  </h3>
                  <button
                    onClick={() => setShowRegistrationForm(false)}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={registrationData.fullName}
                      onChange={(e) => setRegistrationData({...registrationData, fullName: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {mode === 'creator' ? (
                    <>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          YouTube Channel Name *
                        </label>
                        <input
                          type="text"
                          value={registrationData.channelName}
                          onChange={(e) => setRegistrationData({...registrationData, channelName: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                          placeholder="Your channel name"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Channel Link
                        </label>
                        <input
                          type="url"
                          value={registrationData.channelLink}
                          onChange={(e) => setRegistrationData({...registrationData, channelLink: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                          placeholder="https://youtube.com/@yourchannel"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Country
                          </label>
                          <select
                            value={registrationData.country}
                            onChange={(e) => setRegistrationData({...registrationData, country: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                          >
                            <option value="" className="bg-gray-800">Select Country</option>
                            {countries.slice(1).map(country => (
                              <option key={country.id} value={country.id} className="bg-gray-800">
                                {country.flag} {country.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Audience Size
                          </label>
                          <input
                            type="text"
                            value={registrationData.audienceSize}
                            onChange={(e) => setRegistrationData({...registrationData, audienceSize: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                            placeholder="e.g., 50K subscribers"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Fee for Promotion
                          </label>
                          <input
                            type="text"
                            value={registrationData.fee}
                            onChange={(e) => setRegistrationData({...registrationData, fee: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                            placeholder="e.g., $200-500"
                          />
                        </div>

                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Niche/Industry *
                          </label>
                          <select
                            value={registrationData.niche}
                            onChange={(e) => setRegistrationData({...registrationData, niche: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
                          >
                            <option value="" className="bg-gray-800">Select Niche</option>
                            {niches.slice(1).map(niche => (
                              <option key={niche} value={niche} className="bg-gray-800">
                                {niche.charAt(0).toUpperCase() + niche.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Business Type *
                        </label>
                        <input
                          type="text"
                          value={registrationData.businessType}
                          onChange={(e) => setRegistrationData({...registrationData, businessType: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                          placeholder="e.g., Tech Startup, E-commerce, SaaS"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          Contact Email *
                        </label>
                        <input
                          type="email"
                          value={registrationData.contactEmail}
                          onChange={(e) => setRegistrationData({...registrationData, contactEmail: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                          placeholder="business@company.com"
                        />
                      </div>
                    </>
                  )}

                  <motion.button
                    onClick={handleRegistration}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Complete Registration
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && selectedCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    Contact {selectedCreator.name}
                  </h3>
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {mode === 'business' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Collaboration Title
                      </label>
                      <input
                        type="text"
                        value={proposalData.title}
                        onChange={(e) => setProposalData({...proposalData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                        placeholder="e.g., Product Review for Tech Gadget"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Project Description
                      </label>
                      <textarea
                        value={proposalData.description}
                        onChange={(e) => setProposalData({...proposalData, description: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
                        placeholder="Describe your collaboration proposal..."
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Budget Range
                      </label>
                      <input
                        type="text"
                        value={proposalData.budget}
                        onChange={(e) => setProposalData({...proposalData, budget: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                        placeholder="e.g., $500-1000"
                      />
                    </div>

                    <motion.button
                      onClick={handleSubmitProposal}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-4 h-4 inline mr-2" />
                      Send Collaboration Proposal
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
                        placeholder="Type your message here..."
                      />
                    </div>

                    <motion.button
                      onClick={handleSendMessage}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-4 h-4 inline mr-2" />
                      Send Message
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Collaborate;