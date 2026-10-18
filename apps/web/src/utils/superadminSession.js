const SUPERADMIN_EMAIL = '1angshuman.biswas@gmail.com';
const SESSION_KEY = 'superadmin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function setSuperadminSession() {
  const sessionData = {
    email: SUPERADMIN_EMAIL,
    timestamp: Date.now()
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

export function isSuperadminSessionValid() {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return false;

  try {
    const sessionData = JSON.parse(sessionStr);
    const isValid = sessionData.email === SUPERADMIN_EMAIL && 
                    (Date.now() - sessionData.timestamp) < SESSION_DURATION;
    
    if (!isValid) {
      clearSuperadminSession();
    }
    return isValid;
  } catch (e) {
    clearSuperadminSession();
    return false;
  }
}

export function clearSuperadminSession() {
  localStorage.removeItem(SESSION_KEY);
}