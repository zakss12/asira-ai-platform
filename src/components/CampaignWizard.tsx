import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, DollarSign, Users, TrendingUp, Star, Eye, MessageCircle, Zap, Loader, CheckCircle } from 'lucide-react';

interface CampaignData {
  niche: string;
  budget: number;
  suggestedCreators: {
    id: string;
    name: string;
    avatar: string;
    score: number;
    followers: number;
    engagement: number;
    estimatedReach: number;
    price: string;
    flag: string;
  }[];
  contentFormat: {
    type: string;
    description: string;
    platforms: string[];
  };
  sampleContent: {
    captions: string[];
    hashtags: string[];
  };
  estimatedResults: {
    reach: number;
    engagement: number;
    conversions: number;
    roi: number;
  };
}

const CampaignWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState('');
  const [budget, setBudget] = useState(1000);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [generating, setGenerating] = useState(false);

  const niches = [
    { id: 'tech', name: 'Technology', icon: '💻', description: 'Gadgets, software, AI tools' },
    { id: 'fitness', name: 'Fitness & Health', icon: '💪', description: 'Workouts, nutrition, wellness' },
    { id: 'skincare', name: 'Skincare & Beauty', icon: '✨', description: 'Cosmetics, skincare routines' },
    { id: 'food', name: 'Food & Cooking', icon: '🍳', description: 'Recipes, restaurants, cooking tips' },
    { id: 'fashion', name: 'Fashion & Style', icon: '👗', description: 'Clothing, accessories, trends' },
    { id: 'travel', name: 'Travel & Lifestyle', icon: '✈️', description: 'Destinations, experiences' },
    { id: 'business', name: 'Business & Finance', icon: '💼', description: 'Entrepreneurship, investing' },
    { id: 'education', name: 'Education & Learning', icon: '📚', description: 'Courses, tutorials, skills' }
  ];

  const generateCampaign = async () => {
    if (!niche) return;
    
    setGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockCampaign: CampaignData = {
        niche,
        budget,
        suggestedCreators: [
          {
            id: '1',
            name: 'Creator Expert',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
            score: 92,
            followers: 85000,
            engagement: 4.8,
            estimatedReach: Math.round(budget * 0.8),
            price: `$${Math.round(budget * 0.3)}`,
            flag: '🇺🇬'
          },
          {
            id: '2',
            name: 'Content Master',
            avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
            score: 88,
            followers: 120000,
            engagement: 4.6,
            estimatedReach: Math.round(budget * 1.2),
            price: `$${Math.round(budget * 0.4)}`,
            flag: '🇮🇳'
          },
          {
            id: '3',
            name: 'Influence Pro',
            avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
            score: 85,
            followers: 95000,
            engagement: 4.4,
            estimatedReach: Math.round(budget * 0.9),
            price: `$${Math.round(budget * 0.25)}`,
            flag: '🇰🇪'
          }
        ],
        contentFormat: {
          type: getContentFormat(niche),
          description: getContentDescription(niche),
          platforms: ['YouTube', 'Instagram', 'TikTok']
        },
        sampleContent: {
          captions: generateSampleCaptions(niche),
          hashtags: generateSampleHashtags(niche)
        },
        estimatedResults: {
          reach: Math.round(budget * 2.5),
          engagement: Math.round(budget * 0.15),
          conversions: Math.round(budget * 0.05),
          roi: Math.round((budget * 0.05 * 50) / budget * 100)
        }
      };
      
      setCampaignData(mockCampaign);
      setGenerating(false);
      setStep(3);
    }, 3000);
  };

  const getContentFormat = (niche: string) => {
    const formats: { [key: string]: string } = {
      tech: 'Product Review & Unboxing',
      fitness: 'Workout Demonstration',
      skincare: 'Before/After Transformation',
      food: 'Recipe Tutorial',
      fashion: 'Styling & Try-On',
      travel: 'Destination Showcase',
      business: 'Case Study & Tips',
      education: 'Tutorial & Guide'
    };
    return formats[niche] || 'Product Showcase';
  };

  const getContentDescription = (niche: string) => {
    const descriptions: { [key: string]: string } = {
      tech: 'Authentic product reviews with hands-on demonstrations',
      fitness: 'Engaging workout videos with real results',
      skincare: 'Honest reviews with visible transformations',
      food: 'Step-by-step cooking with taste reactions',
      fashion: 'Styling tips with authentic try-on sessions',
      travel: 'Immersive destination content with experiences',
      business: 'Real success stories and actionable advice',
      education: 'Clear tutorials with practical examples'
    };
    return descriptions[niche] || 'Engaging product showcase content';
  };

  const generateSampleCaptions = (niche: string) => {
    const captions: { [key: string]: string[] } = {
      tech: [
        "Just tested this amazing new gadget and I'm blown away! 🤯 Here's my honest review...",
        "This tech tool changed my workflow completely! Let me show you how...",
        "Is this the future of technology? My detailed review inside! 🚀"
      ],
      fitness: [
        "30-day transformation using this workout routine! The results speak for themselves 💪",
        "This fitness program actually works! Here's my honest experience...",
        "From beginner to confident - my fitness journey with this amazing program! 🔥"
      ],
      skincare: [
        "My skin transformation in just 2 weeks! This skincare routine is incredible ✨",
        "Finally found the perfect skincare routine! Here's what worked for me...",
        "Before vs After - this skincare product delivered real results! 🌟"
      ]
    };
    return captions[niche] || [
      "Amazing experience with this product! Here's my honest review...",
      "This completely exceeded my expectations! Let me tell you why...",
      "Game-changer alert! This product is worth every penny! 🔥"
    ];
  };

  const generateSampleHashtags = (niche: string) => {
    const hashtags: { [key: string]: string[] } = {
      tech: ['#TechReview', '#Innovation', '#Gadgets', '#TechTips', '#ProductReview', '#Technology'],
      fitness: ['#FitnessJourney', '#WorkoutMotivation', '#HealthyLifestyle', '#FitnessGoals', '#Transformation'],
      skincare: ['#SkincareRoutine', '#GlowUp', '#SkincareReview', '#BeautyTips', '#SkincareCommunity']
    };
    return hashtags[niche] || ['#ProductReview', '#Sponsored', '#Authentic', '#Honest', '#Recommended'];
  };

  const resetWizard = () => {
    setStep(1);
    setNiche('');
    setBudget(1000);
    setCampaignData(null);
    setGenerating(false);
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
            Campaign <span className="text-purple-400">Wizard</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Launch your influencer marketing campaign in minutes. Get AI-powered creator recommendations, 
            content strategies, and performance predictions.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNum ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/50'
                }`}>
                  {step > stepNum ? <CheckCircle className="w-6 h-6" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-24 h-1 mx-4 ${
                    step > stepNum ? 'bg-purple-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-white/70">
            <span>Choose Niche</span>
            <span>Set Budget</span>
            <span>Campaign Results</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Niche Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Campaign Niche</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {niches.map((nicheOption) => (
                  <motion.button
                    key={nicheOption.id}
                    onClick={() => setNiche(nicheOption.id)}
                    className={`p-6 rounded-xl border transition-all duration-300 text-left ${
                      niche === nicheOption.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-3xl mb-3">{nicheOption.icon}</div>
                    <h4 className="text-white font-semibold mb-2">{nicheOption.name}</h4>
                    <p className="text-white/70 text-sm">{nicheOption.description}</p>
                  </motion.button>
                ))}
              </div>
              
              {niche && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <motion.button
                    onClick={() => setStep(2)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue to Budget
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Budget Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Set Your Campaign Budget</h3>
              
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/80">Budget Range</span>
                    <span className="text-2xl font-bold text-purple-400">${budget.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="250"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-white/60 text-sm mt-2">
                    <span>$500</span>
                    <span>$10,000</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-green-400">{Math.round(budget * 2.5).toLocaleString()}</div>
                    <div className="text-white/70 text-sm">Estimated Reach</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-blue-400">{Math.round(budget * 0.15).toLocaleString()}</div>
                    <div className="text-white/70 text-sm">Expected Engagement</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-purple-400">{Math.round((budget * 0.05 * 50) / budget * 100)}%</div>
                    <div className="text-white/70 text-sm">Projected ROI</div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    onClick={generateCampaign}
                    disabled={generating}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {generating ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Generating Campaign...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <Rocket className="w-5 h-5" />
                        <span>Generate Campaign</span>
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Campaign Results */}
          {step === 3 && campaignData && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30 text-center">
                <h3 className="text-3xl font-bold text-white mb-2">🎉 Your Campaign is Ready!</h3>
                <p className="text-white/80">AI-generated campaign strategy for {niches.find(n => n.id === niche)?.name}</p>
              </div>

              {/* Suggested Creators */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-2xl font-bold text-white mb-6">🌟 Recommended Creators</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  {campaignData.suggestedCreators.map((creator) => (
                    <div key={creator.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-4">
                        <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-full" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="text-white font-semibold">{creator.name}</h5>
                            <span>{creator.flag}</span>
                          </div>
                          <div className="text-purple-400 font-bold">Score: {creator.score}</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Followers:</span>
                          <span className="text-white">{creator.followers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Engagement:</span>
                          <span className="text-white">{creator.engagement}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Est. Reach:</span>
                          <span className="text-white">{creator.estimatedReach.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Price:</span>
                          <span className="text-green-400 font-semibold">{creator.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Strategy */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-bold text-white mb-4">📹 Content Format</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="text-purple-400 font-semibold">{campaignData.contentFormat.type}</div>
                      <div className="text-white/80 text-sm">{campaignData.contentFormat.description}</div>
                    </div>
                    <div>
                      <div className="text-white/70 text-sm mb-2">Recommended Platforms:</div>
                      <div className="flex space-x-2">
                        {campaignData.contentFormat.platforms.map((platform) => (
                          <span key={platform} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h4 className="text-xl font-bold text-white mb-4">📊 Estimated Results</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{campaignData.estimatedResults.reach.toLocaleString()}</div>
                      <div className="text-white/70 text-sm">Total Reach</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{campaignData.estimatedResults.engagement.toLocaleString()}</div>
                      <div className="text-white/70 text-sm">Engagements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{campaignData.estimatedResults.conversions.toLocaleString()}</div>
                      <div className="text-white/70 text-sm">Conversions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{campaignData.estimatedResults.roi}%</div>
                      <div className="text-white/70 text-sm">Expected ROI</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Content */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-xl font-bold text-white mb-4">✍️ Sample Content</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-white font-semibold mb-3">Sample Captions:</h5>
                    <div className="space-y-3">
                      {campaignData.sampleContent.captions.map((caption, index) => (
                        <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/80 text-sm italic">"{caption}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold mb-3">Recommended Hashtags:</h5>
                    <div className="flex flex-wrap gap-2">
                      {campaignData.sampleContent.hashtags.map((hashtag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <motion.button
                  onClick={resetWizard}
                  className="flex-1 px-6 py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create New Campaign
                </motion.button>
                <motion.button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Launch Campaign
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CampaignWizard;