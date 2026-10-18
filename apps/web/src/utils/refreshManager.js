import { supabase } from '@/lib/customSupabaseClient';

export async function refreshAllPlatforms(userId) {
  // Platforms list is static for now, or could be passed in
  const platforms = ['linkedin', 'facebook', 'instagram', 'twitter', 'whatsapp', 'snapchat', 'youtube'];
  const results = [];
  for (const platform of platforms) {
    results.push(await refreshPlatform(userId, platform));
  }
  return results;
}

export async function refreshPlatform(userId, platform) {
  try {
    // 1. Simulate Refresh Action
    await new Promise(resolve => setTimeout(resolve, 800)); // Random delay

    // 2. Log success in history
    const { data, error } = await supabase
      .from('refresh_history')
      .insert({
        user_id: userId,
        platform: platform,
        status: 'success',
        refreshed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error(`Error refreshing ${platform}:`, error);
    
    // Log failure
    await supabase.from('refresh_history').insert({
        user_id: userId,
        platform: platform,
        status: 'failed',
        error_message: error.message,
        refreshed_at: new Date().toISOString()
    });

    return { success: false, error: error.message };
  }
}

export async function getRefreshHistory(userId, limit = 10, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('refresh_history')
      .select('*')
      .eq('user_id', userId)
      .order('refreshed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting refresh history:", error);
    return [];
  }
}

export async function getLastRefreshTime(userId, platform) {
  try {
    const { data, error } = await supabase
      .from('refresh_history')
      .select('refreshed_at')
      .eq('user_id', userId)
      .eq('platform', platform)
      .eq('status', 'success')
      .order('refreshed_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.refreshed_at || null;
  } catch (error) {
    console.error(`Error getting last refresh for ${platform}:`, error);
    return null;
  }
}