import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useSavedCopy = () => {
  const [savedCopies, setSavedCopies] = useState({});
  const [loading, setLoading] = useState(true);

  // Load from LocalStorage and Supabase on mount
  useEffect(() => {
    const loadCopies = async () => {
      // 1. Load from LocalStorage (Fast)
      const localData = localStorage.getItem('ad_copy_drafts');
      if (localData) {
        try {
          setSavedCopies(JSON.parse(localData));
        } catch (e) {
          console.error('Error parsing local storage drafts', e);
        }
      }

      // 2. Sync with Supabase (Reliable)
      try {
        const { data, error } = await supabase
          .from('ad_copy_drafts')
          .select('*');

        if (!error && data) {
          const dbCopies = data.reduce((acc, curr) => ({
            ...acc,
            [curr.platform]: {
              content: curr.content,
              isLocked: curr.is_locked,
              savedAt: curr.last_saved_at
            }
          }), {});
          
          setSavedCopies(prev => {
            const newValue = { ...prev, ...dbCopies };
            localStorage.setItem('ad_copy_drafts', JSON.stringify(newValue));
            return newValue;
          });
        }
      } catch (err) {
        console.error('Error fetching drafts from Supabase:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCopies();

    // Sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'ad_copy_drafts' && e.newValue) {
        setSavedCopies(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveCopy = useCallback(async (platform, content) => {
    const now = new Date().toISOString();
    const newEntry = {
      content,
      isLocked: true,
      savedAt: now
    };

    // Update State & LocalStorage
    setSavedCopies(prev => {
      const next = { ...prev, [platform]: newEntry };
      localStorage.setItem('ad_copy_drafts', JSON.stringify(next));
      return next;
    });

    // Persist to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('ad_copy_drafts')
        .upsert({
          user_id: user.id,
          platform,
          content,
          is_locked: true,
          last_saved_at: now
        }, { onConflict: 'user_id, platform' });
    }
  }, []);

  const editCopy = useCallback(async (platform, currentContent) => {
    // Determine content to save (preserve current unsaved edits or existing saved content)
    const now = new Date().toISOString();
    
    setSavedCopies(prev => {
      const existing = prev[platform] || {};
      const next = { 
        ...prev, 
        [platform]: { 
          ...existing, 
          content: currentContent || existing.content,
          isLocked: false,
          // We don't necessarily update savedAt when just unlocking, 
          // but we might want to track "last interaction". 
          // For now, keep savedAt as the last actual SAVE.
        } 
      };
      localStorage.setItem('ad_copy_drafts', JSON.stringify(next));
      return next;
    });

    // Update Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase
        .from('ad_copy_drafts')
        .upsert({
            user_id: user.id,
            platform,
            is_locked: false,
            // Don't overwrite content with potentially empty string if not passed, 
            // but usually we pass currentContent.
            content: currentContent, 
            updated_at: now
        }, { onConflict: 'user_id, platform' });
    }
  }, []);

  const getSavedCopy = useCallback((platform) => {
    return savedCopies[platform] || null;
  }, [savedCopies]);

  const getLastSavedTime = useCallback((platform) => {
    return savedCopies[platform]?.savedAt || null;
  }, [savedCopies]);
  
  const resetCopy = useCallback(async (platform) => {
      // Unlocks and potentially clears saved data, but usually 'reset' means revert UI to template.
      // We will treat this as just unlocking in the persistence layer.
      await editCopy(platform, null);
  }, [editCopy]);

  return {
    savedCopies,
    getSavedCopy,
    saveCopy,
    editCopy,
    resetCopy,
    getLastSavedTime,
    loading
  };
};