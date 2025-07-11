import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface GoogleAuthButtonProps {
  onSuccess: (user: any) => void;
  onError?: () => void;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);
    
    try {
      // Get Google OAuth URL from backend
      const response = await fetch('http://localhost:3001/api/auth/google/url');
      const data = await response.json();
      
      if (data.success) {
        // Open Google OAuth in a popup
        const popup = window.open(
          data.authUrl,
          'google-auth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Listen for the popup to close
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            setLoading(false);
            
            // Check if authentication was successful
            const token = localStorage.getItem('authToken');
            const user = localStorage.getItem('user');
            
            if (token && user) {
              onSuccess(JSON.parse(user));
            } else {
              // Call error handler if provided
              if (onError) {
                onError();
              }
            }
          }
        }, 1000);
      } else {
        throw new Error('Failed to get Google OAuth URL');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      setLoading(false);
      if (onError) {
        onError();
      }
    }
  };

  return (
    <motion.button
      onClick={handleGoogleAuth}
      disabled={loading}
      className="w-full px-6 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-semibold border border-gray-200 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? (
        <span className="flex items-center justify-center space-x-2">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Connecting to Google...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center space-x-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </span>
      )}
    </motion.button>
  );
};

export default GoogleAuthButton;