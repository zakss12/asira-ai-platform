import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, DollarSign, Clock, Users, TrendingUp, Filter, Heart, MessageCircle, ExternalLink, Award, Verified, Globe, Languages } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
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
}

const CreatorMarketplace: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [loading, setLoading] = useState(true);

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
        ]
      },
      {
        id: '2',
        name: 'Lifestyle Guru',
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
        ]
      },
      {
        id: '3',
        name: 'Business Expert',
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
        ]
      },
      {
        id: '4',
        name: 'Cooking Master',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
        niche: 'cooking',
        location: 'Lagos',
        country: 'nigeria',
        flag: '🇳🇬',
        language: 'english',
        rating: 4.9,
        reviews: 203,
        subscribers: 150000,
        avgViews: 25000,
        priceRange: '$100 - $300',
        verified: true,
        creatorScore: 0,
        badges: ['✅ Verified Creator', '📈 Fast Growing', '🧠 AI-Optimized', '🌍 Location Verified', '📣 Open to Work'],
        services: ['Recipe Development', 'Food Photography', 'Cooking Tutorials'],
        portfolio: [
          { title: 'Authentic African Cuisine', thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300', views: 125000 },
          { title: '30-Minute Healthy Meals', thumbnail: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300', views: 78000 }
        ],
        successStories: [
          { brand: 'Spice Masters', result: '400% increase in product sales', roi: '520%' }
        ]
      },
      {
        id: '5',
        name: 'Fitness Coach',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
        niche: 'fitness',
        location: 'London',
        country: 'uk',
        flag: '🇬🇧',
        language: 'english',
        rating: 4.8,
        reviews: 174,
        subscribers: 200000,
        avgViews: 30000,
        priceRange: '$400 - $800',
        verified: true,
        creatorScore: 0,
        badges: ['✅ Verified Creator', '🧠 AI-Optimized', '📣 Open to Work'],
        services: ['Workout Programs', 'Nutrition Guides', 'Live Sessions'],
        portfolio: [
          { title: 'Home Workout Revolution', thumbnail: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=300', views: 156000 },
          { title: 'Mindful Fitness Journey', thumbnail: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=300', views: 92000 }
        ],
        successStories: [
          { brand: 'FitGear Pro', result: '350% boost in equipment sales', roi: '480%' }
        ]
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
  }, []);

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

  const handleContactCreator = (creatorId: string) => {
    alert(`Contact feature would open for creator ${creatorId}`);
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
          <p className="text-white">Loading creators...</p>
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
            Global Creator <span className="text-purple-400">Marketplace</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Connect with verified creators worldwide. Find the perfect match for your brand 
            with AI-powered recommendations and real performance data.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="grid md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search creators..."
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
        </motion.div>

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
                    onClick={() => handleContactCreator(creator.id)}
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
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCreators.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Creators Found</h3>
            <p className="text-white/70 text-lg mb-6">
              Try adjusting your search criteria or browse all creators
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedNiche('all');
                setSelectedCountry('all');
                setSelectedLanguage('all');
                setPriceFilter('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CreatorMarketplace;