import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Clock, Star, ExternalLink, TrendingUp, Users, Zap, Award, Target } from 'lucide-react';

const BoostAcademy: React.FC = () => {
  const courses = [
    {
      id: 1,
      title: 'Grow Your Channel in 30 Days',
      description: 'Complete guide to rapid YouTube growth using proven strategies and AI tools',
      duration: '2 hours',
      level: 'Beginner',
      rating: 4.9,
      students: 15420,
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Growth',
      link: 'https://youtu.be/pfWA60Whjfo?si=-EiOQysfZpCvi5-5',
      featured: true
    },
    {
      id: 2,
      title: 'AI Content Creation Mastery',
      description: 'Master AI tools for creating viral content across all platforms',
      duration: '3.5 hours',
      level: 'Intermediate',
      rating: 4.8,
      students: 12350,
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'AI Tools',
      link: 'https://youtu.be/duGOA6ZiGtE?si=CowHeXdwXgrzGaan',
      featured: true
    },
    {
      id: 3,
      title: 'Monetization Strategies That Work',
      description: 'Turn your content into consistent income streams with proven methods',
      duration: '2.5 hours',
      level: 'Intermediate',
      rating: 4.7,
      students: 9870,
      thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Monetization',
      link: 'https://youtu.be/0sQXtKOqQH0?si=uAqv7kmU8wCtqkRm',
      featured: false
    },
    {
      id: 4,
      title: 'Viral Thumbnail Design Secrets',
      description: 'Create thumbnails that get clicks and boost your CTR dramatically',
      duration: '1.5 hours',
      level: 'Beginner',
      rating: 4.6,
      students: 8540,
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Design',
      link: 'https://youtu.be/A0079AhtlVU?si=2fdLizz_bHYn0Bdj',
      featured: false
    },
    {
      id: 5,
      title: 'Cross-Platform Content Strategy',
      description: 'Maximize your reach by optimizing content for multiple platforms',
      duration: '2 hours',
      level: 'Advanced',
      rating: 4.8,
      students: 6720,
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Strategy',
      link: 'https://youtu.be/HjUJf5bKCpU?si=zJNzDLdw10dtwZVw',
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Courses', icon: BookOpen, count: courses.length },
    { id: 'growth', name: 'Growth', icon: TrendingUp, count: 1 },
    { id: 'ai-tools', name: 'AI Tools', icon: Zap, count: 1 },
    { id: 'monetization', name: 'Monetization', icon: Target, count: 1 },
    { id: 'design', name: 'Design', icon: Award, count: 1 },
    { id: 'strategy', name: 'Strategy', icon: Users, count: 1 }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category.toLowerCase().replace(' ', '-') === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-400';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
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
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Asira Boost <span className="text-purple-400">Academy</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Master content creation with our curated YouTube courses. Learn from industry experts 
            and accelerate your creator journey with proven strategies.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{courses.length}</div>
            <div className="text-white/60 text-sm">Expert Courses</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">50K+</div>
            <div className="text-white/60 text-sm">Students</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">4.8</div>
            <div className="text-white/60 text-sm">Avg Rating</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">12h</div>
            <div className="text-white/60 text-sm">Total Content</div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl border transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{category.count}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Featured Courses */}
        {selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-white mb-6">🌟 Featured Courses</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {courses.filter(course => course.featured).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 overflow-hidden hover:border-purple-400/50 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                        {course.category}
                      </span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-semibold">{course.rating}</span>
                      </div>
                    </div>
                    
                    <motion.a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-4 h-4" />
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Courses */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">
            {selectedCategory === 'all' ? '📚 All Courses' : `📚 ${categories.find(c => c.id === selectedCategory)?.name} Courses`}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group"
              >
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                  {course.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                      {course.category}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {course.title}
                  </h4>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-3 text-xs text-white/60">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-semibold">{course.rating}</span>
                    </div>
                  </div>
                  
                  <motion.a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-3 h-3" />
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
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
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-3xl font-bold text-white mb-4">🚀 Ready to Level Up?</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto text-lg">
              Join thousands of creators who've transformed their channels with these proven strategies. 
              Start your journey to content creation mastery today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://asira.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎯 Start Creating Content
              </motion.a>
              <motion.a
                href="https://newsletter.asira.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📧 Join Newsletter
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BoostAcademy;