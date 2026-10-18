import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useAIInsights() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_insights')
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

  const createInsight = async (insightData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_insights')
        .insert([insightData])
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

  const updateInsight = async (insightId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_insights')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', insightId)
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

  const deleteInsight = async (insightId) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('ai_insights')
        .delete()
        .eq('id', insightId);

      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getInsightsByAsset = async (userId, asset) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_insights')
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

  const getInsightsByAgent = async (userId, agentType) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('agent_type', agentType)
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
    fetchInsights,
    createInsight,
    updateInsight,
    deleteInsight,
    getInsightsByAsset,
    getInsightsByAgent
  };
}