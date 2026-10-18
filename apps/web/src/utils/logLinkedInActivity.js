import { supabase } from '@/lib/customSupabaseClient';

/**
 * Logs LinkedIn specific activity to the debug_logs table.
 */
export async function logLinkedInActivity(userId, action, data, error = null) {
  const timestamp = new Date().toISOString();
  
  // Sanitize data (remove full tokens)
  const sanitizedData = { ...data };
  if (sanitizedData.token) {
    sanitizedData.token = `${sanitizedData.token.substring(0, 10)}...[MASKED]`;
  }
  if (sanitizedData.headers && sanitizedData.headers.Authorization) {
    sanitizedData.headers.Authorization = 'Bearer [MASKED]';
  }

  const logEntry = {
    user_id: userId,
    platform: 'linkedin',
    action: action, // e.g., 'TOKEN_VALIDATION', 'API_REQUEST', 'API_RESPONSE', 'POST_SUCCESS'
    details: {
      ...sanitizedData,
      timestamp
    },
    message: error ? error.message : (data.message || action),
    created_at: timestamp
  };

  // Add error details if present
  if (error) {
    logEntry.details.error_stack = error.stack;
    logEntry.details.error_code = error.status || error.statusCode;
  }

  try {
    const { error: dbError } = await supabase
      .from('debug_logs')
      .insert(logEntry);

    if (dbError) {
      console.error('Failed to write to debug_logs:', dbError);
    }
  } catch (e) {
    console.error('Exception writing to debug_logs:', e);
  }
}

/**
 * Retrieves LinkedIn logs for a user.
 */
export async function getLinkedInLogs(userId, limit = 10) {
  const { data, error } = await supabase
    .from('debug_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', 'linkedin')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}