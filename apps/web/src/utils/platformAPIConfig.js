export const PLATFORM_API_CONFIG = {
  facebook: {
    baseUrl: 'https://graph.facebook.com/v18.0',
    endpoints: {
      post: '/{page_id}/feed',
      me: '/me'
    },
    requiredFields: ['message'],
    authMethod: 'Bearer',
    validation: (data) => data.message && data.message.length > 0,
    headers: { 'Content-Type': 'application/json' }
  },
  instagram: {
    baseUrl: 'https://graph.facebook.com/v18.0',
    endpoints: {
      media: '/{ig_user_id}/media',
      publish: '/{ig_user_id}/media_publish'
    },
    requiredFields: ['image_url', 'caption'],
    authMethod: 'Bearer',
    validation: (data) => data.image_url && data.caption,
    headers: { 'Content-Type': 'application/json' }
  },
  linkedin: {
    baseUrl: 'https://api.linkedin.com/v2',
    endpoints: {
      post: '/ugcPosts',
      me: '/me'
    },
    requiredFields: ['author', 'text'],
    authMethod: 'Bearer',
    validation: (data) => data.text && data.text.length > 0,
    headers: { 
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    }
  },
  twitter: {
    baseUrl: 'https://api.twitter.com/2',
    endpoints: {
      tweet: '/tweets'
    },
    requiredFields: ['text'],
    authMethod: 'Bearer', // OAuth 2.0 User Context
    validation: (data) => data.text && data.text.length > 0 && data.text.length <= 280,
    headers: { 'Content-Type': 'application/json' }
  },
  whatsapp: {
    baseUrl: 'https://graph.facebook.com/v18.0',
    endpoints: {
      messages: '/{phone_number_id}/messages'
    },
    requiredFields: ['to', 'text'],
    authMethod: 'Bearer',
    validation: (data) => data.to && data.text,
    headers: { 'Content-Type': 'application/json' }
  },
  youtube: {
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    endpoints: {
      videos: '/videos'
    },
    requiredFields: ['snippet'],
    authMethod: 'Bearer',
    validation: (data) => data.snippet && data.snippet.title,
    headers: { 'Content-Type': 'application/json' }
  },
  snapchat: {
    baseUrl: 'https://adsapi.snapchat.com/v1',
    endpoints: {
      creatives: '/{ad_account_id}/creatives'
    },
    requiredFields: ['name', 'brand_name'],
    authMethod: 'Bearer',
    validation: (data) => data.name && data.brand_name,
    headers: { 'Content-Type': 'application/json' }
  }
};

export const API_ERRORS = {
  MISSING_TOKEN: 'Access token not found for this platform',
  INVALID_DATA: 'Invalid data provided for posting',
  NETWORK_ERROR: 'Network request failed',
  UNAUTHORIZED: 'Unauthorized: Invalid or expired token',
  RATE_LIMIT: 'Rate limit exceeded',
  UNKNOWN: 'An unknown error occurred'
};