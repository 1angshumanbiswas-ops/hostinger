import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { getMockNSEStocks, generateMockRecommendations } from '@/utils/nseStockMockData';
import { useToast } from '@/components/ui/use-toast';

export function useNSEStocks() {
  const [stocks, setStocks] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch existing stocks from correct table
      let { data: stocksData, error: stocksError } = await supabase
        .from('app_nse_stocks')
        .select('*');

      if (stocksError) throw stocksError;

      // If no stocks exist, populate mock data
      if (!stocksData || stocksData.length === 0) {
        const mockStocks = getMockNSEStocks();
        const { data: insertedStocks, error: insertError } = await supabase
          .from('app_nse_stocks')
          .insert(mockStocks)
          .select();

        if (insertError) throw insertError;
        stocksData = insertedStocks;

        // Generate and insert recommendations for the new stocks
        const mockRecs = generateMockRecommendations(insertedStocks);
        const { error: recInsertError } = await supabase
          .from('app_stock_recommendations')
          .insert(mockRecs);

        if (recInsertError) throw recInsertError;
      }

      // Fetch recommendations from correct table
      const { data: recData, error: recError } = await supabase
        .from('app_stock_recommendations')
        .select('*');

      if (recError) throw recError;

      // Map recommendations by stock_id
      const recMap = {};
      if (recData) {
        recData.forEach(r => {
          recMap[r.stock_id] = r;
        });
      }

      setStocks(stocksData || []);
      setRecommendations(recMap);

    } catch (err) {
      console.error('Error in useNSEStocks:', err);
      setError(err.message);
      toast({
        title: "Error fetching stock data",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return { stocks, recommendations, loading, error, refetch: fetchStocks };
}