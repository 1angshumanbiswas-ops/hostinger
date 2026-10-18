import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { PLATFORM_THEMES, getThemeForPlatform, getDateBasedSeed } from '@/utils/platformImageThemes';

const STORAGE_KEY_PREFIX = 'platform_img_cache_';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const usePlatformImages = (platform) => {
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const getCacheKey = (plat) => `${STORAGE_KEY_PREFIX}${plat}`;

  const getCachedData = (plat) => {
    try {
      const key = getCacheKey(plat);
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const parsed = JSON.parse(cached);
      // Check if cache is valid (same date seed check could be added here, or just rely on timestamp)
      // For strict daily consistency, check the date seed
      const currentSeed = getDateBasedSeed(plat);
      if (parsed.seed === currentSeed && (Date.now() - parsed.timestamp < CACHE_TTL)) {
         return parsed;
      }
      return null;
    } catch (e) {
      console.error("Cache parse error", e);
      return null;
    }
  };

  const cacheImage = (plat, imageData) => {
    const key = getCacheKey(plat);
    const payload = {
      ...imageData,
      timestamp: Date.now(),
      seed: getDateBasedSeed(plat)
    };
    localStorage.setItem(key, JSON.stringify(payload));
  };

  const fetchPlatformImage = useCallback(async (forceRefresh = false) => {
    if (!platform) return;

    setLoading(true);
    setError(null);
    const theme = getThemeForPlatform(platform);

    try {
      // 1. Check cache first unless forcing refresh
      if (!forceRefresh) {
        const cached = getCachedData(platform);
        if (cached) {
          setCurrentImage(cached);
          setLastRefreshed(new Date(cached.timestamp));
          setLoading(false);
          return;
        }
      }

      // 2. Fetch from Edge Function (reusing existing fetch-job-image but with specific query)
      const randomTerm = theme.searchTerms[Math.floor(Math.random() * theme.searchTerms.length)];
      const seed = forceRefresh ? `${getDateBasedSeed(platform)}-${Date.now()}` : getDateBasedSeed(platform);

      const { data, error: funcError } = await supabase.functions.invoke('fetch-job-image', {
        body: { 
          searchQuery: randomTerm,
          dateBasedSeed: seed
        }
      });

      if (funcError) throw funcError;

      if (data) {
        const result = {
           ...data,
           themeName: theme.name,
           themeDescription: theme.description
        };
        setCurrentImage(result);
        setLastRefreshed(new Date());
        cacheImage(platform, result);
      } else {
        throw new Error("No data returned");
      }

    } catch (err) {
      console.error(`Failed to fetch image for ${platform}:`, err);
      setError(err);
      
      // Fallback
      const fallbackUrl = theme.fallbackImages[Math.floor(Math.random() * theme.fallbackImages.length)];
      const fallbackData = {
        imageUrl: fallbackUrl,
        photographer: "Curated Collection",
        source: "Fallback",
        imageId: `fallback-${Date.now()}`,
        themeName: theme.name,
        themeDescription: theme.description
      };
      setCurrentImage(fallbackData);
      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
    }
  }, [platform]);

  // Initial fetch when platform changes
  useEffect(() => {
    fetchPlatformImage();
  }, [fetchPlatformImage]);

  const refreshImage = () => fetchPlatformImage(true);
  
  const getImageForToday = () => {
      // Logic is handled by default fetch with date seed if not forced
      if (!currentImage) fetchPlatformImage(false);
      return currentImage;
  };

  return {
    currentImage,
    loading,
    error,
    lastRefreshed,
    refreshImage,
    getImageForToday,
    currentTheme: getThemeForPlatform(platform)
  };
};