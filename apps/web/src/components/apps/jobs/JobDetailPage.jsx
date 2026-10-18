import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Clock, Building2, BookmarkPlus, Share2, ArrowLeft, Loader2, Calendar, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import ApplicationModal from './ApplicationModal';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fallbackLogo = "https://images.unsplash.com/photo-1704030459018-88ad4a4c7446?auto=format&fit=crop&q=80&w=200&h=200";

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        // Check if job data was passed via state (for API jobs)
        if (location.state && location.state.jobData) {
          setJob(location.state.jobData);
          setLoading(false);
          // Check saved/applied status if user exists
          if (user) checkUserInteractions(location.state.jobData.id);
          return;
        }

        // Otherwise fetch from Supabase
        const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
        if (error) throw error;
        setJob(data);

        if (user) {
          checkUserInteractions(id);
        }
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Could not load job details', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    const checkUserInteractions = async (jobId) => {
        try {
          const { data: saved } = await supabase.from('saved_jobs').select('id').eq('user_id', user.id).eq('job_id', jobId).maybeSingle();
          if (saved) setIsSaved(true);

          const { data: applied } = await supabase.from('applications').select('id').eq('user_id', user.id).eq('job_id', jobId).maybeSingle();
          if (applied) setHasApplied(true);
        } catch(e) {
          console.error("Interaction check failed", e);
        }
    };

    if (id) fetchJobDetails();
  }, [id, user, toast, location.state]);

  const handleApplyClick = () => {
    if (job?.source === 'api' && job?.external_url) {
       window.open(job.external_url, '_blank', 'noopener,noreferrer');
       return;
    }

    if (!user) {
      navigate('/jobs/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    setModalOpen(true);
  };

  const handleSaveToggle = async () => {
    if (!user) {
      toast({ title: 'Login required', description: 'Please login to save jobs.' });
      return;
    }
    try {
      if (isSaved) {
        await supabase.from('saved_jobs').delete().match({ user_id: user.id, job_id: job.id });
        setIsSaved(false);
        toast({ description: 'Job removed from saved list.' });
      } else {
        await supabase.from('saved_jobs').insert({ user_id: user.id, job_id: job.id });
        setIsSaved(true);
        toast({ description: 'Job saved successfully!' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'External API jobs might not be savable at the moment.', variant: 'destructive' });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ description: 'Link copied to clipboard!' });
  };

  if (loading) return <div className="min-h-screen flex justify-center pt-32"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  if (!job) return <div className="min-h-screen flex justify-center pt-32"><p>Job not found.</p></div>;

  const isApiJob = job.source === 'api';

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => navigate(-1)} className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to jobs
          </button>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex gap-5 items-center">
              <div className="h-20 w-20 bg-white rounded-xl border border-slate-200 p-1 shadow-sm flex-shrink-0 relative">
                <img src={job.company_logo || fallbackLogo} alt="Logo" className="w-full h-full object-cover rounded-lg" onError={(e) => {e.target.src=fallbackLogo}} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
                  {isApiJob && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Partner Listing</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-600 mt-2 text-sm sm:text-base font-medium">
                  <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</span>
                  {job.created_at && (
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Posted {formatDistanceToNow(new Date(job.created_at))} ago</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="icon" 
                className={`flex-shrink-0 h-12 w-12 border-slate-200 ${isSaved ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'}`}
                onClick={handleSaveToggle}
              >
                <BookmarkPlus className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" className="flex-shrink-0 h-12 w-12 border-slate-200 text-slate-500 hover:text-slate-900" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                className={`flex-1 md:flex-none h-12 px-8 font-bold shadow-sm ${isApiJob ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
                onClick={handleApplyClick}
                disabled={hasApplied && !isApiJob}
              >
                {hasApplied && !isApiJob ? 'Applied' : (isApiJob ? <span className="flex items-center gap-2">Apply on Partner Site <ExternalLink className="w-4 h-4"/></span> : 'Apply Now')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">About the Role</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {job.description || "No description provided."}
            </div>
          </section>

          {job.requirements && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Requirements</h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {job.requirements}
              </div>
            </section>
          )}

          {job.benefits && (
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Benefits</h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {job.benefits}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Job Overview</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="w-5 h-5"/></div>
                <div>
                  <p className="font-medium text-slate-900">Salary Range</p>
                  <p className="text-slate-500">
                    {job.salary_min ? `$${job.salary_min.toLocaleString()}` : 'DOE'} 
                    {job.salary_max ? ` - $${job.salary_max.toLocaleString()}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Clock className="w-5 h-5"/></div>
                <div>
                  <p className="font-medium text-slate-900">Job Type</p>
                  <p className="text-slate-500">{job.job_type || 'Full-time'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Building2 className="w-5 h-5"/></div>
                <div>
                  <p className="font-medium text-slate-900">Experience</p>
                  <p className="text-slate-500">{job.experience_level || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplicationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} job={job} />
    </div>
  );
}