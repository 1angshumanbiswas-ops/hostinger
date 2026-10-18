import { LINKEDIN_API_CONFIG } from './linkedinAPIReference';

/**
 * Validates post content for LinkedIn requirements.
 */
export function validatePostContent(content) {
  const text = typeof content === 'string' ? content : (content?.text || content?.content || '');
  
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Post content cannot be empty.' };
  }

  if (text.length > LINKEDIN_API_CONFIG.LIMITS.TEXT_LENGTH) {
    return { 
      valid: false, 
      error: `Post exceeds character limit. Current: ${text.length}, Max: ${LINKEDIN_API_CONFIG.LIMITS.TEXT_LENGTH}` 
    };
  }

  return { valid: true };
}

/**
 * Formats the LinkedIn share request body.
 * Uses the /v2/ugcPosts format.
 */
export function buildShareRequest(personId, content, visibility = 'PUBLIC') {
  // Ensure URN format: author must be "urn:li:person:{id}"
  // If the ID already contains "urn:li:person:", use it, otherwise prepend it.
  // Note: If the user is an organization, it would be "urn:li:organization:{id}", 
  // but for personal profiles it is "urn:li:person:".
  
  let authorUrn = personId;
  if (!personId.startsWith('urn:li:')) {
      authorUrn = `urn:li:person:${personId}`;
  }

  const textContent = typeof content === 'string' ? content : (content?.text || content?.content || '');

  const requestBody = {
    "author": authorUrn,
    "lifecycleState": "PUBLISHED",
    "specificContent": {
        "com.linkedin.ugc.ShareContent": {
            "shareCommentary": {
                "text": textContent
            },
            "shareMediaCategory": "NONE"
        }
    },
    "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": visibility === 'PUBLIC' ? "PUBLIC" : "CONNECTIONS"
    }
  };

  return requestBody;
}

/**
 * Orchestrator function to validate and format.
 */
export function formatLinkedInPost(personUrn, content, visibility = 'PUBLIC') {
  const validation = validatePostContent(content);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return buildShareRequest(personUrn, content, visibility);
}