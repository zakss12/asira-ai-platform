import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import route modules
import contentRoutes from './routes/content.js';
import analyticsRoutes from './routes/analytics.js';
import trendsRoutes from './routes/trends.js';
import thumbnailRoutes from './routes/thumbnail.js';
import videoRoutes from './routes/video.js';
import authRoutes from './routes/auth.js';
import youtubeRoutes from './routes/youtube.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting CreatorBoost AI Server...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔑 Gemini API Key:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('🔑 Google Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration - FIXED
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint - IMPROVED
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    geminiConnected: !!process.env.GEMINI_API_KEY,
    googleOAuthConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    server: 'CreatorBoost AI v1.0'
  });
});

// Test endpoint - IMPROVED
app.get('/api/test', (req, res) => {
  console.log('🧪 Test endpoint called');
  res.json({
    success: true,
    message: 'CreatorBoost AI API is working perfectly!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/health',
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/google/url',
      'POST /api/content/generate',
      'POST /api/trends/discover-niches',
      'GET /api/analytics/channel/:id',
      'GET /api/youtube/auth',
      'GET /api/youtube/search'
    ]
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/thumbnail', thumbnailRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/youtube', youtubeRoutes);

// Error handling middleware - IMPROVED
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString()
  });
});

// 404 handler - IMPROVED
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /api/health',
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/google/url',
      'POST /api/content/generate',
      'POST /api/trends/discover-niches',
      'GET /api/youtube/auth',
      'GET /api/youtube/search'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🎉 CreatorBoost AI server is running!');
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend URL: http://localhost:5173`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('  GET  /api/health - Health check');
  console.log('  GET  /api/test - API test');
  console.log('  POST /api/auth/register - User registration');
  console.log('  POST /api/auth/login - User login');
  console.log('  GET  /api/auth/google/url - Google OAuth URL');
  console.log('  POST /api/content/generate - Generate content');
  console.log('  POST /api/trends/discover-niches - Find niches');
  console.log('  GET  /api/analytics/channel/:id - Channel analytics');
  console.log('  GET  /api/youtube/auth - YouTube OAuth');
  console.log('  GET  /api/youtube/search - Search channels');
  console.log('');
  console.log('🔥 Ready to create amazing content!');
});

export default app;