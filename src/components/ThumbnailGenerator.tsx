import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image, Download, Palette, Type, Zap, Loader, Sparkles, AlertCircle } from 'lucide-react';

interface ThumbnailData {
  title: string;
  description: string;
  style: string;
  color: string;
  font: string;
  concept?: string;
}

const ThumbnailGenerator: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cta, setCta] = useState('');
  const [style, setStyle] = useState('modern');
  const [color, setColor] = useState('purple');
  const [font, setFont] = useState('bold');
  const [generating, setGenerating] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [concept, setConcept] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const styles = [
    { id: 'modern', name: 'Modern', preview: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'gaming', name: 'Gaming', preview: 'bg-gradient-to-br from-red-500 to-orange-500' },
    { id: 'tech', name: 'Tech', preview: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { id: 'minimal', name: 'Minimal', preview: 'bg-gradient-to-br from-gray-700 to-gray-900' }
  ];

  const colors = [
    { id: 'purple', name: 'Purple', value: '#8B5CF6' },
    { id: 'blue', name: 'Blue', value: '#3B82F6' },
    { id: 'green', name: 'Green', value: '#10B981' },
    { id: 'red', name: 'Red', value: '#EF4444' },
    { id: 'orange', name: 'Orange', value: '#F59E0B' },
    { id: 'pink', name: 'Pink', value: '#EC4899' }
  ];

  const fonts = [
    { id: 'bold', name: 'Bold Impact' },
    { id: 'modern', name: 'Modern Sans' },
    { id: 'playful', name: 'Playful' },
    { id: 'elegant', name: 'Elegant' }
  ];

  const generateConcept = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/thumbnail/generate-concept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          style,
          description: description.trim()
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setConcept(data.data.concept);
        console.log('✅ Thumbnail concept generated');
      } else {
        throw new Error(data.message || 'Failed to generate concept');
      }
    } catch (error) {
      console.error('❌ Error generating concept:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate concept');
      
      // Fallback concept
      setConcept(`Create a ${style} style thumbnail for "${title}". Use ${color} as the primary color with bold, readable text. ${description ? `Focus on: ${description}` : 'Make it eye-catching and click-worthy.'}`);
    }
  };

  const generateThumbnail = async () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    setError(null);
    setGenerating(true);
    
    // Generate concept first if not already generated
    if (!concept) {
      await generateConcept();
    }
    
    // Simulate generation delay
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (YouTube thumbnail ratio)
      canvas.width = 1280;
      canvas.height = 720;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const selectedColor = colors.find(c => c.id === color)?.value || '#8B5CF6';
      
      if (style === 'modern') {
        gradient.addColorStop(0, selectedColor);
        gradient.addColorStop(1, '#1F2937');
      } else if (style === 'gaming') {
        gradient.addColorStop(0, '#EF4444');
        gradient.addColorStop(1, '#F59E0B');
      } else if (style === 'tech') {
        gradient.addColorStop(0, '#3B82F6');
        gradient.addColorStop(1, '#06B6D4');
      } else {
        gradient.addColorStop(0, '#374151');
        gradient.addColorStop(1, '#111827');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add style-specific elements
      if (style === 'modern') {
        // Add geometric shapes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(200, 150, 100, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(1080, 570, 80, 0, 2 * Math.PI);
        ctx.fill();
      } else if (style === 'gaming') {
        // Add angular elements
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(300, 0);
        ctx.lineTo(200, 200);
        ctx.lineTo(0, 150);
        ctx.fill();
      }

      // Add title text
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
      
      let fontSize = 120;
      if (font === 'bold') {
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      } else if (font === 'modern') {
        ctx.font = `${fontSize}px 'Helvetica Neue', sans-serif`;
      } else if (font === 'playful') {
        ctx.font = `bold ${fontSize}px Comic Sans MS, cursive`;
      } else {
        ctx.font = `${fontSize}px Georgia, serif`;
      }

      // Word wrap for title
      const words = title.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 100 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      // Draw title
      const lineHeight = fontSize * 1.2;
      const startY = (canvas.height - (lines.length * lineHeight)) / 2;
      
      lines.forEach((line, index) => {
        const x = canvas.width / 2;
        const y = startY + (index * lineHeight);
        
        ctx.textAlign = 'center';
        ctx.strokeText(line, x, y);
        ctx.fillText(line, x, y);
      });

      // Add CTA if provided
      if (cta.trim()) {
        ctx.font = 'bold 60px Arial, sans-serif';
        ctx.fillStyle = selectedColor;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        
        const ctaY = canvas.height - 100;
        ctx.strokeText(cta, canvas.width / 2, ctaY);
        ctx.fillText(cta, canvas.width / 2, ctaY);
      }

      // Add branding
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(canvas.width - 200, 30, 180, 50);
      ctx.fillStyle = selectedColor;
      ctx.textAlign = 'center';
      ctx.fillText('Asira AI', canvas.width - 110, 60);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setThumbnailUrl(dataUrl);
      setGenerating(false);
    }, 2000);
  };

  const downloadThumbnail = () => {
    if (!thumbnailUrl) return;
    
    const link = document.createElement('a');
    link.download = `thumbnail-${title.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = thumbnailUrl;
    link.click();
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
            AI <span className="text-purple-400">Thumbnail Generator</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Create eye-catching YouTube thumbnails that boost your click-through rates 
            using AI-powered design suggestions and professional templates.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Controls */}
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

              {/* Description Input */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Thumbnail Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you want the thumbnail to look like or represent..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-none"
                />
                <p className="text-white/50 text-xs mt-2">
                  💡 Example: "Show a person looking surprised with tech gadgets in the background"
                </p>
              </div>

              {/* CTA Input */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Call to Action (Optional)
                </label>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g., WATCH NOW, FREE GUIDE, etc."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              {/* Style Selection */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Thumbnail Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {styles.map((styleOption) => (
                    <button
                      key={styleOption.id}
                      onClick={() => setStyle(styleOption.id)}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        style === styleOption.id
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-full h-16 rounded-lg mb-2 ${styleOption.preview}`}></div>
                      <span className="text-white text-sm">{styleOption.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Primary Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((colorOption) => (
                    <button
                      key={colorOption.id}
                      onClick={() => setColor(colorOption.id)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
                        color === colorOption.id
                          ? 'border-white scale-110'
                          : 'border-white/30 hover:scale-105'
                      }`}
                      style={{ backgroundColor: colorOption.value }}
                    />
                  ))}
                </div>
              </div>

              {/* Font Selection */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Font Style
                </label>
                <div className="space-y-2">
                  {fonts.map((fontOption) => (
                    <button
                      key={fontOption.id}
                      onClick={() => setFont(fontOption.id)}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 text-left ${
                        font === fontOption.id
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-white/20 bg-white/5 hover:bg-white/10 text-white/80'
                      }`}
                    >
                      {fontOption.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={generateConcept}
                  disabled={!title.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Generate AI Concept</span>
                  </span>
                </motion.button>

                <motion.button
                  onClick={generateThumbnail}
                  disabled={generating || !title.trim()}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {generating ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Generating Thumbnail...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Generate Thumbnail</span>
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* AI Concept */}
              {concept && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span>AI Concept</span>
                  </h3>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <p className="text-blue-200 text-sm leading-relaxed">{concept}</p>
                  </div>
                </div>
              )}

              {/* Thumbnail Preview */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Preview</h3>
                  {thumbnailUrl && (
                    <button
                      onClick={downloadThumbnail}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}
                </div>

                <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden">
                  {thumbnailUrl ? (
                    <img 
                      src={thumbnailUrl} 
                      alt="Generated thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Image className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <p className="text-white/50">Your thumbnail will appear here</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hidden canvas for generation */}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-300 font-semibold mb-2">💡 Thumbnail Tips</h4>
                <ul className="text-blue-200/80 text-sm space-y-1">
                  <li>• Keep text large and readable on mobile devices</li>
                  <li>• Use high contrast colors for better visibility</li>
                  <li>• Include faces or emotions when possible</li>
                  <li>• Test different styles to see what works for your audience</li>
                  <li>• Use the AI concept to guide your design decisions</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThumbnailGenerator;