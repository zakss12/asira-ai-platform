import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader, Shield, Sparkles, AlertCircle } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onAuthSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  onModeChange, 
  onAuthSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
      }

      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(mode === 'signup' && { name: formData.name })
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        onAuthSuccess(data.data.user);
        onClose();
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (user: any) => {
    onAuthSuccess(user);
    onClose();
  };

  const handleGoogleError = () => {
    setError('Google login is currently in progress. Please try again shortly.');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20 pb-20">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Container with proper centering */}
        <div className="relative w-full max-w-md mx-auto flex items-center justify-center min-h-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Header with gradient */}
              <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 text-center">
                <div className="absolute inset-0 bg-black/20"></div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm z-10"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
                
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    {mode === 'login' ? (
                      <Shield className="w-8 h-8 text-white" />
                    ) : (
                      <Sparkles className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {mode === 'login' ? 'Welcome Back!' : 'Join CreatorBoost'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {mode === 'login' 
                      ? 'Sign in to access your dashboard and analytics' 
                      : 'Create your account and start growing your channel'
                    }
                  </p>
                </div>
              </div>

              <div className="p-6">
                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Google Auth */}
                <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <span className="px-3 text-white/50 text-xs font-medium">or continue with email</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-white/90 text-sm font-semibold mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm text-sm"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-white/90 text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm text-sm"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-semibold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm text-sm"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-white/90 text-sm font-semibold mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm text-sm"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                      </span>
                    ) : (
                      mode === 'login' ? 'Sign In to Dashboard' : 'Create My Account'
                    )}
                  </motion.button>
                </form>

                {/* Switch Mode */}
                <div className="mt-6 text-center">
                  <p className="text-white/60 text-sm">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <button
                    onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
                    className="mt-1 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    {mode === 'login' ? 'Create Account' : 'Sign In Instead'}
                  </button>
                </div>

                {/* Features Preview */}
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20"
                  >
                    <h4 className="text-white font-semibold mb-2 text-sm">🚀 What you'll get:</h4>
                    <ul className="text-white/70 text-xs space-y-1">
                      <li>• AI-powered content generation</li>
                      <li>• Real YouTube analytics & insights</li>
                      <li>• Trending niche discovery</li>
                      <li>• Professional thumbnail creator</li>
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;