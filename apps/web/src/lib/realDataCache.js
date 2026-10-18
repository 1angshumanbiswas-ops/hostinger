export const TTL_SHORT = 60000; // 60 seconds for live stock data
export const TTL_LONG = 3600000; // 1 hour for historical/economic data

export const getCachedData = (key, allowStale = false) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    
    // If allowStale is true, we return the data even if expired (useful for fallbacks)
    if (Date.now() > parsed.expiry && !allowStale) {
      return null;
    }
    return parsed.data;
  } catch (e) {
    console.warn(`Cache read error for key: ${key}`, e);
    return null;
  }
};

export const setCachedData = (key, data, ttl = TTL_SHORT) => {
  try {
    const item = {
      data,
      expiry: Date.now() + ttl,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.warn("Cache storage failed. Quota exceeded or private browsing?", e);
  }
};

export const clearCache = (keyPattern) => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(keyPattern)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn("Failed to clear cache", e);
  }
};