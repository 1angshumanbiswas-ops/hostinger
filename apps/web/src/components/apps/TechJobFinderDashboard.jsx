import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Briefcase, MapPin, DollarSign, Clock, Building, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stripHtmlTags } from '@/utils/htmlParser';

const TechJobFinderDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Changed to 'jobs' table to include external_url, requirements, benefits, experience_level
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = (job.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (job.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = jobTypeFilter === 'All' || job.job_type === jobTypeFilter || (!job.job_type && jobTypeFilter === 'All');
    
    return matchesSearch && matchesType;
  });

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];

  const formatSalary = (min, max) => {
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <Briefcase className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Tech Job Finder</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search by job title or company..." 
                className="pl-10 h-12 text-base border-gray-200 bg-gray-50 focus:bg-white transition-colors text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map(type => (
                <Button
                  key={type}
                  variant={jobTypeFilter === type ? "default" : "outline"}
                  onClick={() => setJobTypeFilter(type)}
                  className={`h-12 px-6 ${jobTypeFilter === type ? 'bg-primary text-primary-foreground' : 'text-gray-600 border-gray-200'}`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-gray-500 font-medium">Fetching latest tech opportunities...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Failed to load jobs</h3>
            <p className="mb-4">{error}</p>
            <Button variant="outline" onClick={fetchJobs} className="bg-white hover:bg-red-50">Try Again</Button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white border border-gray-100 px-6 py-16 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
            <Search className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 max-w-md">Try adjusting your search terms or filters to find what you're looking for.</p>
            {(searchTerm || jobTypeFilter !== 'All') && (
              <Button 
                variant="link" 
                onClick={() => { setSearchTerm(''); setJobTypeFilter('All'); }}
                className="mt-4 text-primary"
              >
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-gray-100 hover:border-primary/30 group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary font-medium rounded-full px-3 py-1 border-0">
                          {job.job_type || 'Not specified'}
                        </Badge>
                        {job.created_at && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-grow space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Building className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                        <span className="font-medium truncate">{job.company || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                        <span className="truncate">{job.location || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 shrink-0 text-gray-400" />
                        <span className="truncate">{formatSalary(job.salary_min, job.salary_max) || 'Not specified'}</span>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-4 border-t border-gray-50">
                      <Button 
                        variant="default" 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => openJobDetails(job)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white">
          {selectedJob && (() => {
            const applyUrl = selectedJob.source_url || selectedJob.application_link || selectedJob.external_url || selectedJob.url;
            
            return (
              <>
                <div className="p-6 pb-0 border-b border-gray-100 shrink-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedJob.title || 'Not specified'}
                      </DialogTitle>
                      <div className="flex flex-wrap items-center text-gray-600 gap-x-4 gap-y-2 mb-4">
                        <span className="flex items-center font-medium">
                          <Building className="w-4 h-4 mr-1.5 text-gray-400" />
                          {selectedJob.company || 'Not specified'}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                          {selectedJob.location || 'Not specified'}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1.5 text-gray-400" />
                          {formatSalary(selectedJob.salary_min, selectedJob.salary_max) || 'Not specified'}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                          {selectedJob.job_type || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow text-gray-700">
                  <div className="space-y-6">
                    {selectedJob.experience_level && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Experience Level</h4>
                        <p className="text-gray-600">{selectedJob.experience_level}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">About the Role</h4>
                      <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {stripHtmlTags(selectedJob.description) || 'Not specified'}
                      </div>
                    </div>

                    {selectedJob.requirements && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
                        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {stripHtmlTags(selectedJob.requirements)}
                        </div>
                      </div>
                    )}

                    {selectedJob.benefits && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h4>
                        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {stripHtmlTags(selectedJob.benefits)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter className="p-6 pt-4 border-t border-gray-100 shrink-0 bg-gray-50 flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto bg-white">
                    Close
                  </Button>
                  <Button 
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90" 
                    disabled={!applyUrl}
                    onClick={() => {
                      if (applyUrl) {
                        window.open(applyUrl, '_blank');
                      }
                    }}
                  >
                    Apply Now <Briefcase className="w-4 h-4 ml-2" />
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechJobFinderDashboard;