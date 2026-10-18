import { supabase } from '@/lib/customSupabaseClient';

/**
 * Checks if the provided user object represents a super admin.
 */
export const isSuperAdminUser = (user) => {
  if (!user) return false;
  if (user.is_super_admin === true) return true;
  if (user.app_metadata?.is_super_admin === true) return true;
  if (user.user_metadata?.is_super_admin === true) return true;
  if (user.role === 'superadmin') return true;
  if (user.role === 'service_role' || user.role === 'super_admin') return true;
  return false;
};

/**
 * Checks if current user has superadmin access bypass
 */
export const checkSuperAdminAccess = () => {
  try {
    return localStorage.getItem('superadmin_bypass') === 'true';
  } catch (e) {
    return false;
  }
};

/**
 * Async helper to fetch current user and check super admin status directly from auth
 */
export const checkSuperAdminStatus = async () => {
  try {
    if (checkSuperAdminAccess()) return true;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return false;
    return isSuperAdminUser(data.user);
  } catch (e) {
    console.error('Error checking super admin status:', e);
    return false;
  }
};

/**
 * Checks if the given email is in the superadmins table
 */
export const checkSuperAdminBypass = async (email) => {
  if (!email || typeof email !== 'string') return false;
  
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('superadmins')
      .select('email')
      .eq('email', normalizedEmail)
      .limit(1);
      
    if (error) {
      console.error("Error checking superadmins table:", error);
    }
    
    if (data && data.length > 0) return true;
    
    return false;
  } catch (err) {
    console.error("Exception checking super admin bypass:", err);
    return false;
  }
};

/**
 * Grants super admin access by checking DB
 */
export const grantSuperAdminAccess = async (email) => {
  if (!email || typeof email !== 'string') return null;
  const normalizedEmail = email.trim().toLowerCase();
  
  try {
    const { data: existingRecords, error: fetchError } = await supabase
      .from('superadmins')
      .select('*')
      .eq('email', normalizedEmail)
      .limit(1);
      
    if (existingRecords && existingRecords.length > 0) {
      localStorage.setItem('superadmin_bypass', 'true');
      localStorage.setItem('superadmin_email', normalizedEmail);
      return existingRecords[0];
    }
    
    return null;
  } catch (error) {
    console.error("Unexpected error in grantSuperAdminAccess:", error);
    return null;
  }
};