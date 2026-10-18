/**
 * Free API Key Manager for Financial Data Sources
 * Handles API keys for Finnhub, Alpha Vantage, etc.
 * Implements fallback and rotation logic for free tiers.
 */

const API_KEYS = {
  finnhub: [
    import.meta.env.VITE_FINNHUB_API_KEY,
    'sandbox_key_1', // Fallback sandbox keys for development
    'sandbox_key_2'
  ].filter(Boolean),
  
  alphaVantage: [
    import.meta.env.VITE_ALPHA_VANTAGE_API_KEY,
    'demo'
  ].filter(Boolean)
};

// Track current key index for rotation
const keyIndices = {
  finnhub: 0,
  alphaVantage: 0
};

// Track usage to prevent rate limits
const usageStats = {
  finnhub: 0,
  alphaVantage: 0
};

export const getNextApiKey = (provider) => {
  const keys = API_KEYS[provider];
  if (!keys || keys.length === 0) return null;

  const currentKey = keys[keyIndices[provider]];
  usageStats[provider]++;

  // Simple rotation after 5 calls (mock logic for free tier limits)
  if (usageStats[provider] > 5) {
    keyIndices[provider] = (keyIndices[provider] + 1) % keys.length;
    usageStats[provider] = 0;
    console.log(`[API Manager] Rotated ${provider} API Key to index ${keyIndices[provider]}`);
  }

  return currentKey;
};

export const logApiError = (provider, error) => {
  console.warn(`[API Manager] Error with ${provider}: ${error.message}. Force rotating key.`);
  const keys = API_KEYS[provider];
  if (keys && keys.length > 1) {
    keyIndices[provider] = (keyIndices[provider] + 1) % keys.length;
    usageStats[provider] = 0;
  }
};