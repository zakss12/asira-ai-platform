import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini AI with better error handling
let genAI;
let model;
let geminiAvailable = false;

try {
  if (!process.env.GEMINI_API_KEY) {
    console.info('ℹ️ GEMINI_API_KEY not configured - using fallback content generation');
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    geminiAvailable = true;
    console.info('✅ Gemini AI initialized successfully');
  }
} catch (error) {
  console.info('ℹ️ Gemini AI not available - using fallback system');
  geminiAvailable = false;
}

// Test endpoint to verify Gemini connection
router.get('/test', async (req, res) => {
  console.log('🧪 Testing Gemini AI connection...');
  
  try {
    if (!geminiAvailable || !model) {
      return res.status(500).json({
        success: false,
        message: 'AI service temporarily unavailable - please try again later',
        instructions: 'The AI content generation service is currently being configured'
      });
    }

    const result = await Promise.race([
      model.generateContent('Say "Hello from CreatorBoost AI! Gemini is working perfectly!"'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 15000))
    ]);
    
    const response = result.response.text();
    
    console.log('✅ Gemini test successful:', response);
    
    res.json({
      success: true,
      message: 'Gemini AI is working perfectly!',
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Gemini test failed:', error);
    
    let errorMessage = 'Gemini AI test failed';
    let instructions = '';
    
    if (error.message.includes('403') || error.message.includes('SERVICE_DISABLED')) {
      errorMessage = 'Generative Language API is not enabled';
      instructions = 'Please enable the Generative Language API in your Google Cloud Console';
    } else if (error.message.includes('401') || error.message.includes('UNAUTHENTICATED')) {
      errorMessage = 'Invalid API key';
      instructions = 'Please check your GEMINI_API_KEY in the .env file';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timeout';
      instructions = 'The API request timed out. Please try again.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      instructions: instructions
    });
  }
});

// Generate content using Google Gemini with improved error handling
router.post('/generate', async (req, res) => {
  console.log('📝 Content generation request received');
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { topic, niche, contentType = 'youtube', targetAudience = 'general', tone = 'engaging' } = req.body;

    // Validate input
    if (!topic || !niche) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Topic and niche are required'
      });
    }

    // Check if Gemini is available
    if (!geminiAvailable || !model) {
      console.log('⚠️ Gemini AI not available, using fallback content generation');
      const fallbackContent = createFallbackContent({ topic, niche, contentType, targetAudience, tone });
      
      return res.json({
        success: true,
        data: fallbackContent,
        fallback: true,
        message: 'Generated using fallback system (Gemini AI not available - please check your API configuration)',
        timestamp: new Date().toISOString()
      });
    }

    // Create comprehensive prompt
    const prompt = `Create comprehensive ${contentType} content about "${topic}" in the "${niche}" category.

Target Audience: ${targetAudience}
Tone: ${tone}

Please provide exactly this format:

SCRIPT:
[Write a 300-450 word engaging script with clear introduction, 3-4 main points, and strong conclusion. Include [PAUSE] and [EMPHASIS] markers for better delivery.]

TITLES:
1. [SEO optimized title under 60 characters]
2. [Second title variation]
3. [Third title variation]
4. [Fourth title variation]
5. [Fifth title variation]

HASHTAGS:
#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5 #hashtag6 #hashtag7 #hashtag8 #hashtag9 #hashtag10 #hashtag11 #hashtag12 #hashtag13 #hashtag14 #hashtag15

DESCRIPTION:
[Write a 200-250 word engaging description with key points, timestamps, call-to-action, and SEO keywords naturally integrated]

Make it highly engaging and optimized for ${contentType} platform.`;

    console.log('🤖 Sending request to Gemini AI...');
    
    try {
      // Generate content with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 30000);
      });
      
      const generatePromise = model.generateContent(prompt);
      
      const result = await Promise.race([generatePromise, timeoutPromise]);
      const response = result.response.text();
      
      console.log('✅ Gemini response received');
      console.log('📄 Response length:', response.length);

      // Parse the response into structured data
      const content = parseGeminiResponse(response, topic, niche, contentType, targetAudience, tone);

      console.log('✅ Content parsed successfully');
      console.log('📊 Parsed content:', {
        scriptLength: content.script.length,
        titlesCount: content.titles.length,
        hashtagsCount: content.hashtags.length,
        descriptionLength: content.description.length
      });

      res.json({
        success: true,
        data: content,
        timestamp: new Date().toISOString()
      });
      
    } catch (geminiError) {
      console.warn('⚠️ AI service temporarily unavailable, using fallback content generation');
      
      let errorMessage = 'Gemini AI temporarily unavailable';
      
      if (geminiError.message.includes('403') || geminiError.message.includes('SERVICE_DISABLED')) {
        errorMessage = 'AI service is being configured. Using fallback content generation.';
      } else if (geminiError.message.includes('401') || geminiError.message.includes('UNAUTHENTICATED')) {
        errorMessage = 'AI service authentication in progress. Using fallback content generation.';
      } else if (geminiError.message.includes('429')) {
        errorMessage = 'API rate limit exceeded. Please try again later.';
      } else if (geminiError.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again.';
      }
      
      // Provide fallback content
      const fallbackContent = createFallbackContent({ topic, niche, contentType, targetAudience, tone });
      
      res.json({
        success: true,
        data: fallbackContent,
        fallback: true,
        message: `Content generated successfully using fallback system`,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.warn('⚠️ Content Generation Fallback:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Failed to generate content',
      error: 'Service temporarily unavailable'
    });
  }
});

// Helper function to parse Gemini response
function parseGeminiResponse(response, topic, niche, contentType, targetAudience, tone) {
  console.log('🔍 Parsing Gemini response...');
  
  // Extract script
  let script = '';
  const scriptMatch = response.match(/SCRIPT:\s*([\s\S]*?)(?=\n\s*TITLES:|$)/i);
  if (scriptMatch) {
    script = scriptMatch[1].trim();
  }

  // Extract titles
  let titles = [];
  const titlesMatch = response.match(/TITLES:\s*([\s\S]*?)(?=\n\s*HASHTAGS:|$)/i);
  if (titlesMatch) {
    titles = titlesMatch[1]
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 5);
  }

  // Extract hashtags
  let hashtags = [];
  const hashtagsMatch = response.match(/HASHTAGS:\s*([\s\S]*?)(?=\n\s*DESCRIPTION:|$)/i);
  if (hashtagsMatch) {
    hashtags = hashtagsMatch[1]
      .split(/[\s\n]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.startsWith('#'))
      .slice(0, 15);
  }

  // Extract description
  let description = '';
  const descriptionMatch = response.match(/DESCRIPTION:\s*([\s\S]*?)$/i);
  if (descriptionMatch) {
    description = descriptionMatch[1].trim();
  }

  // Provide fallbacks if parsing fails
  if (!script) {
    script = createFallbackScript(topic, niche, targetAudience);
  }

  if (titles.length === 0) {
    titles = createFallbackTitles(topic, niche);
  }

  if (hashtags.length === 0) {
    hashtags = createFallbackHashtags(topic, niche, contentType);
  }

  if (!description) {
    description = createFallbackDescription(topic, niche, contentType);
  }

  console.log('✅ Response parsed successfully');

  return {
    script,
    titles,
    hashtags,
    description,
    metadata: {
      topic,
      niche,
      contentType,
      targetAudience,
      tone,
      generatedAt: new Date().toISOString(),
      aiModel: 'Google Gemini Pro'
    }
  };
}

// Fallback content creation functions
function createFallbackContent({ topic, niche, contentType = 'youtube', targetAudience = 'general', tone = 'engaging' }) {
  return {
    script: createFallbackScript(topic, niche, targetAudience),
    titles: createFallbackTitles(topic, niche),
    hashtags: createFallbackHashtags(topic, niche, contentType),
    description: createFallbackDescription(topic, niche, contentType),
    metadata: {
      topic,
      niche,
      contentType,
      targetAudience,
      tone,
      generatedAt: new Date().toISOString(),
      aiModel: 'Fallback System'
    }
  };
}

function createFallbackScript(topic, niche, targetAudience) {
  return `Welcome to our comprehensive guide on ${niche}! 

[EMPHASIS] This is exactly what you need to know [EMPHASIS] to get started with ${topic}.

Today, we're diving deep into the world of ${niche}, and I'm going to share some incredible insights that will transform your understanding of ${topic}.

[PAUSE] Let's start with the fundamentals. [PAUSE]

First, understanding ${niche} is crucial because it directly impacts how you approach ${topic}. Many people overlook this connection, but it's the foundation of success.

Second, the practical applications are endless. Whether you're a beginner or have some experience, these strategies will take your ${topic} game to the next level.

Third, let's talk about common mistakes. I see people making these errors all the time, and they're completely avoidable once you know what to look for.

[EMPHASIS] Here's the key insight [EMPHASIS]: Success in ${niche} comes from consistent action and smart strategy, not just knowledge.

Finally, your next steps are simple but powerful. Start implementing these concepts today, and you'll see results faster than you ever imagined.

What's your biggest challenge with ${topic}? Drop a comment below and let me know! Don't forget to subscribe for more ${niche} content that actually works.

[PAUSE] Until next time, keep creating amazing content! [PAUSE]`;
}

function createFallbackTitles(topic, niche) {
  return [
    `Ultimate ${niche} Guide: Master ${topic} in 2024`,
    `${topic} Secrets: What Nobody Tells You About ${niche}`,
    `How to Dominate ${niche} with ${topic} (Step by Step)`,
    `${niche} Breakthrough: ${topic} Made Simple`,
    `The Truth About ${topic} in ${niche} (Must Watch)`
  ];
}

function createFallbackHashtags(topic, niche, contentType) {
  const baseHashtags = [
    `#${niche.replace(/\s+/g, '')}`,
    `#${topic.replace(/\s+/g, '')}`,
    `#${contentType}`,
    '#content',
    '#creator',
    '#viral',
    '#trending',
    '#tips',
    '#tutorial',
    '#guide',
    '#howto',
    '#success',
    '#motivation',
    '#education',
    '#learning'
  ];
  
  return baseHashtags.slice(0, 15);
}

function createFallbackDescription(topic, niche, contentType) {
  return `🔥 Ready to master ${topic} in ${niche}? This comprehensive guide covers everything you need to know!

In this ${contentType}, you'll discover:
✅ Essential ${niche} fundamentals
✅ Practical ${topic} strategies  
✅ Common mistakes to avoid
✅ Pro tips for success

📍 Timestamps:
0:00 Introduction
1:30 ${niche} Basics
3:45 ${topic} Deep Dive
6:20 Practical Examples
8:15 Next Steps

💡 Found this helpful? Like, subscribe, and hit the bell for more ${niche} content!

🔗 Useful Links:
- Free ${niche} Resources: [Link]
- ${topic} Tools: [Link]
- Community: [Link]

#${niche.replace(/\s+/g, '')} #${topic.replace(/\s+/g, '')} #${contentType}`;
}

export default router;