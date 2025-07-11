import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, ThumbsUp, MessageCircle, Lightbulb } from 'lucide-react';

interface ChannelInsightsProps {
  channelData: any;
  insights: any;
  detailed?: boolean;
}

const ChannelInsights: React.FC<ChannelInsightsProps> = ({ channelData, insights, detailed = false }) => {
  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

  return (
    <div className="space-y-8">
      {/* Performance Trends */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-2xl font-bold text-white mb-6">Performance Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={insights.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#ffffff60" fontSize={12} />
              <YAxis stroke="#ffffff60" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={3} />
              <Line type="monotone" dataKey="subscribers" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {detailed && (
        <>
          {/* Demographics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Age Demographics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={insights.demographics.ageGroups}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                    >
                      {insights.demographics.ageGroups.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Top Countries</h3>
              <div className="space-y-4">
                {insights.demographics.topCountries.map((country: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white">{country.country}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                      <span className="text-white/70 text-sm w-12">{country.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Videos Performance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Recent Videos Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/80 py-3 px-4">Video</th>
                    <th className="text-right text-white/80 py-3 px-4">Views</th>
                    <th className="text-right text-white/80 py-3 px-4">Likes</th>
                    <th className="text-right text-white/80 py-3 px-4">Comments</th>
                    <th className="text-right text-white/80 py-3 px-4">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.recentVideos.slice(0, 5).map((video: any) => (
                    <tr key={video.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-16 h-9 rounded object-cover"
                          />
                          <div className="max-w-xs">
                            <div className="text-white font-medium line-clamp-2">{video.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-white/80">
                        {video.views.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-white/80">
                        {video.likes.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right text-white/80">
                        {video.comments.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-purple-400 font-semibold">{video.engagementRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: detailed ? 0.6 : 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">AI Growth Recommendations</h3>
        </div>

        <div className="space-y-6">
          {insights.recommendations.slice(0, detailed ? undefined : 2).map((recommendation: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`p-6 rounded-xl border ${
                recommendation.priority === 'high' 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : recommendation.priority === 'medium'
                  ? 'bg-yellow-500/10 border-yellow-500/20'
                  : 'bg-blue-500/10 border-blue-500/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">{recommendation.title}</h4>
                  <p className="text-white/80">{recommendation.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  recommendation.priority === 'high' 
                    ? 'bg-red-500/20 text-red-300' 
                    : recommendation.priority === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {recommendation.priority.toUpperCase()}
                </span>
              </div>
              
              {detailed && (
                <div className="space-y-2">
                  <h5 className="text-white/90 font-medium">Action Items:</h5>
                  <ul className="space-y-1">
                    {recommendation.actionItems.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start space-x-2 text-white/70">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ChannelInsights;