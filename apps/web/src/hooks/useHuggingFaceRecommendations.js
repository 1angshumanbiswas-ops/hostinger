import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useHuggingFaceRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('trading_ai_recommendations')
        .select('*')
        .order('confidence', { ascending: false })
        .limit(20);

      if (sbError) throw sbError;
      
      // Map legacy columns if needed or just use current
      const formattedData = (data || []).map(r => ({
        ...r,
        asset_name: r.asset_name || r.asset_type, // Fallback if asset_name missing
        confidence_score: r.confidence || 0,
        reasoning: r.recommendation || "No reasoning provided."
      }));

      setRecommendations(formattedData);
    } catch (err) {
      console.error("Error fetching HF recommendations:", err);
      setError(err.message);
      toast({
        title: "Error fetching recommendations",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerAnalysis = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('hourly-market-analysis');
      if (error) throw error;
      
      toast({
        title: "Analysis Complete",
        description: "Hugging Face model has generated new recommendations.",
      });
      await fetchRecommendations();
    } catch (err) {
      console.error("Failed to trigger analysis:", err);
      toast({
        title: "Analysis Failed",
        description: err.message,
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
    
    // Subscribe to real-time changes
    const channel = supabase.channel('hf_recs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trading_ai_recommendations' }, (payload) => {
        setRecommendations(prev => {
          const newRec = {
            ...payload.new,
            asset_name: payload.new.asset_name || payload.new.asset_type,
            confidence_score: payload.new.confidence || 0,
            reasoning: payload.new.recommendation
          };
          return [newRec, ...prev].sort((a, b) => b.confidence_score - a.confidence_score);
        });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { recommendations, loading, error, refresh: fetchRecommendations, triggerAnalysis };
};