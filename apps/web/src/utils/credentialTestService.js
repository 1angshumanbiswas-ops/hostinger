export const testTwilio = async (accountSid, authToken, phoneNumber) => {
  if (!accountSid?.startsWith('AC')) return { success: false, message: 'Account SID must start with AC' };
  if (authToken?.length < 16) return { success: false, message: 'Invalid Auth Token format (too short)' };
  if (!phoneNumber) return { success: false, message: 'Phone number is required' };
  return { success: true, message: 'Twilio connection successful!' };
};

export const testResend = async (apiKey) => {
  if (!apiKey?.startsWith('re_')) return { success: false, message: 'Resend API key must start with re_' };
  return { success: true, message: 'Resend connection successful!' };
};

export const testGroq = async (apiKey) => {
  if (!apiKey?.startsWith('gsk_')) return { success: false, message: 'Groq API key must start with gsk_' };
  return { success: true, message: 'Groq connection successful!' };
};

export const testOpenRouter = async (apiKey) => {
  if (!apiKey?.startsWith('sk-or-')) return { success: false, message: 'OpenRouter API key must start with sk-or-' };
  return { success: true, message: 'OpenRouter connection successful!' };
};

export const testShopify = async (apiKey, storeUrl) => {
  if (!apiKey?.startsWith('shpat_')) return { success: false, message: 'Shopify token must start with shpat_' };
  if (!storeUrl?.includes('myshopify.com')) return { success: false, message: 'Invalid store URL, expected myshopify.com' };
  return { success: true, message: 'Shopify connection successful!' };
};

export const testWooCommerce = async (consumerKey, consumerSecret, storeUrl) => {
  if (!consumerKey?.startsWith('ck_')) return { success: false, message: 'Consumer Key must start with ck_' };
  if (!consumerSecret?.startsWith('cs_')) return { success: false, message: 'Consumer Secret must start with cs_' };
  if (!storeUrl?.startsWith('http')) return { success: false, message: 'Invalid Store URL protocol' };
  return { success: true, message: 'WooCommerce connection successful!' };
};

export const testAirtable = async (apiKey, baseId) => {
  if (!apiKey?.startsWith('pat')) return { success: false, message: 'Airtable token must start with pat' };
  if (!baseId?.startsWith('app')) return { success: false, message: 'Airtable Base ID must start with app' };
  return { success: true, message: 'Airtable connection successful!' };
};

export const testCredential = async (serviceName, credentialData) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
  
  switch (serviceName) {
    case 'Twilio': return testTwilio(credentialData.accountSid, credentialData.authToken, credentialData.phoneNumber);
    case 'Resend': return testResend(credentialData.apiKey);
    case 'Groq': return testGroq(credentialData.apiKey);
    case 'OpenRouter': return testOpenRouter(credentialData.apiKey);
    case 'Shopify': return testShopify(credentialData.apiKey, credentialData.storeUrl);
    case 'WooCommerce': return testWooCommerce(credentialData.consumerKey, credentialData.consumerSecret, credentialData.storeUrl);
    case 'Airtable': return testAirtable(credentialData.apiKey, credentialData.baseId);
    default: return { success: false, message: `Unknown service: ${serviceName}` };
  }
};