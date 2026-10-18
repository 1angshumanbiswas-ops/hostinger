import { format } from 'date-fns';
import { PLATFORM_THEMES, getThemeForPlatform } from './platformImageThemes';

export const KEYWORDS = ["HR Recruitment", "Work From Home", "Remote Job", "Freshers Welcome", "₹28,000-₹85,000"];

export const ENGAGEMENT_SCORING_WEIGHTS = {
  headline: 20,
  cta: 20,
  emotional: 15,
  urgency: 15,
  socialProof: 15,
  keywords: 15
};

export const getEngagementScoreColor = (score) => {
  if (score < 50) return "text-red-500";
  if (score < 75) return "text-yellow-500";
  return "text-green-500";
};

export const formatEngagementScore = (score) => {
  return `${Math.round(score)}/100`;
};

export const getOptimizationImpactLabel = (percentage) => {
  if (percentage >= 20) return "High Impact";
  if (percentage >= 10) return "Medium Impact";
  return "Low Impact";
};

// Exporting Themes and Helper Functions
export { PLATFORM_THEMES };

export const getPlatformTheme = (platform) => {
  return getThemeForPlatform(platform);
};

export const getThemeDescription = (platform) => {
  const theme = getThemeForPlatform(platform);
  return theme?.description || "Standard job related imagery.";
};

export const getThemeKeywords = (platform) => {
   const theme = getThemeForPlatform(platform);
   return theme?.searchTerms || [];
};

// --- AI Image Selection Helpers ---

export const analyzeAdCopyKeywords = (adCopy) => {
  if (!adCopy) return [];
  const text = typeof adCopy === 'string' ? adCopy.toLowerCase() : JSON.stringify(adCopy).toLowerCase();
  
  const keywordMap = {
    "remote": ["remote work", "home office", "laptop", "digital nomad"],
    "hiring": ["hiring", "job interview", "handshake", "team"],
    "urgent": ["hourglass", "running", "fast pace", "clock"],
    "growth": ["stairs", "mountain top", "graph rising", "success"],
    "team": ["diverse team", "meeting", "collaboration", "high five"],
    "professional": ["suit", "office building", "conference", "presentation"],
    "money": ["money", "coins", "wallet", "calculator"],
    "creative": ["art", "design", "colors", "paint"],
    "technology": ["code", "computer", "server", "futuristic"]
  };

  const foundKeywords = [];
  Object.keys(keywordMap).forEach(key => {
    if (text.includes(key)) {
      foundKeywords.push(...keywordMap[key]);
    }
  });

  return [...new Set(foundKeywords)]; // Unique keywords
};

export const determinePlatformTheme = (platform) => {
  // Returns specific visual style keywords based on platform
  const styles = {
    linkedin: ["professional", "corporate", "clean", "bright"],
    instagram: ["aesthetic", "minimalist", "lifestyle", "vibrant"],
    facebook: ["community", "people", "warm", "engaging"],
    whatsapp: ["direct", "simple", "clear", "communicative"],
    twitter: ["news", "minimal", "flat", "iconic"],
    snapchat: ["fun", "colorful", "vertical", "candid"],
    youtube: ["thumbnail", "bold", "high-contrast", "expressive"]
  };
  return styles[platform] || ["business"];
};

export const calculateRelevanceScore = (adCopyKeywords, imageTags) => {
  // Simple scoring: Intersection of derived keywords vs image tags (simulated)
  if (!adCopyKeywords.length) return 50; // Neutral score
  return Math.min(60 + (adCopyKeywords.length * 5), 98); 
};

export const getDefaultImageForPlatform = (platform) => {
  const theme = getThemeForPlatform(platform);
  return theme?.fallbackImages?.[0] || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200';
};

// --- End AI Helpers ---

export const PLATFORM_CONFIGS = {
  linkedin: {
    color: '#0A66C2',
    name: 'LinkedIn',
    icon: 'Linkedin',
    metrics: ['Comments', 'Likes', 'Shares', 'Clicks'],
    limit: 3000
  },
  instagram: {
    color: '#E4405F',
    name: 'Instagram',
    icon: 'Instagram',
    metrics: ['Likes', 'Comments', 'Shares', 'Saves'],
    limit: 2200
  },
  facebook: {
    color: '#1877F2',
    name: 'Facebook',
    icon: 'Facebook',
    metrics: ['Reactions', 'Comments', 'Shares', 'Clicks'],
    limit: 63206
  },
  whatsapp: {
    color: '#25D366',
    name: 'WhatsApp',
    icon: 'MessageCircle',
    metrics: ['Replies', 'Forwards', 'Clicks'],
    limit: 65536
  },
  twitter: {
    color: '#1DA1F2',
    name: 'Twitter',
    icon: 'Twitter',
    metrics: ['Retweets', 'Likes', 'Replies', 'Impressions'],
    limit: 280
  },
  snapchat: {
    color: '#FFFC00',
    name: 'Snapchat',
    icon: 'Ghost',
    metrics: ['Views', 'Screenshots', 'Replies'],
    limit: 150
  },
  youtube: {
    color: '#FF0000',
    name: 'YouTube',
    icon: 'Youtube',
    metrics: ['Views', 'Likes', 'Comments', 'Subscribers'],
    limit: 5000 // Description limit
  }
};

export const TEMPLATES = [
  { id: 'corporate', name: 'Corporate', description: 'Professional and clean' },
  { id: 'gradient', name: 'Gradient', description: 'Modern and colorful' },
  { id: 'minimalist', name: 'Minimalist', description: 'Simple and direct' },
  { id: 'lifestyle', name: 'Lifestyle', description: 'Photo-centric layout' }
];

export const COLOR_SCHEMES = [
  { id: 'blue', name: 'Ocean Blue', colors: ['#0A66C2', '#004182'] },
  { id: 'purple', name: 'Vivid Purple', colors: ['#833AB4', '#F56040'], isGradient: true },
  { id: 'dark', name: 'Midnight', colors: ['#1e3a8a', '#172554'] },
  { id: 'green', name: 'Forest', colors: ['#115e59', '#0f766e'] }
];

export const getColorScheme = (platform) => {
  const defaults = {
    linkedin: 'blue',
    instagram: 'purple',
    facebook: 'dark',
    whatsapp: 'green',
    twitter: 'blue',
    snapchat: 'purple', // Fun defaults
    youtube: 'dark'
  };
  const id = defaults[platform] || 'blue';
  return COLOR_SCHEMES.find(s => s.id === id) || COLOR_SCHEMES[0];
};

export const calculateEngagement = (data) => {
  if (!data) return 0;
  return Object.values(data).reduce((acc, val) => {
    const num = parseInt(val);
    return isNaN(num) ? acc : acc + num;
  }, 0);
};