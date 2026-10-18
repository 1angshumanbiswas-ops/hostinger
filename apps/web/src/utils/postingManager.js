import { supabase } from '@/lib/customSupabaseClient';
import { PLATFORM_API_CONFIG, API_ERRORS } from '@/utils/platformAPIConfig';
import { logPlatformAction } from '@/utils/debugLogManager';
import { logLinkedInActivity } from '@/utils/logLinkedInActivity';
import { formatLinkedInPost } from '@/utils/linkedinRequestFormatter';
import { LINKEDIN_API_CONFIG } from '@/utils/linkedinAPIReference';
import { validateLinkedInConnection } from '@/utils/linkedinValidation';

const MANAGER_NAME = 'postingManager';

function log(message, data = null) {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  console.log(`[FlowDebug] [${timestamp}] [${MANAGER_NAME}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

function errorLog(message, error) {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  console.error(`[FlowDebug] [${timestamp}] [${MANAGER_NAME}] ${message}`, error);
}

// Helper to get access token from database
async function getAccessToken(userId, platform) {
  log(`Getting access token for ${platform}, user: ${userId}`);
  
  if (!userId) {
      return null;
  }
  
  const { data, error } = await supabase
    .from('platform_connections')
    .select('access_token, platform_user_id, is_connected')
    .eq('user_id', userId)
    .eq('platform', platform)
    .maybeSingle();

  if (error) {
    errorLog(`DB Error fetching token for ${platform}`, error);
    return null;
  }
  
  return data;
}

// Generic API Request
async function makeAPIRequest(platform, endpoint, method, data, tokenData) {
  log(`Preparing API request for ${platform}`, { endpoint, method });
  
  const config = PLATFORM_API_CONFIG?.[platform];
  if (!config) {
    throw new Error(`Configuration for ${platform} not found`);
  }

  // Replace placeholders in endpoint URL
  let url = `${config.baseUrl}${endpoint}`;
  if (tokenData?.platform_user_id) {
    url = url.replace('{page_id}', tokenData.platform_user_id)
             .replace('{ig_user_id}', tokenData.platform_user_id)
             .replace('{phone_number_id}', tokenData.platform_user_id)
             .replace('{ad_account_id}', tokenData.platform_user_id);
  }

  const headers = {
    ...config.headers,
    'Authorization': `${config.authMethod} ${tokenData?.access_token || ''}`
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data)
    });

    const responseBody = await response.json();
    
    if (!response.ok) {
      errorLog(`API Request Failed for ${platform}`, responseBody);
      throw {
        status: response.status,
        message: responseBody.error?.message || responseBody.message || 'Unknown API Error',
        details: responseBody
      };
    }

    log(`API Request Success for ${platform}`);
    return responseBody;
  } catch (err) {
    errorLog(`Fetch Exception for ${platform}`, err);
    throw err;
  }
}

function formatPostData(platform, content) {
  const text = typeof content === 'string' ? content : content.text || content.content;
  
  switch(platform) {
    case 'facebook': return { message: text };
    case 'twitter': return { text: text };
    case 'whatsapp':
      return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: "PHONE_NUMBER", 
        type: "text",
        text: { body: text }
      };
    default: return { text };
  }
}

export async function postToPlatform(userId, adId, platform, adContent) {
  log(`START postToPlatform: ${platform}. Input UserID: ${userId}`);
  
  let effectiveUserId = userId;

  // 1. Authentication Resolution
  if (!effectiveUserId) {
      log('No userId provided, resolving via Supabase session...');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
          effectiveUserId = user.id;
      }
  }

  // Log intent
  if (effectiveUserId) {
    await logPlatformAction(effectiveUserId, platform, 'POST_INIT', { adId, adContent });
  }

  let postRecordId = null;

  try {
    // 2. Create DB Record (Status: Posting)
    if (effectiveUserId) {
        log(`Creating ad_post record for user ${effectiveUserId}...`);
        const { data: postRecord, error: insertError } = await supabase
          .from('ad_posts')
          .insert({
            user_id: effectiveUserId,
            ad_id: adId,
            platform: platform,
            post_content: typeof adContent === 'string' ? adContent : JSON.stringify(adContent),
            status: 'posting',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (!insertError && postRecord) {
            postRecordId = postRecord.id;
            log(`Created ad_post record: ${postRecordId}`);
        } else {
            errorLog(`Failed to create ad_post record`, insertError);
        }
    }

    let response;
    let apiData;

    // --- PLATFORM LOGIC ---
    if (platform === 'linkedin') {
        const validation = effectiveUserId ? await validateLinkedInConnection(effectiveUserId) : { valid: false };
        
        if (!validation.valid) {
             throw new Error("LinkedIn connection invalid");
        }
        
        const accessToken = validation.token;
        const platformUserId = validation.platformUserId;

        try {
            apiData = formatLinkedInPost(platformUserId, adContent);
            
            // Log
            if (effectiveUserId) {
                await logLinkedInActivity(effectiveUserId, 'API_REQUEST_PREPARED', { body: apiData });
            }

            const res = await fetch(LINKEDIN_API_CONFIG.ENDPOINTS.SHARE, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': LINKEDIN_API_CONFIG.HEADERS.CONTENT_TYPE,
                    'X-Restli-Protocol-Version': LINKEDIN_API_CONFIG.HEADERS.PROTOCOL_VERSION
                },
                body: JSON.stringify(apiData)
            });
            
            response = await res.json();
            if (!res.ok) throw { status: res.status, message: response.message || "API Error", details: response };

            log(`LinkedIn Post Success`);

        } catch (liError) {
             if (effectiveUserId) await logLinkedInActivity(effectiveUserId, 'POST_FAILED', { error: liError.message });
             throw liError;
        }

    } else {
        // --- GENERIC LOGIC ---
        const tokenData = await getAccessToken(effectiveUserId, platform);
        
        if (!tokenData) {
            throw new Error(`No active connection found for ${platform}`);
        }

        apiData = formatPostData(platform, adContent);
        
        const config = PLATFORM_API_CONFIG?.[platform];
        let endpointKey = 'post';
        if (platform === 'twitter') endpointKey = 'tweet';
        if (platform === 'whatsapp') endpointKey = 'messages';
        const endpoint = config.endpoints?.[endpointKey] || Object.values(config.endpoints)[0];
        
        response = await makeAPIRequest(platform, endpoint, 'POST', apiData, tokenData);
    }

    // 8. Update DB Success
    if (postRecordId) {
        log(`Updating ad_post ${postRecordId} to success`);
        await supabase
          .from('ad_posts')
          .update({
            status: 'posted',
            posted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            api_response: response,
            platform_status: 'success'
          })
          .eq('id', postRecordId);
    }

    return { success: true, data: response };

  } catch (error) {
    errorLog(`FATAL ERROR in postToPlatform`, error);
    
    if (postRecordId) {
      await supabase
        .from('ad_posts')
        .update({
          status: 'failed',
          error_message: error.message || API_ERRORS.UNKNOWN,
          error_details: error.details || error,
          platform_status: 'error',
          updated_at: new Date().toISOString()
        })
        .eq('id', postRecordId);
    }

    return { success: false, error: error.message || API_ERRORS.UNKNOWN, details: error.details };
  }
}

export async function postToAllPlatforms(userId, adId, adContent, platforms) {
  log(`postToAllPlatforms called. Input User: ${userId}`);
  
  let effectiveUserId = userId;
  if (!effectiveUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    effectiveUserId = user?.id;
  }

  const results = await Promise.all(
    platforms.map(p => postToPlatform(effectiveUserId, adId, p, adContent))
  );
  
  const failed = results.filter(r => !r.success).length;
  const success = results.filter(r => r.success).length;

  return { success: failed === 0, summary: { success, failed }, results };
}

export async function getPostingHistory(userId, limit = 20, offset = 0) {
    if (!userId) return { data: [], count: 0 };
    const { data, count, error } = await supabase
      .from('ad_posts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return { data, count };
}

export async function retryFailedPost(postId) {
  const { data: originalPost } = await supabase.from('ad_posts').select('*').eq('id', postId).single();
  if (!originalPost) return { success: false, error: "Post not found" };
  return postToPlatform(originalPost.user_id, originalPost.ad_id, originalPost.platform, originalPost.post_content);
}

export async function deletePost(postId) {
  const { error } = await supabase.from('ad_posts').delete().eq('id', postId);
  return !error;
}