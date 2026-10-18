import { supabase } from '@/lib/customSupabaseClient';
import { LINKEDIN_API_CONFIG } from './linkedinAPIReference';
import { logLinkedInActivity } from './logLinkedInActivity';

/**
 * Validates the format of a LinkedIn access token.
 */
export function validateLinkedInToken(token) {
  if (!token) return { valid: false, message: 'Token is null or empty' };
  // Basic heuristic: LinkedIn tokens are long opaque strings. 
  if (typeof token !== 'string') return { valid: false, message: 'Token must be a string' };
  if (token.length < 50) return { valid: false, message: 'Token appears too short' };
  
  return { valid: true };
}

/**
 * Comprehensive check of the LinkedIn connection in the database.
 */
export async function validateLinkedInConnection(userId) {
  try {
    const { data, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'linkedin')
      .maybeSingle();

    if (error) {
       await logLinkedInActivity(userId, 'VALIDATION_DB_ERROR', { error: error.message });
       return { valid: false, message: `Database error: ${error.message}` };
    }

    if (!data) {
       await logLinkedInActivity(userId, 'VALIDATION_MISSING', { message: 'No record found' });
       return { valid: false, message: 'LinkedIn not connected. Please connect in Settings.' };
    }

    if (!data.is_connected) {
       await logLinkedInActivity(userId, 'VALIDATION_DISCONNECTED', { message: 'is_connected flag is false' });
       return { valid: false, message: 'LinkedIn connection is disabled.' };
    }

    const tokenCheck = validateLinkedInToken(data.access_token);
    if (!tokenCheck.valid) {
       await logLinkedInActivity(userId, 'VALIDATION_INVALID_TOKEN', { message: tokenCheck.message });
       return { valid: false, message: `Invalid Token: ${tokenCheck.message}` };
    }

    // Check expiry if available
    if (data.token_expires_at) {
        const expiryDate = new Date(data.token_expires_at);
        if (expiryDate < new Date()) {
            await logLinkedInActivity(userId, 'VALIDATION_EXPIRED', { expiry: data.token_expires_at });
            return { valid: false, message: 'Token has expired. Please reconnect.' };
        }
    }

    if (!data.platform_user_id) {
        await logLinkedInActivity(userId, 'VALIDATION_NO_URN', { message: 'Missing platform_user_id' });
        return { valid: false, message: 'Missing LinkedIn User ID (URN). Reconnect required.' };
    }

    return { 
        valid: true, 
        token: data.access_token, 
        platformUserId: data.platform_user_id,
        connectionId: data.id
    };

  } catch (e) {
      console.error("LinkedIn Validation Exception:", e);
      return { valid: false, message: e.message };
  }
}

/**
 * Retrieves the correct Person URN for API requests.
 */
export async function getLinkedInPersonUrn(userId) {
    const validation = await validateLinkedInConnection(userId);
    if (!validation.valid) throw new Error(validation.message);
    
    // Ensure formatting
    let urn = validation.platformUserId;
    if (!urn.startsWith('urn:li:')) {
        urn = `urn:li:person:${urn}`;
    }
    return urn;
}

/**
 * Tests the connection by making a lightweight API call (Me endpoint).
 */
export async function testLinkedInConnection(token) {
    try {
        const response = await fetch(LINKEDIN_API_CONFIG.ENDPOINTS.ME, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            return { success: false, status: response.status, error: errorBody.message || 'API Call Failed' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (e) {
        return { success: false, error: e.message };
    }
}