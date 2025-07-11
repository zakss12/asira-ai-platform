import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Youtube, CheckCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';

interface YouTubeConnectProps {
  user: any;
  onChannelConnected: (channelData: any) => void;
}

const YouTubeConnect: React.FC<YouTubeConnectProps> = ({ user, onChannelConnected }) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [channelData, setChannelData] = useState<any>(null);
  const [error, setError] = useState('');

  const connectYouTube = async () => {
    setConnecting(true);
    setError('');

    try {
      // Get YouTube OAuth URL
      const response = await fetch('http://localhost:3001/api/youtube/auth', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Open YouTube OAuth in popup
        const popup = window.open(
          data.authUrl,
          'youtube-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Listen for popup to close
        const checkClosed = setInterval(async () => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            
            // Check if YouTube was connected successfully
            try {
              const channelResponse = await fetch('http://localhost:3001/api/youtube/channel', {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
              });
              
              const channelData = await channelResponse.json();
              
              if (channelData.success) {
                setChannelData(channelData.data);
                setConnected(true);
                onChannelConnected(channelData.data);
              } else {
                setError('Failed to connect YouTube channel');
              }
            } catch (error) {
              setError('Failed to verify YouTube connection');
            }
            
            setConnecting(false);
          }
        }, 1000);
      } else {
        throw new Error(data.message || 'Failed to get YouTube auth URL');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect YouTube');
      setConnecting(false);
    }
  };

  const disconnectYouTube = async () => {
    try {
      await fetch('http://localhost:3001/api/youtube/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      setConnected(false);
      setChannelData(null);
    } catch (error) {
      console.error('Failed to disconnect YouTube:', error);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
          <Youtube className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">YouTube Channel</h3>
          <p className="text-white/70">Connect your channel for analytics and insights</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}

      {connected && channelData ? (
        <div className="space-y-4">
          {/* Connected Channel Info */}
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">Channel Connected</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <img 
                src={channelData.thumbnail} 
                alt={channelData.title}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="text-white font-semibold">{channelData.title}</h4>
                <p className="text-white/70 text-sm">{channelData.subscriberCount} subscribers</p>
                <p className="text-white/70 text-sm">{channelData.videoCount} videos</p>
              </div>
            </div>
          </div>

          {/* Channel Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-xl font-bold text-white">{channelData.viewCount?.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Total Views</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-xl font-bold text-white">{channelData.subscriberCount?.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Subscribers</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-xl font-bold text-white">{channelData.videoCount?.toLocaleString()}</div>
              <div className="text-white/60 text-sm">Videos</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <motion.button
              onClick={() => window.open(`https://youtube.com/channel/${channelData.id}`, '_blank')}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Channel</span>
            </motion.button>
            
            <motion.button
              onClick={disconnectYouTube}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Disconnect
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4">
            <Youtube className="w-16 h-16 text-white/30 mx-auto mb-3" />
            <p className="text-white/70 mb-2">Connect your YouTube channel to unlock:</p>
            <ul className="text-white/60 text-sm space-y-1">
              <li>• Real-time analytics and insights</li>
              <li>• Performance tracking and trends</li>
              <li>• AI-powered growth recommendations</li>
              <li>• Automated content optimization</li>
            </ul>
          </div>

          <motion.button
            onClick={connectYouTube}
            disabled={connecting}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {connecting ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Connecting to YouTube...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <Youtube className="w-5 h-5" />
                <span>Connect YouTube Channel</span>
              </span>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default YouTubeConnect;