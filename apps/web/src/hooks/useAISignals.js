import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useAISignals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSignals = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_signals')
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

  const createSignal = async (signalData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_signals')
        .insert([signalData])
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

  const updateSignal = async (signalId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_signals')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', signalId)
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

  const deleteSignal = async (signalId) => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('ai_signals')
        .delete()
        .eq('id', signalId);

      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSignalsByAsset = async (userId, asset) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_signals')
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

  const getSignalsByType = async (userId, signalType) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('ai_signals')
        .select('*')
        .eq('user_id', userId)
        .eq('signal_type', signalType)
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
    fetchSignals,
    createSignal,
    updateSignal,
    deleteSignal,
    getSignalsByAsset,
    getSignalsByType
  };
}