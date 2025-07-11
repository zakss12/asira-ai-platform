import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Download, Play, Loader, FileText, Mic, Image as ImageIcon, AlertCircle, ExternalLink } from 'lucide-react';

interface VideoData {
  title: string;
  script: string;
  duration: string;
  style: string;
  voiceType: string;
  videoUrl?: string;
  enhancedScript?: string;
}

const VideoGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [script, setScript] = useState('');
  const [style, setStyle] = useState('modern');
  const [voiceType, setVoiceType] = useState('professional');
  const [generating, setGenerating] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const styles = [
    { id: 'modern', name: 'Modern Slideshow', description: 'Clean slides with smooth transitions' },
    { id: 'animated', name: 'Animated Graphics', description: 'Dynamic animations and effects' },
    { id: 'minimal', name: 'Minimal Text', description: 'Simple text-based presentation' },
    { id: 'cinematic', name: 'Cinematic', description: 'Movie-style transitions and effects' }
  ];

  const voices = [
    { id: 'professional', name: 'Professional Male', sample: 'Clear, authoritative voice' },
    { id: 'friendly', name: 'Friendly Female', sample: 'Warm, approachable tone' },
    { id: 'energetic', name: 'Energetic', sample: 'High-energy, enthusiastic' },
    { id: 'calm', name: 'Calm Narrator', sample: 'Soothing, documentary-style' }
  ];

  const generateVideo = async () => {
    if (!title.trim() || !script.trim()) {
      setError('Please enter both title and script');
      return;
    }
    
    setError(null);
    setGenerating(true);
    
    try {
      // Call the video generation API
      const response = await fetch('http://localhost:3001/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          script: script.trim(),
          style,
          voiceType,
          duration: Math.ceil(script.length / 150), // Estimate duration
          backgroundColor: '#1F2937',
          textColor: '#FFFFFF'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setVideoData({
          title,
          script,
          duration: `${data.data.duration || Math.ceil(script.length / 150)}s`,
          style,
          voiceType,
          videoUrl: data.data.videoUrl,
          enhancedScript: data.data.enhancedScript
        });
        console.log('✅ Video generated successfully');
      } else {
        throw new Error(data.message || 'Failed to generate video');
      }
    } catch (error) {
      console.error('❌ Error generating video:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate video');
      
      // Create fallback video data
      setVideoData({
        title,
        script,
        duration: `${Math.ceil(script.length / 150)}s`,
        style,
        voiceType,
        enhancedScript: `Enhanced version: ${script}`
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (videoData?.videoUrl) {
      const link = document.createElement('a');
      link.download = `video-${title.replace(/\s+/g, '-').toLowerCase()}.mp4`;
      link.href = videoData.videoUrl;
      link.click();
    } else {
      alert('Video download will be available once video generation is complete. This is currently a demo version.');
    }
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
            AI <span className="text-purple-400">Video Generator</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Transform your scripts into engaging videos with AI-powered visuals, 
            voiceovers, and professional editing in minutes.
          </p>
        </motion.div>

        {/* API Requirements Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-400 mt-1" />
              <div>
                <h3 className="text-blue-300 font-semibold mb-2">🚀 Video Generation Ready</h3>
                <p className="text-blue-200/80 text-sm mb-3">
                  For full video generation with voiceovers, we can integrate:
                </p>
                <ul className="text-blue-200/80 text-sm space-y-1 mb-4">
                  <li>• <strong>ElevenLabs API</strong> - Professional AI voiceovers</li>
                  <li>• <strong>Remotion</strong> - Programmatic video generation</li>
                  <li>• <strong>FFmpeg</strong> - Video processing and rendering</li>
                  <li>• <strong>Stable Diffusion</strong> - AI-generated visuals</li>
                </ul>
                <p className="text-blue-200/80 text-sm">
                  Currently showing enhanced script generation and video preview. Ready for API integration!
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              )}

              {/* Title Input */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Video Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your video title..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              {/* Script Input */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Video Script *
                </label>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Enter your video script here..."
                  rows={8}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
                />
                <div className="mt-2 text-white/50 text-sm">
                  {script.length} characters • Estimated duration: {Math.ceil(script.length / 150)} seconds
                </div>
              </div>

              {/* Style Selection */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Video Style
                </label>
                <div className="space-y-3">
                  {styles.map((styleOption) => (
                    <button
                      key={styleOption.id}
                      onClick={() => setStyle(styleOption.id)}
                      className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                        style === styleOption.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          style === styleOption.id ? 'bg-purple-500' : 'bg-white/10'
                        }`}>
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{styleOption.name}</div>
                          <div className="text-white/60 text-sm">{styleOption.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Selection */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Voice Type
                </label>
                <div className="space-y-3">
                  {voices.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setVoiceType(voice.id)}
                      className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                        voiceType === voice.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          voiceType === voice.id ? 'bg-purple-500' : 'bg-white/10'
                        }`}>
                          <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{voice.name}</div>
                          <div className="text-white/60 text-sm">{voice.sample}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={generateVideo}
                disabled={generating || !title.trim() || !script.trim()}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {generating ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating Video...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Generate Video</span>
                  </span>
                )}
              </motion.button>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Enhanced Script */}
              {videoData?.enhancedScript && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-400" />
                    <span>AI Enhanced Script</span>
                  </h3>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl max-h-40 overflow-y-auto">
                    <p className="text-green-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {videoData.enhancedScript}
                    </p>
                  </div>
                </div>
              )}

              {/* Video Preview */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Video Preview</h3>
                  {videoData && (
                    <button
                      onClick={downloadVideo}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                </div>

                <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden relative">
                  {videoData ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900 relative">
                      {/* Video Preview Content */}
                      <div className="text-center z-10">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Play className="w-10 h-10 text-white ml-1" />
                        </div>
                        <h4 className="text-white font-bold text-xl mb-2">{videoData.title}</h4>
                        <p className="text-white/70 mb-1">Duration: {videoData.duration}</p>
                        <p className="text-white/70 mb-1">Style: {styles.find(s => s.id === videoData.style)?.name}</p>
                        <p className="text-white/70">Voice: {voices.find(v => v.id === videoData.voiceType)?.name}</p>
                      </div>
                      
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-lg animate-pulse"></div>
                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full animate-bounce"></div>
                        <div className="absolute top-1/2 left-4 w-8 h-8 bg-white rounded-lg animate-ping"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <p className="text-white/50">Your video preview will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Generation Progress */}
              {generating && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h4 className="text-white font-semibold mb-4">Generation Progress</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-green-400">Script analysis complete</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Loader className="w-4 h-4 text-white animate-spin" />
                      </div>
                      <span className="text-yellow-400">Enhancing script with AI...</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-400">Generating visuals...</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Mic className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-purple-400">Creating voiceover...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-white font-semibold mb-4">✨ Video Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80">AI-enhanced script optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80">Professional text-to-speech voiceover</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80">Automatic scene transitions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80">Background music and sound effects</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-white/80">1080p HD export quality</span>
                  </div>
                </div>
              </div>

              {/* API Integration Info */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-300 font-semibold mb-2 flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Ready for API Integration</span>
                </h4>
                <ul className="text-blue-200/80 text-sm space-y-1">
                  <li>• ElevenLabs API for professional voiceovers</li>
                  <li>• Remotion for programmatic video generation</li>
                  <li>• Stable Diffusion for AI-generated visuals</li>
                  <li>• FFmpeg for video processing and rendering</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoGenerator;