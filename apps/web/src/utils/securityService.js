import { supabase } from '@/lib/customSupabaseClient';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'fraud-detection-security-key-2024';

export const setSessionTimeout = async (userId, minutes) => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: userId,
        timeout_minutes: minutes,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error setting session timeout:', error);
    return { success: false, error: error.message };
  }
};

export const addIPToWhitelist = async (userId, ipAddress) => {
  try {
    const { data: session } = await supabase
      .from('user_sessions')
      .select('ip_whitelist')
      .eq('user_id', userId)
      .single();

    const currentWhitelist = session?.ip_whitelist || [];
    
    if (currentWhitelist.includes(ipAddress)) {
      return { success: false, error: 'IP address already in whitelist' };
    }

    const updatedWhitelist = [...currentWhitelist, ipAddress];

    const { data, error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: userId,
        ip_whitelist: updatedWhitelist,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error adding IP to whitelist:', error);
    return { success: false, error: error.message };
  }
};

export const removeIPFromWhitelist = async (userId, ipAddress) => {
  try {
    const { data: session } = await supabase
      .from('user_sessions')
      .select('ip_whitelist')
      .eq('user_id', userId)
      .single();

    const currentWhitelist = session?.ip_whitelist || [];
    const updatedWhitelist = currentWhitelist.filter(ip => ip !== ipAddress);

    const { data, error } = await supabase
      .from('user_sessions')
      .update({
        ip_whitelist: updatedWhitelist,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error removing IP from whitelist:', error);
    return { success: false, error: error.message };
  }
};

export const logLoginActivity = async (userId, ipAddress, device, location, status) => {
  try {
    const suspicious = await detectSuspiciousLogin(userId, ipAddress, location);

    const { data, error } = await supabase
      .from('login_activity')
      .insert({
        user_id: userId,
        ip_address: ipAddress,
        device: device || 'Unknown',
        location: location || 'Unknown',
        status,
        suspicious: suspicious.isSuspicious,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error logging login activity:', error);
    return { success: false, error: error.message };
  }
};

export const detectSuspiciousLogin = async (userId, ipAddress, location) => {
  try {
    const { data: recentLogins } = await supabase
      .from('login_activity')
      .select('ip_address, location, timestamp')
      .eq('user_id', userId)
      .eq('status', 'success')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (!recentLogins || recentLogins.length === 0) {
      return { isSuspicious: false, reason: 'First login' };
    }

    const knownIPs = recentLogins.map(login => login.ip_address);
    if (!knownIPs.includes(ipAddress)) {
      return { isSuspicious: true, reason: 'New IP address' };
    }

    const knownLocations = recentLogins.map(login => login.location);
    if (location && !knownLocations.includes(location)) {
      return { isSuspicious: true, reason: 'New location' };
    }

    const lastLogin = recentLogins[0];
    const lastLoginTime = new Date(lastLogin.timestamp);
    const currentTime = new Date();
    const timeDiff = (currentTime - lastLoginTime) / 1000 / 60;

    if (timeDiff < 5 && lastLogin.location !== location) {
      return { isSuspicious: true, reason: 'Impossible travel' };
    }

    return { isSuspicious: false, reason: 'Normal activity' };
  } catch (error) {
    console.error('Error detecting suspicious login:', error);
    return { isSuspicious: false, reason: 'Detection error' };
  }
};

export const validatePasswordStrength = (password) => {
  const requirements = {
    minLength: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const strength = Object.values(requirements).filter(Boolean).length;
  const allMet = Object.values(requirements).every(Boolean);

  let strengthLevel = 'weak';
  if (strength >= 5) strengthLevel = 'strong';
  else if (strength >= 3) strengthLevel = 'medium';

  return {
    valid: allMet,
    requirements,
    strength: strengthLevel,
    score: (strength / 5) * 100
  };
};

export const incrementFailedAttempts = async (userId) => {
  try {
    const { data: session } = await supabase
      .from('user_sessions')
      .select('failed_attempts')
      .eq('user_id', userId)
      .single();

    const currentAttempts = (session?.failed_attempts || 0) + 1;
    const maxAttempts = 5;

    let lockedUntil = null;
    if (currentAttempts >= maxAttempts) {
      lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    }

    const { data, error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: userId,
        failed_attempts: currentAttempts,
        locked_until: lockedUntil,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { 
      success: true, 
      failedAttempts: currentAttempts,
      isLocked: !!lockedUntil,
      lockedUntil,
      data 
    };
  } catch (error) {
    console.error('Error incrementing failed attempts:', error);
    return { success: false, error: error.message };
  }
};

export const lockAccount = async (userId, durationMinutes) => {
  try {
    const lockedUntil = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('user_sessions')
      .upsert({
        user_id: userId,
        locked_until: lockedUntil,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, lockedUntil, data };
  } catch (error) {
    console.error('Error locking account:', error);
    return { success: false, error: error.message };
  }
};

export const isAccountLocked = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('locked_until')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data?.locked_until) return { locked: false };

    const lockedUntil = new Date(data.locked_until);
    const now = new Date();

    if (lockedUntil > now) {
      const minutesRemaining = Math.ceil((lockedUntil - now) / 1000 / 60);
      return { locked: true, minutesRemaining };
    }

    await supabase
      .from('user_sessions')
      .update({ 
        locked_until: null,
        failed_attempts: 0,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    return { locked: false };
  } catch (error) {
    console.error('Error checking account lock:', error);
    return { locked: false };
  }
};

export const encryptSensitiveField = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw error;
  }
};

export const decryptSensitiveField = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw error;
  }
};

export const getLoginActivity = async (userId, limit = 50) => {
  try {
    const { data, error } = await supabase
      .from('login_activity')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting login activity:', error);
    return [];
  }
};

export const getIPWhitelist = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .select('ip_whitelist')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.ip_whitelist || [];
  } catch (error) {
    console.error('Error getting IP whitelist:', error);
    return [];
  }
};

export const resetFailedAttempts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_sessions')
      .update({ 
        failed_attempts: 0,
        locked_until: null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error resetting failed attempts:', error);
    return { success: false, error: error.message };
  }
};