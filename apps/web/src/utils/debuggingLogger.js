import { supabase } from '@/lib/customSupabaseClient';

// Deduplication cache to prevent log spam
const logCache = new Map();
const LOG_COOLDOWN_MS = 60000; // 1 minute cooldown for the same error

const generateLogHash = (action, platform, message) => {
  return `${action}:${platform}:${message}`;
};

const shouldLog = (hash) => {
  const lastLogTime = logCache.get(hash);
  const now = Date.now();
  if (!lastLogTime || (now - lastLogTime > LOG_COOLDOWN_MS)) {
    logCache.set(hash, now);
    return true;
  }
  return false;
};

export const logger = {
  async logPostingAttempt(userId, platform, data) {
    if (!shouldLog(generateLogHash('POST_ATTEMPT', platform, 'attempt'))) return;
    
    console.log(`[POST_ATTEMPT] ${platform}:`, data);
    try {
      await supabase.from('debug_logs').insert({
        user_id: userId,
        platform,
        action: 'POST_ATTEMPT',
        request_data: data
      });
    } catch (e) {
      // Silent catch for logger failures
    }
  },

  async logAPIResponse(userId, platform, response, status) {
    if (!shouldLog(generateLogHash('API_RESPONSE', platform, status))) return;

    console.log(`[API_RESPONSE] ${platform} (${status})`);
    try {
      await supabase.from('debug_logs').insert({
        user_id: userId,
        platform,
        action: 'API_RESPONSE',
        response_data: { status, body: response }
      });
    } catch (e) {
      // Silent catch
    }
  },

  async logPostingError(userId, platform, error, details = {}) {
    const errorMsg = error?.message || String(error);
    if (!shouldLog(generateLogHash('POST_ERROR', platform, errorMsg))) return;

    console.error(`[POST_ERROR] ${platform}:`, errorMsg);
    try {
      await supabase.from('debug_logs').insert({
        user_id: userId,
        platform,
        action: 'POST_ERROR',
        error_details: { 
          message: errorMsg, 
          stack: error?.stack,
          ...details 
        }
      });
    } catch (e) {
      // Silent catch
    }
  },

  logErrorOnce(context, error) {
    const errorMsg = error?.message || String(error);
    if (!shouldLog(generateLogHash('CLIENT_ERROR', context, errorMsg))) return;
    console.error(`[${context}] Error:`, errorMsg);
  },

  logWarnOnce(context, message) {
    if (!shouldLog(generateLogHash('CLIENT_WARN', context, message))) return;
    console.warn(`[${context}] Warning:`, message);
  }
};