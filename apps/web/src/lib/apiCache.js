const cacheStorage = {};

/**
 * Standard Time-To-Live (TTL) in milliseconds
 * 300,000 ms = 5 minutes
 */
export const TTL = 300000;

export const getCachedData = (key) => {
  const item = cacheStorage[key];
  if (!item) return null;

  if (Date.now() > item.expiry) {
    delete cacheStorage[key];
    return null;
  }

  return item.data;
};

export const setCachedData = (key, data, ttl = TTL) => {
  cacheStorage[key] = {
    data: data,
    expiry: Date.now() + ttl,
  };
};

export const isCacheValid = (key) => {
  const item = cacheStorage[key];
  if (!item) return false;
  return Date.now() <= item.expiry;
};

export const clearCache = (key) => {
  delete cacheStorage[key];
};

export const clearAllAppCache = () => {
  Object.keys(cacheStorage).forEach(key => {
    delete cacheStorage[key];
  });
};