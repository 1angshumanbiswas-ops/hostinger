import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export function useCommodityFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_favorites')
        .select('symbol')
        .eq('user_id', userData.user.id);

      if (error) throw error;
      setFavorites(data.map(f => f.symbol));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (symbol) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast({ title: "Authentication required", description: "Please log in to save favorites.", variant: "destructive" });
        return;
      }

      const isFavorite = favorites.includes(symbol);

      if (isFavorite) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userData.user.id)
          .eq('symbol', symbol);
        setFavorites(favorites.filter(f => f !== symbol));
      } else {
        await supabase
          .from('user_favorites')
          .insert([{ user_id: userData.user.id, symbol }]);
        setFavorites([...favorites, symbol]);
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return { favorites, loading, toggleFavorite };
}