import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Initialize Gemini AI with better error handling
let genAI;
let geminiAvailable = false;

try {
  if (!process.env.GEMINI_API_KEY) {
    console.info('ℹ️ GEMINI_API_KEY not configured - using fallback thumbnail generation');
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiAvailable = true;
    console.info('✅ Gemini AI initialized for thumbnail generation');
  }
} catch (error) {
  console.info('ℹ️ Gemini AI not available for thumbnails - using fallback system');
  geminiAvailable = false;
}

// Generate thumbnail concept using Gemini with improved error handling
router.post('/generate-concept', async (req, res) => {
  try {
    console.log('🎨 Thumbnail concept request received:', req.body);
    
    const { title, style = 'modern', description = '' } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Check if Gemini is available
    if (!geminiAvailable || !genAI) {
      console.info('ℹ️ Using fallback thumbnail concept generation');
      
      const fallbackConcept = generateFallbackConcept(title, style, description);
      
      return res.json({
        success: true,
        data: {
          concept: fallbackConcept,
          title,
          style,
          fallback: true,
          message: 'Thumbnail concept generated successfully',
          generatedAt: new Date().toISOString(),
          aiModel: 'Fallback System'
        }
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a detailed thumbnail concept for a YouTube video titled "${title}". ${description}

Style: ${style}

Generate a comprehensive thumbnail concept including:
1. Visual composition description
2. Color scheme recommendations
3. Text placement and hierarchy
4. Background elements
5. Emotional appeal strategy
6. Click-through rate optimization tips

Requirements:
- High contrast and vibrant colors
- Clear, readable text overlay
- Professional quality design
- Eye-catching and click-worthy
- 16:9 aspect ratio optimization
- Mobile-friendly visibility
- Platform algorithm optimization

Provide specific design instructions that can be implemented programmatically.`;

    console.log('🤖 Generating thumbnail concept with Gemini AI...');
    
    try {
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 20000))
      ]);
      
      const concept = result.response.text();

      console.log('✅ Thumbnail concept generated successfully');
      res.json({
        success: true,
        data: {
          concept,
          title,
          style,
          generatedAt: new Date().toISOString(),
          aiModel: 'Google Gemini Pro'
        }
      });
      
    } catch (geminiError) {
      console.info('ℹ️ Using fallback thumbnail concept generation');
      
      const fallbackConcept = generateFallbackConcept(title, style, description);
      
      res.json({
        success: true,
        data: {
          concept: fallbackConcept,
          title,
          style,
          fallback: true,
          message: 'Thumbnail concept generated successfully',
          generatedAt: new Date().toISOString(),
          aiModel: 'Fallback System'
        }
      });
    }

  } catch (error) {
    console.warn('⚠️ Thumbnail Generation Fallback:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate thumbnail concept',
      error: 'Service temporarily unavailable'
    });
  }
});

// Generate custom thumbnail using SVG (Canvas replacement)
router.post('/generate-custom', async (req, res) => {
  try {
    console.log('🖼️ Custom thumbnail generation request received:', req.body);
    
    const { 
      title, 
      subtitle = '', 
      style = 'modern',
      colorScheme = 'purple',
      fontSize = 'large',
      backgroundType = 'gradient'
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    // Generate SVG thumbnail instead of Canvas
    const svgContent = generateSVGThumbnail({
      title,
      subtitle,
      style,
      colorScheme,
      fontSize,
      backgroundType
    });

    // Create uploads directory
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save SVG file
    const filename = `thumbnail-${Date.now()}.svg`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, svgContent);

    console.log('✅ Custom thumbnail generated successfully');
    res.json({
      success: true,
      data: {
        imageUrl: `/uploads/${filename}`,
        filename,
        title,
        style,
        colorScheme,
        generatedAt: new Date().toISOString(),
        format: 'SVG'
      }
    });

  } catch (error) {
    console.error('❌ Custom Thumbnail Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate custom thumbnail',
      error: error.message
    });
  }
});

// Generate thumbnail variations
router.post('/generate-variations', async (req, res) => {
  try {
    console.log('🎨 Thumbnail variations request received:', req.body);
    
    const { title, count = 3 } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const variations = [];
    const styles = ['modern', 'gaming', 'tech', 'minimal'];
    const colorSchemes = ['purple', 'blue', 'red', 'green', 'orange'];

    // Create uploads directory
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (let i = 0; i < count; i++) {
      const style = styles[i % styles.length];
      const colorScheme = colorSchemes[i % colorSchemes.length];
      
      // Generate SVG thumbnail variation
      const svgContent = generateSVGThumbnail({
        title,
        subtitle: `Variation ${i + 1}`,
        style,
        colorScheme,
        fontSize: 'large',
        backgroundType: 'gradient'
      });

      // Save variation
      const filename = `thumbnail-variation-${i + 1}-${Date.now()}.svg`;
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, svgContent);

      variations.push({
        imageUrl: `/uploads/${filename}`,
        filename,
        style,
        colorScheme,
        variation: i + 1
      });
    }

    console.log('✅ Thumbnail variations generated successfully');
    res.json({
      success: true,
      data: {
        variations,
        title,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Thumbnail Variations Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate thumbnail variations',
      error: error.message
    });
  }
});

// Helper functions
function generateFallbackConcept(title, style, description) {
  return `# Thumbnail Concept for "${title}"

## Visual Composition
- **Layout**: Bold, attention-grabbing design with clear focal points
- **Main Element**: Large, readable title text as the primary focus
- **Secondary Elements**: Supporting graphics and visual elements
- **Balance**: Rule of thirds composition for optimal visual appeal

## Color Scheme (${style} style)
- **Primary Colors**: High-contrast colors for maximum visibility
- **Background**: Gradient or solid background that complements the content
- **Text Colors**: White or bright colors with dark outlines for readability
- **Accent Colors**: Bright, eye-catching colors for highlights and CTAs

## Text Placement & Hierarchy
- **Main Title**: Large, bold font positioned in the upper two-thirds
- **Font Size**: 80-120px for main title to ensure mobile readability
- **Font Weight**: Bold or extra-bold for maximum impact
- **Text Effects**: Drop shadow or outline for better contrast

## Background Elements
- **Style**: ${style} design aesthetic
- **Patterns**: Subtle geometric patterns or gradients
- **Graphics**: Relevant icons or illustrations related to the content
- **Branding**: Small logo or channel branding in corner

## Emotional Appeal Strategy
- **Colors**: Use warm, inviting colors to create positive emotions
- **Imagery**: Include relatable visual elements
- **Typography**: Choose fonts that match the content tone
- **Composition**: Create visual flow that guides the eye

## Click-Through Rate Optimization
- **Contrast**: High contrast between text and background
- **Curiosity**: Visual elements that create intrigue
- **Clarity**: Clear, easy-to-read text even on mobile devices
- **Uniqueness**: Stand out from similar content in the same niche

## Technical Specifications
- **Aspect Ratio**: 16:9 (1280x720px recommended)
- **File Format**: JPG or PNG for best compatibility
- **File Size**: Under 2MB for fast loading
- **Mobile Optimization**: Ensure readability on small screens

## Implementation Notes
- Use high-quality graphics and avoid pixelation
- Test thumbnail visibility at different sizes
- Consider A/B testing different variations
- Ensure compliance with platform guidelines`;
}

function getColorScheme(scheme) {
  const schemes = {
    purple: { primary: '#8B5CF6', secondary: '#1F2937', accent: '#F59E0B' },
    blue: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981' },
    red: { primary: '#EF4444', secondary: '#DC2626', accent: '#F59E0B' },
    green: { primary: '#10B981', secondary: '#059669', accent: '#8B5CF6' },
    orange: { primary: '#F59E0B', secondary: '#D97706', accent: '#EF4444' }
  };
  return schemes[scheme] || schemes.purple;
}

function getFontSize(size) {
  const sizes = {
    small: { title: 80, subtitle: 40 },
    medium: { title: 100, subtitle: 50 },
    large: { title: 120, subtitle: 60 },
    xlarge: { title: 140, subtitle: 70 }
  };
  return sizes[size] || sizes.medium;
}

function generateSVGThumbnail({ title, subtitle, style, colorScheme, fontSize, backgroundType }) {
  const colors = getColorScheme(colorScheme);
  const fontSizes = getFontSize(fontSize);
  const width = 1280;
  const height = 720;

  // Split title into lines for better fitting
  const titleWords = title.split(' ');
  const titleLines = [];
  let currentLine = '';
  
  for (const word of titleWords) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    if (testLine.length > 20 && currentLine) {
      titleLines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) titleLines.push(currentLine);

  // Generate background based on type
  let backgroundDef = '';
  if (backgroundType === 'gradient') {
    backgroundDef = `
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg-gradient)" />`;
  } else {
    backgroundDef = `<rect width="${width}" height="${height}" fill="${colors.primary}" />`;
  }

  // Add style-specific elements
  let styleElements = '';
  switch (style) {
    case 'modern':
      styleElements = `
        <rect x="0" y="0" width="${width * 0.3}" height="${height}" fill="${colors.accent}" opacity="0.3" />
        <rect x="${width * 0.7}" y="0" width="${width * 0.3}" height="${height}" fill="${colors.accent}" opacity="0.3" />`;
      break;
    case 'gaming':
      styleElements = `
        <polygon points="0,0 200,0 150,${height} 0,${height}" fill="${colors.accent}" opacity="0.6" />`;
      break;
    case 'minimal':
      styleElements = `
        <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="${colors.accent}" stroke-width="10" />`;
      break;
    case 'tech':
      styleElements = `
        <line x1="100" y1="100" x2="300" y2="200" stroke="${colors.accent}" stroke-width="3" opacity="0.8" />
        <line x1="200" y1="150" x2="400" y2="100" stroke="${colors.accent}" stroke-width="3" opacity="0.8" />
        <line x1="300" y1="250" x2="500" y2="300" stroke="${colors.accent}" stroke-width="3" opacity="0.8" />`;
      break;
  }

  // Generate title text elements
  const titleY = height / 2 - (titleLines.length * fontSizes.title * 0.6);
  const titleElements = titleLines.map((line, index) => {
    const y = titleY + (index * fontSizes.title * 1.2);
    return `
      <text x="${width / 2}" y="${y}" 
            font-family="Arial, sans-serif" 
            font-size="${fontSizes.title}" 
            font-weight="bold" 
            fill="white" 
            text-anchor="middle"
            stroke="black" 
            stroke-width="6">${line}</text>`;
  }).join('');

  // Subtitle element
  const subtitleElement = subtitle ? `
    <text x="${width / 2}" y="${titleY + (titleLines.length * fontSizes.title * 1.2) + 40}" 
          font-family="Arial, sans-serif" 
          font-size="${fontSizes.subtitle}" 
          fill="${colors.accent}" 
          text-anchor="middle">${subtitle}</text>` : '';

  // Branding element
  const brandingElement = `
    <rect x="${width - 200}" y="50" width="180" height="60" fill="rgba(255,255,255,0.9)" rx="10" />
    <text x="${width - 110}" y="85" 
          font-family="Arial, sans-serif" 
          font-size="24" 
          font-weight="bold" 
          fill="${colors.primary}" 
          text-anchor="middle">CreatorBoost</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  ${backgroundDef}
  ${styleElements}
  ${titleElements}
  ${subtitleElement}
  ${brandingElement}
</svg>`;
}

export default router;