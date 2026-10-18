import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { validateUserID } from '@/utils/uuidValidator';

export function useCRMInteractions(userId, contactId) {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInteractions = async () => {
    if (!validateUserID(userId, 'useCRMInteractions.fetchInteractions')) {
      setInteractions([]);
      setLoading(false);
      setError('Invalid user session. Please log in again.');
      return;
    }

    if (!contactId) {
      setInteractions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('interactions')
        .select('*')
        .eq('user_id', userId)
        .eq('contact_id', contactId)
        .order('timestamp', { ascending: false });

      if (fetchError) throw fetchError;

      setInteractions(data || []);
    } catch (err) {
      console.error('Error fetching interactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addInteraction = async (interactionData) => {
    if (!validateUserID(userId, 'useCRMInteractions.addInteraction')) {
      throw new Error('Invalid user session. Please log in again.');
    }

    if (!contactId) {
      throw new Error('Contact ID is required to add interaction.');
    }

    const { data, error } = await supabase
      .from('interactions')
      .insert([{
        ...interactionData,
        user_id: userId,
        contact_id: contactId,
        created_by: interactionData.created_by || 'User'
      }])
      .select()
      .single();

    if (error) throw error;

    await fetchInteractions();
    return data;
  };

  useEffect(() => {
    if (userId && contactId) {
      fetchInteractions();
    } else {
      setInteractions([]);
      setLoading(false);
    }
  }, [userId, contactId]);

  return {
    interactions,
    loading,
    error,
    fetchInteractions,
    addInteraction
  };
}