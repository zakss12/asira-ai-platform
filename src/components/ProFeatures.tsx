import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, BarChart3, Upload, DollarSign, Users, Check, Star } from 'lucide-react';

const ProFeatures: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');

  const features = [
    {
      icon: BarChart3,
      title: 'Real YouTube Analytics',
      description: 'Connect your actual YouTube channel for live analytics and performance tracking',
      status: 'available'
    },
    {
      icon: Upload,
      title: 'Auto-Publish to Platforms',
      description: 'Automatically publish your content to YouTube, TikTok, and Facebook simultaneously',
      status: 'available'
    },
    {
      icon: DollarSign,
      title: 'Advanced Monetization',
      description: 'Stripe integration for selling digital products and managing affiliate links',
      status: 'available'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite team members and collaborate on content creation and strategy',
      status: 'available'
    },
    {
      icon: Zap,
      title: 'Priority AI Processing',
      description: 'Faster content generation with priority access to our AI models',
      status: 'available'
    },
    {
      icon: Crown,
      title: 'White-Label Solution',
      description: 'Remove CreatorBoost branding and use your own custom branding',
      status: 'available'
    }
  ];

  const plans = [
    {
      id: 'free',
      name: 'Free Forever',
      price: '$0',
      period: 'forever',
      description: 'Everything you need to get started',
      features: [
        'Unlimited content generations',
        'Real YouTube API integration',
        'Auto-publish to all platforms',
        'Advanced analytics & insights',
        'Priority AI processing',
        'Custom thumbnails & videos',
        'Team collaboration',
        'White-label solution',
        'All pro features included'
      ],
      buttonText: 'Current Plan - Free Forever!',
      buttonStyle: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/25',
      popular: true
    }
  ];

  const getStatusBadge = (status: string) => {
    return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">✅ Available</span>;
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
            <span className="text-green-400">All Features Free</span> Forever!
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            🎉 All premium features are now completely free! No subscriptions, no limits, 
            no hidden costs. Build your content empire without breaking the bank.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">🚀 All Features Unlocked</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 hover:bg-white/10 transition-all duration-300 hover:border-green-400/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {getStatusBadge(feature.status)}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">🎯 Your Plan</h3>
          <div className="grid gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-green-500/50 bg-green-500/10 scale-105"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Free Forever - No Catch!</span>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h4 className="text-3xl font-bold text-white mb-2">{plan.name}</h4>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-green-400">{plan.price}</span>
                    <span className="text-white/60 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-white/70 text-lg">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  className={`w-full px-6 py-4 rounded-xl font-medium transition-all duration-300 ${plan.buttonStyle}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.buttonText}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">🎁 Why Everything is Free?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">🚀 Mission-Driven</h4>
              <p className="text-white/70">We believe every creator deserves access to powerful AI tools, regardless of their budget. Our mission is to democratize content creation.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">🌍 Global Impact</h4>
              <p className="text-white/70">By making tools free, we're empowering creators worldwide, especially in developing regions, to build successful content businesses.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">🤝 Community First</h4>
              <p className="text-white/70">We're building a community of creators who support each other. Your success is our success, and we grow together.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-2">💡 Innovation Focus</h4>
              <p className="text-white/70">Instead of paywalls, we focus on innovation and building the best tools. Happy users lead to organic growth and sustainability.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-500/30">
            <h3 className="text-3xl font-bold text-white mb-4">🎉 Start Creating Amazing Content Now!</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
              All features are unlocked and ready to use. No sign-up required, no credit card needed. 
              Just pure creative power at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Start Creating Content
              </motion.button>
              <motion.button
                className="px-8 py-4 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📚 View Documentation
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProFeatures;