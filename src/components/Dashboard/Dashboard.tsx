import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, BarChart3, TrendingUp, Eye, Users, DollarSign, Crown, Zap } from 'lucide-react';
import YouTubeConnect from '../Auth/YouTubeConnect';
import ChannelInsights from './ChannelInsights';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [channelData, setChannelData] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'insights', name: 'Insights', icon: TrendingUp },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const handleChannelConnected = (data: any) => {
    setChannelData(data);
    fetchChannelInsights(data.id);
  };

  const fetchChannelInsights = async (channelId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/analytics/channel/${channelId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-3xl p-8 mb-8 border border-purple-500/30 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome back, <span className="text-purple-400">{user.name}</span>
                </h1>
                <p className="text-white/70 text-lg">Manage your content and track your growth with Asira AI</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Pro Member - All Features Unlocked</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-6 py-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{user.email}</div>
                  <div className="text-white/60 text-sm">Premium Account</div>
                </div>
              </div>
              
              <motion.button
                onClick={onLogout}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-2xl transition-colors flex items-center space-x-2 border border-red-500/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex space-x-2 bg-white/5 backdrop-blur-sm rounded-2xl p-2 mb-8 border border-white/10"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              {channelData && insights && (
                <div className="grid md:grid-cols-4 gap-6">
                  <motion.div 
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{insights.overview.totalViews.toLocaleString()}</div>
                        <div className="text-white/70 text-sm">Total Views</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{insights.overview.subscribers.toLocaleString()}</div>
                        <div className="text-white/70 text-sm">Subscribers</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{insights.overview.totalVideos.toLocaleString()}</div>
                        <div className="text-white/70 text-sm">Videos</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/30"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">${insights.overview.estimatedRevenue.toLocaleString()}</div>
                        <div className="text-white/70 text-sm">Est. Revenue</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* YouTube Connection */}
              <YouTubeConnect user={user} onChannelConnected={handleChannelConnected} />

              {/* Channel Insights */}
              {channelData && insights && (
                <ChannelInsights channelData={channelData} insights={insights} />
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-8">
              {channelData && insights ? (
                <ChannelInsights channelData={channelData} insights={insights} detailed />
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Channel Connected</h3>
                  <p className="text-white/70 text-lg">Connect your YouTube channel to view detailed insights and analytics</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Account Settings</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-3">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-white font-medium">Email Notifications</div>
                      <div className="text-white/60 text-sm">Receive updates about your content performance</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-purple-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-white font-medium">Analytics Reports</div>
                      <div className="text-white/60 text-sm">Weekly analytics reports via email</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-purple-500" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-white font-medium">AI Recommendations</div>
                      <div className="text-white/60 text-sm">Get AI-powered content suggestions</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-purple-500" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-500/30">
                <div className="flex items-center space-x-4 mb-4">
                  <Crown className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-2xl font-bold text-white">Premium Features</h3>
                </div>
                <p className="text-white/80 mb-4">You have access to all premium features for free!</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/80">Unlimited AI generations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/80">Real YouTube analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/80">Creator collaboration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-white/80">Priority support</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Dashboard;