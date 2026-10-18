import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { Star, X, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FavoritesPanel = ({ onSelectAsset }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Merge with some mock live data for demonstration
      const withMockPrices = (data || []).map(f => ({
        ...f,
        price: Math.random() * 1000 + 10,
        changePercent: (Math.random() - 0.5) * 10
      }));
      setFavorites(withMockPrices);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (id, e) => {
    e.stopPropagation();
    try {
      await supabase.from('user_favorites').delete().eq('id', id);
      fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-lg">
            Your watchlist is empty. Add assets from the tables.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favorites.map(fav => (
              <div 
                key={fav.id} 
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white group relative"
                onClick={() => onSelectAsset && onSelectAsset({ symbol: fav.symbol, price: fav.price })}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleRemove(fav.id, e)}
                >
                  <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                </Button>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{fav.symbol}</h3>
                <div className="flex justify-between items-end">
                  <span className="font-medium text-slate-700">${fav.price.toFixed(2)}</span>
                  <span className={`text-sm flex items-center gap-1 font-medium ${fav.changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {fav.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(fav.changePercent).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesPanel;