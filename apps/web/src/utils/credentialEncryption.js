import CryptoJS from 'crypto-js';

const defaultKey = 'default-dev-key-1234567890123456';

export const generateEncryptionKey = () => {
  return import.meta.env.VITE_ENCRYPTION_KEY || defaultKey;
};

export const encryptCredential = (data, encryptionKey = generateEncryptionKey()) => {
  try {
    const jsonStr = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, encryptionKey).toString();
  } catch (error) {
    console.error('Encryption failed', error);
    return null;
  }
};

export const decryptCredential = (encryptedData, encryptionKey = generateEncryptionKey()) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error('Decryption failed', error);
    return null;
  }
};

export const maskCredential = (value) => {
  if (!value) return '';
  if (value.length <= 4) return '****';
  return '*'.repeat(value.length - 4) + value.slice(-4);
};

export const validateCredentialFormat = (service, data) => {
  if (!data || Object.keys(data).length === 0) return false;
  
  switch(service) {
    case 'Twilio': return !!data.accountSid && !!data.authToken && !!data.phoneNumber;
    case 'Resend': return !!data.apiKey && data.apiKey.startsWith('re_');
    case 'Groq': return !!data.apiKey && data.apiKey.startsWith('gsk_');
    case 'OpenRouter': return !!data.apiKey && data.apiKey.startsWith('sk-or-');
    case 'Shopify': return !!data.apiKey && data.apiKey.startsWith('shpat_') && !!data.storeUrl;
    case 'WooCommerce': return !!data.consumerKey && !!data.consumerSecret && !!data.storeUrl;
    case 'Airtable': return !!data.apiKey && !!data.baseId;
    default: return false;
  }
};