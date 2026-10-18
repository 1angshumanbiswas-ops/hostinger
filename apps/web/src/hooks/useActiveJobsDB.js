import { useState, useCallback } from 'react';
import { fetchJobsFromAPI } from '../utils/ActiveJobsDBService';
import { clearJobsCache } from '../lib/jobsCache';
import { useToast } from '@/components/ui/use-toast';

export function useActiveJobsDB() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const fetchJobs = useCallback(async (filters = {}, offset = 0, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchJobsFromAPI(filters, offset);
      
      setJobs(prev => append ? [...prev, ...results] : results);
      setHasMore(results.length > 0); // basic pagination logic
      return results;
    } catch (err) {
      setError(err.message);
      toast({
        title: 'API Request Failed',
        description: err.message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const clearCache = useCallback(() => {
    clearJobsCache();
    toast({ description: 'API Cache cleared successfully.' });
  }, [toast]);

  const retryFetch = useCallback((filters = {}, offset = 0) => {
    return fetchJobs(filters, offset);
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    hasMore,
    fetchJobs,
    clearCache,
    retryFetch
  };
}