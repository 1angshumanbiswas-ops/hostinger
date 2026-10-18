export const SUPER_USER_EMAIL = '1angshuman.biswas@gmail.com';

export const isSuperUser = () => {
  const storedEmail = localStorage.getItem('superUserEmail');
  return storedEmail === SUPER_USER_EMAIL;
};

export const setSuperUserIdentifier = (email) => {
  if (email === SUPER_USER_EMAIL) {
    localStorage.setItem('superUserEmail', email);
  }
};

export const clearSuperUserIdentifier = () => {
  localStorage.removeItem('superUserEmail');
};