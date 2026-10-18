import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, MapPin, DollarSign, Clock, Search, 
  RefreshCw, ExternalLink, Building2, Filter, Globe, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobOpenings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { toast } = useToast();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSource, setFilterSource] = useState('All');

  const sources = ['All', 'LinkedIn', 'Naukri', 'Indeed', 'Glassdoor', 'Instahyre', 'Monster', 'Shine', 'Jobicy'];

  useEffect(() => {
    checkAndRefreshData();
  }, []);

  const checkAndRefreshData = async () => {
    setLoading(true);
    try {
      const { data: latestJob, error: fetchError } = await supabase
        .from('app_job_postings')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;

      const now = new Date();
      let shouldRefresh = false;

      if (!latestJob || latestJob.length === 0) {
        shouldRefresh = true;
      } else {
        const lastFetchTime = new Date(latestJob[0].created_at);
        setLastUpdated(lastFetchTime);
        const hoursDiff = (now - lastFetchTime) / (1000 * 60 * 60);
        if (hoursDiff >= 24) shouldRefresh = true;
      }

      if (shouldRefresh) {
        await refreshJobs();
      } else {
        await fetchJobsFromDB();
      }

    } catch (error) {
      console.error('Error checking data freshness:', error);
      await fetchJobsFromDB();
    } finally {
      setLoading(false);
    }
  };

  const fetchJobsFromDB = async () => {
    const { data, error } = await supabase
      .from('app_job_postings')
      .select('*')
      .order('posted_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs(data || []);
      if (data?.[0]?.created_at) {
        setLastUpdated(new Date(data[0].created_at));
      }
    }
  };

  const refreshJobs = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-jobs');
      if (error) throw error;
      
      toast({
        title: "Sources Refreshed",
        description: `Aggregated latest jobs from ${sources.length - 1} platforms.`,
      });
      
      await fetchJobsFromDB();
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Could not fetch new jobs. Please try again later.",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || job.type.includes(filterType);
    const matchesSource = filterSource === 'All' || (job.source && job.source.includes(filterSource));
    return matchesSearch && matchesType && matchesSource;
  });

  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    return "Just now";
  };

  const getSourceColor = (source) => {
    switch(source?.toLowerCase()) {
      case 'linkedin': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'naukri': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'indeed': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'glassdoor': return 'bg-green-50 text-green-700 border-green-200';
      case 'instahyre': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-[#0f172a] text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Find Your Dream Job</h1>
          <p className="text-slate-300 text-lg">
            Curated opportunities from top tech companies, updated daily by our AI crawler.
          </p>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute right-10 top-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
           <div className="absolute left-10 bottom-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search role, company..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[140px] h-9 bg-slate-50 border-slate-200">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterType(filterType === 'All' ? 'Full-time' : 'All')}
            className={`h-9 ${filterType !== 'All' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {filterType === 'All' ? 'Type' : filterType}
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshJobs}
            disabled={refreshing}
            className="ml-auto h-9 text-slate-500 hover:text-blue-600"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Update' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex justify-between items-center px-2 text-xs text-slate-400 font-medium">
         <span>
            {filteredJobs.length} jobs from {sources.length - 1} sources
         </span>
         {lastUpdated && (
            <span>Updated: {timeAgo(lastUpdated)}</span>
         )}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm animate-pulse flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <motion.div 
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row gap-5"
            >
              <div className="flex-shrink-0">
                {job.company_logo ? (
                  <img 
                    src={job.company_logo} 
                    alt={job.company} 
                    className="w-14 h-14 object-contain rounded-lg border border-slate-100 bg-white p-1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${job.company}&background=f1f5f9&color=64748b`;
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-lg">
                    {job.company?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 truncate pr-4 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-slate-600 text-sm font-medium mt-1">
                      <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      {job.company}
                    </div>
                  </div>
                  
                  {job.source && (
                    <Badge variant="secondary" className={`text-xs font-medium px-2 py-0.5 rounded border ${getSourceColor(job.source)}`}>
                      via {job.source}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-3">
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {job.type}
                  </div>
                  {job.salary && job.salary !== 'Competitive' && (
                    <div className="flex items-center text-green-600 font-medium">
                      <DollarSign className="w-3.5 h-3.5 mr-1" />
                      {job.salary}
                    </div>
                  )}
                  <div className="flex items-center text-slate-400 text-xs ml-auto md:ml-0">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeAgo(job.posted_at)}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex md:flex-col justify-center gap-2 mt-2 md:mt-0 md:border-l border-slate-100 md:pl-5">
                <Button 
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  onClick={() => window.open(job.url, '_blank')}
                >
                  Apply
                  <ExternalLink className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
           <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-slate-400" />
           </div>
           <h3 className="text-lg font-semibold text-slate-900">No jobs found</h3>
           <p className="text-slate-500 mt-1 max-w-xs mx-auto">
             Try adjusting your filters or refreshing the feed to fetch new opportunities.
           </p>
           <Button variant="outline" onClick={refreshJobs} className="mt-4">
              Refresh All Sources
           </Button>
        </div>
      )}
    </div>
  );
};

export default JobOpenings;