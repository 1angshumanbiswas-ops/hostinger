import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { validateUserID } from '@/utils/uuidValidator';

export function useCRMContacts(userId) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    // Validate user ID before querying
    if (!validateUserID(userId, 'useCRMContacts.fetchContacts')) {
      setContacts([]);
      setLoading(false);
      setError('Invalid user session. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData) => {
    if (!validateUserID(userId, 'useCRMContacts.addContact')) {
      throw new Error('Invalid user session. Please log in again.');
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([{ ...contactData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;

    // Add to pipeline_stages
    await supabase
      .from('pipeline_stages')
      .insert([{
        user_id: userId,
        contact_id: data.id,
        stage: contactData.status || 'Lead'
      }]);

    await fetchContacts();
    return data;
  };

  const updateContact = async (contactId, updates) => {
    if (!validateUserID(userId, 'useCRMContacts.updateContact')) {
      throw new Error('Invalid user session. Please log in again.');
    }

    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', contactId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    // Track stage change if status updated
    if (updates.status) {
      await supabase
        .from('pipeline_stages')
        .insert([{
          user_id: userId,
          contact_id: contactId,
          stage: updates.status
        }]);
    }

    await fetchContacts();
    return data;
  };

  const deleteContact = async (contactId) => {
    if (!validateUserID(userId, 'useCRMContacts.deleteContact')) {
      throw new Error('Invalid user session. Please log in again.');
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', userId);

    if (error) throw error;
    await fetchContacts();
  };

  useEffect(() => {
    if (userId) {
      fetchContacts();
    } else {
      setContacts([]);
      setLoading(false);
    }
  }, [userId]);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact
  };
}