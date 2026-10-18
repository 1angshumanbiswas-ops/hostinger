import { supabase } from '@/lib/customSupabaseClient';

export async function savePlatformConnection(userId, platform, accessToken, refreshToken = null, expiresAt = null, platformUserId = null, scopes = null) {
  const { data, error } = await supabase
    .from('platform_connections')
    .upsert({
      user_id: userId,
      platform,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: expiresAt,
      platform_user_id: platformUserId,
      scopes: scopes,
      is_connected: true,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, platform' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPlatformConnections(userId) {
  const { data, error } = await supabase
    .from('platform_connections')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function getPlatformConnection(userId, platform) {
  const { data, error } = await supabase
    .from('platform_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
  return data;
}

export async function deletePlatformConnection(userId, platform) {
  const { error } = await supabase
    .from('platform_connections')
    .delete()
    .eq('user_id', userId)
    .eq('platform', platform);

  if (error) throw error;
  return true;
}

export async function updateTokenExpiry(userId, platform, expiresAt) {
  const { error } = await supabase
    .from('platform_connections')
    .update({ token_expires_at: expiresAt, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('platform', platform);

  if (error) throw error;
  return true;
}