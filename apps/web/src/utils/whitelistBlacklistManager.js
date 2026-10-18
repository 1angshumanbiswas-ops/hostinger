import { supabase } from '@/lib/customSupabaseClient';

// --- Whitelist Functions ---

export async function addToWhitelist(userId, accountId, senderEmail, senderName, reason) {
  try {
    const { data, error } = await supabase
      .from('sender_whitelist')
      .upsert({
        user_id: userId,
        account_id: accountId,
        sender_email: senderEmail,
        sender_name: senderName,
        reason: reason,
        updated_at: new Date().toISOString()
      }, { onConflict: 'account_id,sender_email' }) // Assuming unique constraint or logic
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding to whitelist:', error);
    throw error;
  }
}

export async function removeFromWhitelist(userId, accountId, senderEmail) {
  try {
    const { error } = await supabase
      .from('sender_whitelist')
      .delete()
      .eq('user_id', userId)
      .eq('account_id', accountId)
      .eq('sender_email', senderEmail);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing from whitelist:', error);
    throw error;
  }
}

export async function getWhitelist(userId, accountId) {
  try {
    const { data, error } = await supabase
      .from('sender_whitelist')
      .select('*')
      .eq('user_id', userId)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching whitelist:', error);
    return [];
  }
}

// --- Blacklist Functions ---

export async function addToBlacklist(userId, accountId, senderEmail, senderName, reason) {
  try {
    const { data, error } = await supabase
      .from('sender_blacklist')
      .upsert({
        user_id: userId,
        account_id: accountId,
        sender_email: senderEmail,
        sender_name: senderName,
        reason: reason,
        updated_at: new Date().toISOString()
      }, { onConflict: 'account_id,sender_email' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding to blacklist:', error);
    throw error;
  }
}

export async function removeFromBlacklist(userId, accountId, senderEmail) {
  try {
    const { error } = await supabase
      .from('sender_blacklist')
      .delete()
      .eq('user_id', userId)
      .eq('account_id', accountId)
      .eq('sender_email', senderEmail);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing from blacklist:', error);
    throw error;
  }
}

export async function getBlacklist(userId, accountId) {
  try {
    const { data, error } = await supabase
      .from('sender_blacklist')
      .select('*')
      .eq('user_id', userId)
      .eq('account_id', accountId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching blacklist:', error);
    return [];
  }
}

// --- Utility Checks ---

export function isWhitelisted(senderEmail, whitelist) {
  return whitelist.some(item => item.sender_email === senderEmail);
}

export function isBlacklisted(senderEmail, blacklist) {
  return blacklist.some(item => item.sender_email === senderEmail);
}