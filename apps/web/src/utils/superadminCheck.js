import { supabase } from '@/lib/customSupabaseClient';

const SUPERADMIN_EMAIL = '1angshuman.biswas@gmail.com';

export const isSuperAdmin = (userEmail) => {
  if (!userEmail) return false;
  return userEmail.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
};

export const getCurrentUserEmail = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
    
    return user?.email || null;
  } catch (error) {
    console.error('Error in getCurrentUserEmail:', error);
    return null;
  }
};

export const checkIsSuperAdmin = async () => {
  const email = await getCurrentUserEmail();
  return isSuperAdmin(email);
};