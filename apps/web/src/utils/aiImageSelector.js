import { supabase } from '@/lib/customSupabaseClient';
import { 
  analyzeAdCopyKeywords, 
  determinePlatformTheme, 
  calculateRelevanceScore, 
  getDefaultImageForPlatform
} from '@/utils/seoAppUtils';
import { getThemeForPlatform } from '@/utils/platformImageThemes';

/**
 * AI Logic to select an image based on ad copy context and platform.
 * 
 * @param {string} platform - The social media platform
 * @param {string} adCopy - The text content of the ad
 * @returns {Promise<Object>} - { imageUrl, reasoning, relevanceScore, ...metadata }
 */
export const selectImageForPlatform = async (platform, adCopy) => {
  
  // EXCLUSIONS: Skip image selection for specific platforms as per requirements
  if (['whatsapp', 'twitter', 'youtube'].includes(platform)) {
      return null;
  }
  
  // Snapchat is optional/allowed, others (LinkedIn, FB, Insta) are allowed.

  // 1. Analyze Context
  const keywords = analyzeAdCopyKeywords(adCopy);
  const platformStyles = determinePlatformTheme(platform);
  const baseTheme = getThemeForPlatform(platform);

  // 2. Formulate "AI" Query
  let searchQuery = "";
  let reasoning = "";

  if (keywords.length > 0) {
    const primaryKeyword = keywords[0]; 
    const secondaryKeyword = keywords.length > 1 ? keywords[1] : platformStyles[0];
    searchQuery = `${primaryKeyword} ${secondaryKeyword}`;
    reasoning = `Selected based on key terms "${primaryKeyword}" and "${secondaryKeyword}" found in your copy, optimized for ${platform}.`;
  } else {
    const randomThemeTerm = baseTheme.searchTerms[Math.floor(Math.random() * baseTheme.searchTerms.length)];
    searchQuery = `${randomThemeTerm} ${platformStyles[0]}`;
    reasoning = `Selected using ${platform} best practices for "${randomThemeTerm}" themes.`;
  }

  // 3. Score Relevance
  const relevanceScore = calculateRelevanceScore(keywords, null);

  try {
    // 4. Call Edge Function
    const { data, error } = await supabase.functions.invoke('fetch-job-image', {
      body: { 
        searchQuery: searchQuery,
        dateBasedSeed: `ai-${Date.now()}` 
      }
    });

    if (error) throw error;

    if (data) {
      return {
        imageUrl: data.imageUrl,
        photographer: data.photographer,
        source: data.source || "Unsplash AI",
        imageId: data.imageId,
        themeName: "AI Selected",
        reasoning: reasoning,
        relevanceScore: relevanceScore,
        isAiSelected: true,
        aiTags: [...keywords, ...platformStyles].slice(0, 3)
      };
    }
  } catch (err) {
    console.warn("AI Image Selection failed, falling back to default.", err);
  }

  // 5. Fallback
  return {
    imageUrl: getDefaultImageForPlatform(platform),
    photographer: "System Default",
    source: "Fallback",
    imageId: "default-fallback",
    themeName: "Standard Fallback",
    reasoning: "AI services unavailable; using high-performing default image.",
    relevanceScore: 40,
    isAiSelected: false
  };
};