import { setCachedJobs, getCachedJobs, isCacheValid } from '../lib/jobsCache';

const API_KEY = '398a7f8074msh222bbb5e8a88e35p1dc02djsn9282c645b6fb';
const API_HOST = 'active-jobs-db.p.rapidapi.com';
const BASE_URL = `https://${API_HOST}/active-ats-1h`;

export const fetchJobsFromAPI = async (filters = {}, offset = 0) => {
  const queryParams = new URLSearchParams();
  queryParams.append('offset', offset);
  queryParams.append('description_type', 'text');

  if (filters.title) {
    // Active jobs DB uses title_filter
    queryParams.append('title_filter', filters.title);
  }
  if (filters.location && filters.location !== 'all') {
    queryParams.append('location_filter', filters.location);
  }

  const queryString = queryParams.toString();
  const cacheKey = `api_jobs_${queryString}`;

  if (isCacheValid(cacheKey)) {
    return getCachedJobs(cacheKey);
  }

  try {
    const response = await fetch(`${BASE_URL}?${queryString}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': API_HOST,
        'x-rapidapi-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Standardize the response format to match our Supabase schema
    const standardizedJobs = (Array.isArray(data) ? data : data.jobs || []).map(job => ({
      id: job.uuid || job.id || `api_${Math.random().toString(36).substr(2, 9)}`,
      title: job.title || 'Untitled Position',
      company: job.company_name || job.company || 'Confidential Company',
      location: job.location || 'Remote',
      description: job.description || 'No description provided.',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      salary_min: job.salary_min || null,
      salary_max: job.salary_max || null,
      job_type: job.job_type || 'Full-time',
      experience_level: job.experience_level || 'Not specified',
      company_logo: job.company_logo_url || job.logo || '',
      external_url: job.url || job.apply_url || '',
      source: 'api',
      created_at: job.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    setCachedJobs(cacheKey, standardizedJobs, 1); // 1 hour TTL
    return standardizedJobs;
  } catch (error) {
    console.error('ActiveJobsDBService Error:', error);
    throw new Error(error.message || 'Failed to fetch jobs from API.');
  }
};