/**
 * LinkedIn API Reference and Constants
 * Documenting requirements for /v2/ugcPosts endpoint
 */

export const LINKEDIN_API_CONFIG = {
  ENDPOINTS: {
    // UPDATED: Using ugcPosts as requested for User Generated Content
    SHARE: 'https://api.linkedin.com/v2/ugcPosts', 
    ME: 'https://api.linkedin.com/v2/me',
    TOKEN_INTROSPECTION: 'https://www.linkedin.com/oauth/v2/introspect'
  },
  HEADERS: {
    CONTENT_TYPE: 'application/json',
    PROTOCOL_VERSION: '2.0.0' // X-Restli-Protocol-Version
  },
  SCOPES: {
    SHARE: 'w_member_social',
    PROFILE: 'r_liteprofile',
    EMAIL: 'r_emailaddress',
    OPENID: 'openid',
    PROFILE_OPENID: 'profile',
    EMAIL_OPENID: 'email'
  },
  LIMITS: {
    TEXT_LENGTH: 3000, // Character limit for share commentary
    VISIBILITY_OPTIONS: ['PUBLIC', 'CONNECTIONS']
  },
  ERROR_CODES: {
    400: 'Bad Request - Invalid body or missing fields',
    401: 'Unauthorized - Invalid or expired token',
    403: 'Forbidden - Insufficient scope or permissions',
    422: 'Unprocessable Entity - Semantic errors',
    429: 'Rate Limit Exceeded',
    500: 'Internal Server Error'
  }
};

export const SHARE_REQUEST_STRUCTURE = {
  description: "Request body for /v2/ugcPosts",
  fields: {
    author: "urn:li:person:{id}",
    lifecycleState: "PUBLISHED",
    specificContent: {
        "com.linkedin.ugc.ShareContent": {
            "shareCommentary": {
                "text": "Main post content"
            },
            "shareMediaCategory": "NONE"
        }
    },
    visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
    }
  }
};