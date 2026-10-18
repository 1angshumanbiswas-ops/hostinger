import { supabase } from '@/lib/customSupabaseClient';

export const logCredentialAccess = async (userId, serviceName, action, success = true, details = {}) => {
  try {
    const { error } = await supabase.from('credential_audit_log').insert({
      user_id: userId,
      service_name: serviceName,
      action,
      success,
      details,
      timestamp: new Date().toISOString(),
      ip_address: 'client-side'
    });
    if (error) throw error;
  } catch (err) {
    console.error('Failed to log credential access:', err);
  }
};

export const logCredentialUpdate = async (userId, serviceName, success = true) => {
  try {
    const { error } = await supabase.from('credential_audit_log').insert({
      user_id: userId,
      service_name: serviceName,
      action: 'update',
      success,
      details: { message: 'Credential updated securely' },
      timestamp: new Date().toISOString()
    });
    if (error) throw error;
  } catch (err) {
    console.error('Failed to log credential update:', err);
  }
};

export const getAuditLogs = async (userId, serviceName = null, limit = 50) => {
  try {
    let query = supabase
      .from('credential_audit_log')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (serviceName) {
      query = query.eq('service_name', serviceName);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Failed to fetch audit logs:', err);
    return [];
  }
};