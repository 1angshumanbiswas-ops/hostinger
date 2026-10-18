import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useAIRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommendations = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (err) throw err;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createRecommendation = async (recommendationData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_recommendations')
        .insert([recommendationData])
        .select();

      if (err) throw err;
      return data[0];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRecommendation = async (recommendationId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_recommendations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', recommendationId)
        .select();

      if (err) throw err;
      return data[0];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecommendation = async (recommendationId) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('ai_recommendations')
        .delete()
        .eq('id', recommendationId);

      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationsByAsset = async (userId, asset) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('asset', asset)
        .order('created_at', { ascending: false });

      if (err) throw err;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationsByType = async (userId, type) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('recommendation_type', type)
        .order('created_at', { ascending: false });

      if (err) throw err;
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchRecommendations,
    createRecommendation,
    updateRecommendation,
    deleteRecommendation,
    getRecommendationsByAsset,
    getRecommendationsByType
  };
}