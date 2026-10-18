import { useState, useEffect, useCallback, useRef } from 'react';
import { selectImageForPlatform } from '@/utils/aiImageSelector';

const DEBOUNCE_DELAY = 1500; // 1.5 seconds wait after typing stops

export const useAIImageSelection = (platform, adCopy) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs to handle debouncing and mounting
  const timeoutRef = useRef(null);
  const isMounted = useRef(true);
  const lastCopyRef = useRef(adCopy);

  // Helper to actually perform the fetch
  const performSelection = useCallback(async (currentPlatform, currentCopy) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await selectImageForPlatform(currentPlatform, currentCopy);
      if (isMounted.current) {
        setSelectedImage(result);
      }
    } catch (err) {
      console.error("AI Selection Hook Error:", err);
      if (isMounted.current) {
        setError(err);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // Effect to trigger selection on changes
  useEffect(() => {
    // Determine if this is a "meaningful" change that warrants a re-fetch
    // e.g., platform change implies immediate fetch
    // copy change implies debounced fetch
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const isPlatformChange = !selectedImage || selectedImage?.platformContext !== platform;
    // We store platform context in image to detect shifts? Or just rely on local state.
    // Let's assume simpler: if platform changes, fetch immediately.
    
    // Check if adCopy changed significantly (length diff > 5 or mostly new words?)
    // For simplicity, any copy change triggers debounce.
    
    if (isPlatformChange) {
      // Immediate fetch for platform switch (or very short delay)
      performSelection(platform, adCopy);
    } else {
      // Debounced fetch for typing
      timeoutRef.current = setTimeout(() => {
        performSelection(platform, adCopy);
      }, DEBOUNCE_DELAY);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // We omit selectedImage from deps to avoid loops, only respond to prop changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, adCopy, performSelection]);

  // Initial mount check
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Manual trigger function (for the refresh button)
  const triggerManualRefresh = () => {
    performSelection(platform, adCopy);
  };

  return {
    selectedImage,
    isLoading,
    error,
    relevanceScore: selectedImage?.relevanceScore || 0,
    reasoning: selectedImage?.reasoning || '',
    triggerRefresh: triggerManualRefresh
  };
};