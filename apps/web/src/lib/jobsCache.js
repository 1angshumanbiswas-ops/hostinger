export const setCachedJobs = (key, data, ttlHours = 1) => {
  try {
    const now = new Date();
    const item = {
      data: data,
      expiry: now.getTime() + ttlHours * 60 * 60 * 1000,
    };
    localStorage.setItem(`jobs_cache_${key}`, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

export const getCachedJobs = (key) => {
  try {
    const itemStr = localStorage.getItem(`jobs_cache_${key}`);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(`jobs_cache_${key}`);
      return null;
    }
    return item.data;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

export const isCacheValid = (key) => {
  return getCachedJobs(key) !== null;
};

export const clearJobsCache = (key) => {
  if (key) {
    localStorage.removeItem(`jobs_cache_${key}`);
  } else {
    // Clear all jobs cache if no key provided
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('jobs_cache_')) {
        localStorage.removeItem(k);
      }
    });
  }
};