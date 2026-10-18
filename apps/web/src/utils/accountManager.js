import { supabase } from '@/lib/customSupabaseClient';

export async function addAccount(userId, accountEmail, accessToken, refreshToken, accountName = '') {
  try {
    // Check if this is the first account
    const { count } = await supabase
      .from('user_accounts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const isPrimary = count === 0;

    const { data, error } = await supabase
      .from('user_accounts')
      .insert({
        user_id: userId,
        account_email: accountEmail,
        account_name: accountName || accountEmail.split('@')[0],
        access_token: accessToken,
        refresh_token: refreshToken,
        is_primary: isPrimary,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
}

export async function removeAccount(userId, accountId) {
  try {
    const { error } = await supabase
      .from('user_accounts')
      .delete()
      .eq('id', accountId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing account:', error);
    throw error;
  }
}

export async function getAccounts(userId) {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
}

export async function getPrimaryAccount(userId) {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error fetching primary account:', error);
    return null;
  }
}

export async function setPrimaryAccount(userId, accountId) {
  try {
    // Demote current primary
    await supabase
      .from('user_accounts')
      .update({ is_primary: false })
      .eq('user_id', userId)
      .eq('is_primary', true);

    // Promote new primary
    const { data, error } = await supabase
      .from('user_accounts')
      .update({ is_primary: true })
      .eq('id', accountId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error setting primary account:', error);
    throw error;
  }
}

// Just a placeholder for local switching logic if needed, mostly handled by hooks
export async function switchAccount(userId, accountId) {
  // Logic to update local state or session storage for "active" account
  // In this implementation, we'll handle this in the hook state
  return accountId;
}