import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/hooks/use-toast';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_favorites')
        .select('material_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.material_id) || []);
    } catch (error) {
      console.error('Fetch favorites error:', error);
    }
  };

  const isFavorite = (materialId) => {
    return favorites.includes(materialId);
  };

  const toggleFavorite = async (materialId) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to save favorites",
          variant: "destructive"
        });
        return;
      }

      if (isFavorite(materialId)) {
        // Remove favorite
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('material_id', materialId);

        if (error) throw error;
        setFavorites(prev => prev.filter(id => id !== materialId));
        toast({
          title: "Removed from Favorites",
          description: "Material removed from your favorites"
        });
      } else {
        // Add favorite
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            material_id: materialId
          });

        if (error) throw error;
        setFavorites(prev => [...prev, materialId]);
        toast({
          title: "Added to Favorites",
          description: "Material added to your favorites"
        });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { favorites, isFavorite, toggleFavorite, isLoading, refetch: fetchFavorites };
}