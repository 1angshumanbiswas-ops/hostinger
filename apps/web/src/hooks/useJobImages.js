import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const STORAGE_KEY = 'job_image_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const SEARCH_TERMS = [
  "HR jobs", "remote work", "recruitment", "career", "office meeting", 
  "diverse team", "job interview", "professional workspace", "laptop coffee", "business handshake"
];

const FALLBACK_IMAGE = {
  imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
  photographer: "Unsplash",
  source: "Unsplash",
  imageId: "fallback-default"
};

export const useJobImages = (platform) => {
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Helper to get cached data
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      // Check if cache is valid (same date/seed) or within TTL
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return parsed;
      }
      return null;
    } catch (e) {
      console.error("Cache parse error", e);
      return null;
    }
  };

  const cacheImage = (imageData) => {
    const cachePayload = {
      ...imageData,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachePayload));
  };

  const fetchImage = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Check cache first unless forcing refresh
      if (!forceRefresh) {
        const cached = getCachedData();
        if (cached) {
          setCurrentImage(cached);
          setLastRefreshed(new Date(cached.timestamp));
          setLoading(false);
          return;
        }
      }

      // 2. Fetch from Edge Function
      const randomTerm = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
      
      const { data, error: funcError } = await supabase.functions.invoke('fetch-job-image', {
        body: { 
          searchQuery: randomTerm,
          dateBasedSeed: new Date().toISOString().split('T')[0] // Seed for daily consistency if supported
        }
      });

      if (funcError) throw funcError;

      if (data) {
        setCurrentImage(data);
        setLastRefreshed(new Date());
        cacheImage(data);
      } else {
        throw new Error("No data returned");
      }

    } catch (err) {
      console.error("Failed to fetch job image:", err);
      setError(err);
      // Fallback
      setCurrentImage(FALLBACK_IMAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  const refreshImage = () => fetchImage(true);

  const getImageForDate = () => currentImage;

  return {
    currentImage,
    loading,
    error,
    lastRefreshed,
    refreshImage,
    getImageForDate
  };
};