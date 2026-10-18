import { supabase } from '@/lib/customSupabaseClient';

export async function logPlatformAction(userId, platform, action, requestData = null, responseData = null, errorMessage = null, httpStatus = null, details = null) {
  try {
    const { error } = await supabase
      .from('debug_logs')
      .insert({
        user_id: userId,
        platform,
        action,
        request_data: requestData,
        response_data: responseData,
        error_message: errorMessage,
        http_status: httpStatus,
        details: details
      });

    if (error) {
      console.error('Failed to write to debug_logs via manager:', error);
    }
  } catch (e) {
    console.error('Exception in logPlatformAction:', e);
  }
}

export async function getDebugLogs(userId, platform = null, limit = 50, offset = 0) {
  let query = supabase
    .from('debug_logs')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (platform) {
    query = query.eq('platform', platform);
  }

  const { data, count, error } = await query;

  if (error) throw error;
  return { data, count };
}

export async function clearDebugLogs(userId, platform = null) {
  let query = supabase
    .from('debug_logs')
    .delete()
    .eq('user_id', userId);

  if (platform) {
    query = query.eq('platform', platform);
  }

  const { error } = await query;
  if (error) throw error;
  return true;
}