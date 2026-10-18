import { supabase } from '@/lib/customSupabaseClient';
import { postToPlatform as basePostToPlatform } from './postingManager';
import { logPlatformAction } from '@/utils/debugLogManager';

const MANAGER_NAME = 'triggerPostingManager';

function log(message, data) {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  console.log(`[FlowDebug] [${timestamp}] [${MANAGER_NAME}] ${message}`, data ? JSON.stringify(data) : '');
}

export async function verifyPlatformConnection(userId, platform) {
  log(`Verifying connection: ${platform}`);
  const { data, error } = await supabase
    .from('platform_connections')
    .select('id, is_connected')
    .eq('user_id', userId)
    .eq('platform', platform)
    .single();
  
  const isConnected = !!data && !error && data.is_connected;
  log(`Connection status for ${platform}: ${isConnected}`);
  return isConnected;
}

export async function postToPlatform(userId, platform, content) {
    log(`Triggering post for ${platform}`);
    
    if (platform === 'linkedin') {
        log('Redirecting to LinkedIn specific flow via base manager');
    }
    
    // We reuse the central posting logic which now handles LinkedIn specifically
    return basePostToPlatform(userId, null, platform, content);
}

export async function postToAllPlatforms(userId, content, platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'snapchat', 'whatsapp']) {
  log(`Triggering batch post`, { platforms });
  
  const results = await Promise.all(
    platforms.map(async (platform) => {
        log(`Starting batch item: ${platform}`);
        return await postToPlatform(userId, platform, content);
    })
  );

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log(`Batch summary: ${successful} success, ${failed} failed`);

  return {
    success: failed === 0,
    results,
    summary: { successful, failed, total: platforms.length }
  };
}

export async function getPlatformStatus(userId, platform) {
  try {
    const { data: connection } = await supabase
        .from('platform_connections')
        .select('is_connected')
        .eq('user_id', userId)
        .eq('platform', platform)
        .maybeSingle();
        
    const { data: lastPost, error } = await supabase
      .from('ad_posts')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    
    return {
        connected: connection?.is_connected || false,
        lastPost: lastPost || null,
        status: lastPost?.status || (connection?.is_connected ? 'idle' : 'disconnected')
    };
  } catch (error) {
    console.error(`[${MANAGER_NAME}] Status check failed`, error);
    await logPlatformAction(userId, platform, 'STATUS_CHECK_ERROR', null, null, error.message);
    return null;
  }
}