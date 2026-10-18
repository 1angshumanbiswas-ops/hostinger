import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Search, Filter, Loader2, RefreshCcw } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import JobCard from './JobCard';
import JobFilterPanel from './JobFilterPanel';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useActiveJobsDB } from '@/hooks/useActiveJobsDB';

export default function JobListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [dbJobs, setDbJobs] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [savedJobIds, setSavedJobIds] = useState([]);
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { 
    jobs: apiJobs, 
    loading: apiLoading, 
    error: apiError, 
    fetchJobs: fetchApiJobs,
    retryFetch
  } = useActiveJobsDB();

  const [filters, setFilters] = useState({
    presetTitles: [],
    type: [],
    level: [],
    location: 'all'
  });

  const fetchDbJobs = useCallback(async () => {
    setDbLoading(true);
    try {
      let query = supabase.from('jobs').select('*');

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      if (filters.presetTitles && filters.presetTitles.length > 0) {
         // Using or to match any of the selected titles
         const titleFilters = filters.presetTitles.map(t => `title.ilike.%${t}%`).join(',');
         query = query.or(titleFilters);
      }
      if (filters.type && filters.type.length > 0) {
        query = query.in('job_type', filters.type);
      }
      if (filters.level && filters.level.length > 0) {
        query = query.in('experience_level', filters.level);
      }
      if (filters.location && filters.location !== 'all') {
         if (filters.location.toLowerCase() === 'remote') {
             query = query.ilike('location', '%remote%');
         } else if (filters.location.toLowerCase() === 'onsite') {
             query = query.not('location', 'ilike', '%remote%');
         } else {
             query = query.ilike('location', `%${filters.location}%`);
         }
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setDbJobs(data || []);

      if (user) {
        const { data: saved } = await supabase
          .from('saved_jobs')
          .select('job_id')
          .eq('user_id', user.id);
        if (saved) {
          setSavedJobIds(saved.map(s => s.job_id));
        }
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Database Error', description: 'Failed to load internal jobs', variant: 'destructive' });
    } finally {
      setDbLoading(false);
    }
  }, [filters, searchTerm, user, toast]);

  const loadAllJobs = useCallback(() => {
    fetchDbJobs();
    
    // Construct API filters
    const apiFilters = {
      title: filters.presetTitles?.length > 0 ? filters.presetTitles[0] : searchTerm, // API might only take one string effectively, we prioritize preset
      location: filters.location !== 'all' && filters.location !== 'onsite' ? filters.location : null
    };
    fetchApiJobs(apiFilters, 0);
  }, [fetchDbJobs, fetchApiJobs, filters, searchTerm]);

  useEffect(() => {
    loadAllJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Initial load only, manual apply for subsequent

  const handleApplyFilters = () => {
    setSearchParams(searchTerm ? { q: searchTerm } : {});
    loadAllJobs();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchParams({});
    setFilters({ presetTitles: [], type: [], level: [], location: 'all' });
    // setTimeout to ensure state updates before fetch
    setTimeout(() => {
      fetchDbJobs();
      fetchApiJobs({}, 0);
    }, 0);
  };

  const handleSaveToggle = async (jobId, isCurrentlySaved) => {
    if (!user) {
      toast({ title: 'Login required', description: 'Please login to save jobs.' });
      return;
    }
    
    try {
      if (isCurrentlySaved) {
        await supabase.from('saved_jobs').delete().match({ user_id: user.id, job_id: jobId });
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
        toast({ description: 'Job removed from saved list.' });
      } else {
        // For API jobs, we might need to store them locally first if they aren't in DB
        // Simplified for this scope: assume external jobs store ID as string just fine.
        await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: jobId });
        setSavedJobIds(prev => [...prev, jobId]);
        toast({ description: 'Job saved successfully!' });
      }
    } catch (err) {
      // It might fail if job_id uuid constraint is strict and API returns non-uuid.
      // In a real app, API jobs would be cached into a local DB table first or saved_jobs schema updated.
      toast({ title: 'Error', description: 'Could not save this job. It may be an external listing not supported for saving.', variant: 'destructive' });
    }
  };

  // Combine and sort
  const combinedJobs = [...dbJobs, ...apiJobs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const isLoading = dbLoading || apiLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters - Desktop */}
        <div className="hidden md:block w-72 flex-shrink-0">
          <div className="sticky top-24 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-slate-900 border-b pb-4">Advanced Filters</h3>
            <JobFilterPanel 
              filters={filters} 
              setFilters={setFilters} 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Job Listings</h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing <strong>{combinedJobs.length}</strong> opportunities 
                {apiJobs.length > 0 && ` (including ${apiJobs.length} from external partners)`}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {apiError && (
                 <Button variant="outline" size="sm" onClick={() => retryFetch()} className="text-red-600 border-red-200 hover:bg-red-50">
                   <RefreshCcw className="w-4 h-4 mr-2" /> Retry API
                 </Button>
              )}
              {/* Mobile Filter Trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden border-slate-200">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle>Filter Jobs</SheetTitle>
                  </SheetHeader>
                  <JobFilterPanel 
                    filters={filters} 
                    setFilters={setFilters} 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex gap-4">
                     <Skeleton className="h-14 w-14 rounded-lg" />
                     <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                     </div>
                  </div>
                  <div className="flex gap-2"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-24 rounded-full" /></div>
                  <div className="grid grid-cols-2 gap-2 mt-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /></div>
                </div>
              ))}
            </div>
          ) : combinedJobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {combinedJobs.map(job => (
                <JobCard key={job.id} job={job} savedJobs={savedJobIds} onSave={handleSaveToggle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-500 max-w-md mx-auto">We couldn't find any jobs matching your current filters across our internal database and external partners.</p>
              <Button 
                variant="outline" 
                className="mt-6 border-slate-300"
                onClick={handleClearFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}