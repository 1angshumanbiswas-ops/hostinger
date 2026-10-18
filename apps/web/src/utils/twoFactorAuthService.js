import { supabase } from '@/lib/customSupabaseClient';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'fraud-detection-2fa-secret-key';
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const generateTOTPSecret = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += chars[Math.floor(Math.random() * chars.length)];
  }
  return secret;
};

export const generateQRCode = (secret, email) => {
  const issuer = 'FraudDetectionSystem';
  const otpauthUrl = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
  return otpauthUrl;
};

export const verifyTOTPToken = (secret, token) => {
  try {
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    
    for (let i = 0; i < secret.length; i++) {
      const val = base32chars.indexOf(secret.charAt(i).toUpperCase());
      bits += val.toString(2).padStart(5, '0');
    }
    
    const hexSecret = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      hexSecret.push(parseInt(bits.substr(i, 8), 2));
    }

    const time = Math.floor(Date.now() / 1000 / 30);
    const timeHex = time.toString(16).padStart(16, '0');
    
    const hmac = CryptoJS.HmacSHA1(
      CryptoJS.enc.Hex.parse(timeHex),
      CryptoJS.lib.WordArray.create(hexSecret)
    );
    
    const hmacHex = hmac.toString(CryptoJS.enc.Hex);
    const offset = parseInt(hmacHex.substring(hmacHex.length - 1), 16);
    const otp = (parseInt(hmacHex.substr(offset * 2, 8), 16) & 0x7fffffff) % 1000000;
    
    const generatedToken = otp.toString().padStart(6, '0');
    return generatedToken === token;
  } catch (error) {
    console.error('Error verifying TOTP token:', error);
    return false;
  }
};

export const generateBackupCodes = (count = 10) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
};

export const sendSMSCode = async (phoneNumber) => {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`SMS Code for ${phoneNumber}: ${code}`);
    
    await supabase
      .from('two_factor_settings')
      .update({ 
        verification_code: code,
        code_sent_at: new Date().toISOString()
      })
      .eq('phone_number', phoneNumber);

    return { success: true, message: 'SMS code sent successfully' };
  } catch (error) {
    console.error('Error sending SMS code:', error);
    return { success: false, error: error.message };
  }
};

export const verifySMSCode = async (phoneNumber, code) => {
  try {
    const { data, error } = await supabase
      .from('two_factor_settings')
      .select('verification_code, code_sent_at')
      .eq('phone_number', phoneNumber)
      .single();

    if (error) throw error;

    const codeSentAt = new Date(data.code_sent_at);
    const now = new Date();
    const timeElapsed = now - codeSentAt;

    if (timeElapsed > 10 * 60 * 1000) {
      return { success: false, error: 'Code expired' };
    }

    if (data.verification_code === code) {
      return { success: true };
    }

    return { success: false, error: 'Invalid code' };
  } catch (error) {
    console.error('Error verifying SMS code:', error);
    return { success: false, error: error.message };
  }
};

export const storeTwoFactorSettings = async (userId, settings) => {
  try {
    const encryptedSecret = settings.totp_secret 
      ? CryptoJS.AES.encrypt(settings.totp_secret, ENCRYPTION_KEY).toString()
      : null;

    const { data, error } = await supabase
      .from('two_factor_settings')
      .upsert({
        user_id: userId,
        totp_secret: encryptedSecret,
        phone_number: settings.phone_number,
        backup_codes: settings.backup_codes,
        enabled: settings.enabled,
        method: settings.method,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error storing 2FA settings:', error);
    return { success: false, error: error.message };
  }
};

export const validateRateLimit = async (userId, attemptType) => {
  try {
    const { data, error } = await supabase
      .from('two_factor_settings')
      .select('verification_attempts, last_attempt_at')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return { allowed: true, remaining: MAX_ATTEMPTS };
    }

    const lastAttempt = data.last_attempt_at ? new Date(data.last_attempt_at) : null;
    const now = new Date();

    if (lastAttempt && (now - lastAttempt) > RATE_LIMIT_WINDOW) {
      await supabase
        .from('two_factor_settings')
        .update({ verification_attempts: 0 })
        .eq('user_id', userId);
      
      return { allowed: true, remaining: MAX_ATTEMPTS };
    }

    const attempts = data.verification_attempts || 0;
    
    if (attempts >= MAX_ATTEMPTS) {
      const timeRemaining = RATE_LIMIT_WINDOW - (now - lastAttempt);
      return { 
        allowed: false, 
        remaining: 0,
        retryAfter: Math.ceil(timeRemaining / 1000 / 60)
      };
    }

    await supabase
      .from('two_factor_settings')
      .update({ 
        verification_attempts: attempts + 1,
        last_attempt_at: now.toISOString()
      })
      .eq('user_id', userId);

    return { allowed: true, remaining: MAX_ATTEMPTS - attempts - 1 };
  } catch (error) {
    console.error('Error validating rate limit:', error);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }
};

export const createSession = async (userId, twoFactorVerified) => {
  try {
    const sessionToken = CryptoJS.lib.WordArray.random(32).toString();

    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        session_token: sessionToken,
        two_factor_verified: twoFactorVerified,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, sessionToken, data };
  } catch (error) {
    console.error('Error creating session:', error);
    return { success: false, error: error.message };
  }
};

export const getTwoFactorSettings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('two_factor_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (data && data.totp_secret) {
      const decryptedSecret = CryptoJS.AES.decrypt(data.totp_secret, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
      return { ...data, totp_secret: decryptedSecret };
    }

    return data;
  } catch (error) {
    console.error('Error getting 2FA settings:', error);
    return null;
  }
};