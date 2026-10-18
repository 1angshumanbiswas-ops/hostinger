import { useState, useCallback } from 'react';
import { setSnapchatImage, getSnapchatImage, updateSnapchatImage, deleteSnapchatImage } from '@/utils/snapchatImageManager';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useSnapchatImage = (initialImage = null) => {
  const { user } = useAuth();
  const defaultImage = "https://horizons-cdn.hostinger.com/e0687bb0-98a0-45d4-8f73-50f1c1652251/458871fe584c6a34dce9a67d14642588.png";
  
  const [image, setImageState] = useState({ 
    imageUrl: initialImage || defaultImage,
    id: 'default-snap-image' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setImage = useCallback(async (newUrl) => {
    if (!user) return;
    setLoading(true);
    try {
        await setSnapchatImage(user.id, 'current-draft', newUrl);
        setImageState(prev => ({ ...prev, imageUrl: newUrl }));
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }, [user]);

  const updateImage = useCallback(async (newUrl) => {
      // Wrapper for set, functionally similar in this context
      await setImage(newUrl);
  }, [setImage]);

  const deleteImage = useCallback(async () => {
      setLoading(true);
      try {
          await deleteSnapchatImage('current-draft');
          setImageState({ imageUrl: null, id: null });
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  }, []);

  return {
    image,
    loading,
    error,
    setImage,
    updateImage,
    deleteImage
  };
};