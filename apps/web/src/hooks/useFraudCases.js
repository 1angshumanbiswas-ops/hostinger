import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useFraudCases(filters = {}) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    setLoading(true);
    
    let query = supabase
      .from('fraud_cases')
      .select(`
        *,
        transactions (
          id,
          amount,
          transaction_type,
          created_at,
          location
        ),
        customers (
          id,
          name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      query = query.eq('priority', filters.priority);
    }
    if (filters.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    const { data } = await query;
    setCases(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();

    const subscription = supabase
      .channel('fraud_cases_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'fraud_cases'
      }, () => {
        fetchCases();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [JSON.stringify(filters)]);

  const updateCase = async (caseId, updates) => {
    await supabase
      .from('fraud_cases')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', caseId);

    await supabase.from('audit_logs').insert({
      user_id: 'current_user',
      action: 'update_fraud_case',
      table_name: 'fraud_cases',
      record_id: caseId,
      changes: updates,
      created_at: new Date().toISOString()
    });

    await fetchCases();
    return { success: true };
  };

  const addNote = async (caseId, note) => {
    const caseData = cases.find(c => c.id === caseId);
    const existingNotes = caseData.notes || '';
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${note}`;
    const updatedNotes = existingNotes 
      ? `${existingNotes}\n\n${newNote}`
      : newNote;

    return await updateCase(caseId, { notes: updatedNotes });
  };

  return {
    cases,
    loading,
    updateCase,
    addNote,
    refetch: fetchCases
  };
}