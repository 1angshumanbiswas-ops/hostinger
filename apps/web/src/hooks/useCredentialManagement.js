import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { encryptCredential, decryptCredential } from '@/utils/credentialEncryption';
import { logCredentialAccess, logCredentialUpdate, getAuditLogs } from '@/utils/credentialAuditLog';

export function useCredentialManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchCredentials = useCallback(async () => {
    if (!user) return [];
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('encrypted_credentials')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return data.map(item => ({
        ...item,
        decryptedData: decryptCredential(item.encrypted_data)
      }));
    } catch (err) {
      console.error('Fetch error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveCredential = useCallback(async (serviceName, credentialData) => {
    if (!user) throw new Error('Not authenticated');
    setLoading(true);
    try {
      const encryptedData = encryptCredential(credentialData);
      const timestamp = new Date().toISOString();
      
      const { error } = await supabase.from('encrypted_credentials').upsert({
        user_id: user.id,
        service_name: serviceName,
        encrypted_data: encryptedData,
        updated_at: timestamp,
        last_accessed: timestamp
      }, { onConflict: 'user_id, service_name' });
      
      if (error) throw error;
      await logCredentialUpdate(user.id, serviceName, true);
      return { success: true };
    } catch (err) {
      console.error('Save error:', err);
      await logCredentialUpdate(user.id, serviceName, false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteCredential = useCallback(async (serviceName) => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('encrypted_credentials')
        .delete()
        .eq('user_id', user.id)
        .eq('service_name', serviceName);
        
      if (error) throw error;
      await logCredentialAccess(user.id, serviceName, 'delete', true);
    } catch (err) {
      console.error('Delete error:', err);
      await logCredentialAccess(user.id, serviceName, 'delete', false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchAuditLogs = useCallback(async (serviceName = null, limit = 50) => {
    if (!user) return [];
    return await getAuditLogs(user.id, serviceName, limit);
  }, [user]);

  return {
    loading,
    fetchCredentials,
    saveCredential,
    deleteCredential,
    fetchAuditLogs
  };
}