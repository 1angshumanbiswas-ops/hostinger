import { formatLinkedInPost } from './linkedinRequestFormatter';
import { LINKEDIN_API_CONFIG } from './linkedinAPIReference';
import { logLinkedInActivity } from './logLinkedInActivity';

/**
 * Utility to perform a test post to LinkedIn.
 * Useful for the debug panel.
 */
export async function testLinkedInPosting(token, userId, personId) {
  const testContent = `Test post from Debugger - ${new Date().toLocaleString()}`;
  
  try {
    await logLinkedInActivity(userId, 'TEST_POST_START', { content: testContent });

    // 1. Format
    const requestBody = formatLinkedInPost(personId, testContent);

    // 2. Send
    const response = await fetch(LINKEDIN_API_CONFIG.ENDPOINTS.SHARE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': LINKEDIN_API_CONFIG.HEADERS.CONTENT_TYPE,
        'X-Restli-Protocol-Version': LINKEDIN_API_CONFIG.HEADERS.PROTOCOL_VERSION
      },
      body: JSON.stringify(requestBody)
    });

    const status = response.status;
    const responseData = await response.json();

    await logLinkedInActivity(userId, 'TEST_POST_RESPONSE', { status, body: responseData });

    if (response.ok) {
      return { 
        success: true, 
        postId: responseData.id || responseData.activity, 
        message: 'Test post successful' 
      };
    } else {
      return { 
        success: false, 
        error: responseData.message || 'API Error',
        details: responseData 
      };
    }

  } catch (error) {
    await logLinkedInActivity(userId, 'TEST_POST_FATAL', { error: error.message }, error);
    return { success: false, error: error.message };
  }
}