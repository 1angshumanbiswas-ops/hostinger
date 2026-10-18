export const getSessionId = () => {
  let sessionId = localStorage.getItem('job_assistant_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
    localStorage.setItem('job_assistant_session_id', sessionId);
  }
  return sessionId;
};

export const getLocalApplications = () => {
  const apps = localStorage.getItem('ja_local_applications');
  return apps ? JSON.parse(apps) : [];
};

export const saveLocalApplication = (application) => {
  const apps = getLocalApplications();
  apps.unshift(application);
  localStorage.setItem('ja_local_applications', JSON.stringify(apps));
  return apps;
};

export const getLocalCV = () => {
  const cv = localStorage.getItem('ja_local_cv');
  return cv ? JSON.parse(cv) : null;
};

export const saveLocalCV = (cvData) => {
  localStorage.setItem('ja_local_cv', JSON.stringify(cvData));
};

export const getLocalJD = () => {
  return localStorage.getItem('ja_local_jd') || '';
};

export const saveLocalJD = (jd) => {
  localStorage.setItem('ja_local_jd', jd);
};