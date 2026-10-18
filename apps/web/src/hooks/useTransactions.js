import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useTransactions(filters = {}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    
    let query = supabase
      .from('transactions')
      .select(`
        *,
        customers (
          id,
          name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }
    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }
    if (filters.minAmount) {
      query = query.gte('amount', filters.minAmount);
    }
    if (filters.maxAmount) {
      query = query.lte('amount', filters.maxAmount);
    }
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.type && filters.type !== 'all') {
      query = query.eq('transaction_type', filters.type);
    }
    if (filters.customerId) {
      query = query.eq('customer_id', filters.customerId);
    }

    const { data } = await query;
    setTransactions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();

    const subscription = supabase
      .channel('transactions_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions'
      }, () => {
        fetchTransactions();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [JSON.stringify(filters)]);

  const searchTransactions = (searchTerm) => {
    if (!searchTerm) return transactions;
    
    const lowerSearch = searchTerm.toLowerCase();
    return transactions.filter(transaction => 
      transaction.id.toLowerCase().includes(lowerSearch) ||
      transaction.customers?.name?.toLowerCase().includes(lowerSearch) ||
      transaction.customers?.email?.toLowerCase().includes(lowerSearch)
    );
  };

  return {
    transactions,
    loading,
    searchTransactions,
    refetch: fetchTransactions
  };
}