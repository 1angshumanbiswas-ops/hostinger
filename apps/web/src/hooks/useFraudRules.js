import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useFraudRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('fraud_rules')
      .select('*')
      .order('created_at', { ascending: false });

    setRules(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRules();

    const subscription = supabase
      .channel('fraud_rules_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'fraud_rules'
      }, () => {
        fetchRules();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createRule = async (ruleData) => {
    await supabase
      .from('fraud_rules')
      .insert({
        ...ruleData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    await supabase.from('audit_logs').insert({
      user_id: 'current_user',
      action: 'create_fraud_rule',
      table_name: 'fraud_rules',
      changes: ruleData,
      created_at: new Date().toISOString()
    });

    await fetchRules();
    return { success: true };
  };

  const updateRule = async (ruleId, updates) => {
    await supabase
      .from('fraud_rules')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', ruleId);

    await supabase.from('audit_logs').insert({
      user_id: 'current_user',
      action: 'update_fraud_rule',
      table_name: 'fraud_rules',
      record_id: ruleId,
      changes: updates,
      created_at: new Date().toISOString()
    });

    await fetchRules();
    return { success: true };
  };

  const deleteRule = async (ruleId) => {
    await supabase
      .from('fraud_rules')
      .delete()
      .eq('id', ruleId);

    await supabase.from('audit_logs').insert({
      user_id: 'current_user',
      action: 'delete_fraud_rule',
      table_name: 'fraud_rules',
      record_id: ruleId,
      created_at: new Date().toISOString()
    });

    await fetchRules();
    return { success: true };
  };

  return {
    rules,
    loading,
    createRule,
    updateRule,
    deleteRule,
    refetch: fetchRules
  };
}