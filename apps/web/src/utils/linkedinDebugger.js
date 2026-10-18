import { supabase } from '@/lib/customSupabaseClient';
import { LINKEDIN_API_CONFIG } from './linkedinAPIReference';
import { logLinkedInActivity } from './logLinkedInActivity';

/**
 * Checks if a LinkedIn token exists and is theoretically valid based on DB record.
 */
export async function checkLinkedInToken(userId) {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'linkedin')
      .single();

    if (error || !data) {
      await logLinkedInActivity(userId, 'TOKEN_CHECK', { status: 'MISSING' });
      return { valid: false, message: 'No LinkedIn connection found.' };
    }

    // Simple expiration check if 'expires_at' column exists and is populated
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
        await logLinkedInActivity(userId, 'TOKEN_CHECK', { status: 'EXPIRED', expires_at: data.expires_at });
        return { valid: false, message: 'Token expired.' };
    }

    await logLinkedInActivity(userId, 'TOKEN_CHECK', { status: 'FOUND', connection_id: data.id });
    return { valid: true, token: data.access_token, platformUserId: data.platform_user_id };
  } catch (e) {
    return { valid: false, message: e.message };
  }
}

/**
 * Validates that the token has the necessary scopes.
 * Note: Client-side validation of scopes usually requires parsing the token or checking the introspection endpoint 
 * if accessible. Since we often store scopes in DB, we check there first.
 */
export function validateTokenPermissions(connectionData) {
  const requiredScopes = [LINKEDIN_API_CONFIG.SCOPES.SHARE, LINKEDIN_API_CONFIG.SCOPES.PROFILE];
  const scopes = connectionData.scopes || []; // Assuming scopes are stored as array or string
  
  // If scopes are stored as space-separated string
  const userScopes = Array.isArray(scopes) ? scopes : (typeof scopes === 'string' ? scopes.split(' ') : []);
  
  const missing = requiredScopes.filter(s => !userScopes.includes(s));
  
  // Note: If we don't store scopes, we might assume they are present or need a real API call to test.
  // For this utility, we'll proceed if we can't verify strictly, but log it.
  return {
    valid: missing.length === 0,
    missingScopes: missing
  };
}

/**
 * Tests the LinkedIn API connection by fetching the user's profile.
 */
export async function testLinkedInConnection(token, userId) {
  await logLinkedInActivity(userId, 'CONNECTION_TEST_START', { endpoint: LINKEDIN_API_CONFIG.ENDPOINTS.ME });

  try {
    const response = await fetch(LINKEDIN_API_CONFIG.ENDPOINTS.ME, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': LINKEDIN_API_CONFIG.HEADERS.CONTENT_TYPE
      }
    });

    const status = response.status;
    const responseBody = await response.json();

    await logLinkedInActivity(userId, 'CONNECTION_TEST_RESPONSE', { status, body: responseBody });

    if (status === 200) {
      return { success: true, data: responseBody };
    } else {
      return { success: false, status, error: responseBody };
    }
  } catch (error) {
    await logLinkedInActivity(userId, 'CONNECTION_TEST_ERROR', { error: error.message }, error);
    return { success: false, error: error.message };
  }
}

export async function logLinkedInRequest(userId, type, data) {
    return logLinkedInActivity(userId, `REQUEST_${type}`, data);
}

export async function logLinkedInResponse(userId, type, response) {
    return logLinkedInActivity(userId, `RESPONSE_${type}`, response);
}