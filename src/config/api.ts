// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      googleUrl: '/api/auth/google/url',
      profile: '/api/auth/profile'
    },
    content: {
      generate: '/api/content/generate',
      test: '/api/content/test'
    },
    trends: {
      topics: '/api/trends/topics',
      discoverNiches: '/api/trends/discover-niches',
      analyzeTrends: '/api/trends/analyze-trends'
    },
    analytics: {
      channel: '/api/analytics/channel',
      video: '/api/analytics/video'
    },
    youtube: {
      auth: '/api/youtube/auth',
      search: '/api/youtube/search',
      channel: '/api/youtube/channel'
    },
    thumbnail: {
      generateConcept: '/api/thumbnail/generate-concept',
      generateCustom: '/api/thumbnail/generate-custom'
    },
    video: {
      generate: '/api/video/generate',
      optimizeScript: '/api/video/optimize-script'
    }
  }
};

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};