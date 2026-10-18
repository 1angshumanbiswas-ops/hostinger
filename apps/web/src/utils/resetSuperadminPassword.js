import { supabase } from '@/lib/customSupabaseClient';

/**
 * Invokes the reset-superadmin-password edge function
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function invokeResetSuperadminPassword() {
  try {
    const { data, error } = await supabase.functions.invoke('reset-superadmin-password');
    
    if (error) {
      console.error('Error invoking function:', error);
      throw error;
    }
    
    if (!data?.success) {
      throw new Error(data?.error || 'Unknown error occurred during reset.');
    }
    
    console.log('Password reset successful:', data);
    return data;
  } catch (err) {
    console.error('Reset failed:', err);
    throw err;
  }
}