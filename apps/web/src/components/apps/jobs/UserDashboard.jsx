import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, ExternalLink, Trash2, Clock, CheckCircle2, XCircle, Briefcase, BookmarkPlus } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!user) return;

      // Fetch saved jobs
      const { data: savedData } = await supabase
        .from('saved_jobs')
        .select('*, jobs(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      setSavedJobs(savedData || []);

      // Fetch applications
      const { data: appData } = await supabase
        .from('applications')
        .select('*, jobs(*)')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });
        
      setApplications(appData || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error loading data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const removeSavedJob = async (jobId) => {
    try {
      await supabase.from('saved_jobs').delete().match({ user_id: user.id, job_id: jobId });
      setSavedJobs(savedJobs.filter(s => s.job_id !== jobId));
      toast({ description: 'Removed from saved jobs' });
    } catch (err) {
      toast({ title: 'Error removing job', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted': return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1"/> Accepted</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1"/> Rejected</Badge>;
      case 'reviewed': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><ExternalLink className="w-3 h-3 mr-1"/> Reviewed</Badge>;
      default: return <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage your job applications and saved opportunities.</p>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 h-12 bg-slate-100">
          <TabsTrigger value="applications" className="data-[state=active]:bg-white rounded-md">My Applications</TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-white rounded-md">Saved Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading applications...</div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="overflow-hidden border-slate-200 hover:border-slate-300 transition-colors">
                  <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 cursor-pointer hover:text-emerald-600" onClick={() => navigate(`/jobs/${app.job_id}`)}>{app.jobs?.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-slate-500 text-sm mt-1">
                        <span className="flex items-center gap-1"><Building2 className="w-4 h-4"/> {app.jobs?.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {app.jobs?.location}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-3 font-medium">Applied on {format(new Date(app.applied_at), 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                      {getStatusBadge(app.status)}
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/jobs/${app.job_id}`)} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                        View Job Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-xl border-dashed">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No applications yet</h3>
              <p className="text-slate-500 mt-1 mb-6">You haven't applied to any jobs yet.</p>
              <Button onClick={() => navigate('/jobs/search')} className="bg-emerald-600 hover:bg-emerald-700">Find Jobs</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved">
          {loading ? (
             <div className="py-12 text-center text-slate-500">Loading saved jobs...</div>
          ) : savedJobs.length > 0 ? (
            <div className="space-y-4">
              {savedJobs.map((saved) => (
                <Card key={saved.id} className="overflow-hidden border-slate-200 hover:border-emerald-200 transition-colors group">
                  <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 cursor-pointer group-hover:text-emerald-600" onClick={() => navigate(`/jobs/${saved.job_id}`)}>{saved.jobs?.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-slate-500 text-sm mt-1">
                        <span className="flex items-center gap-1"><Building2 className="w-4 h-4"/> {saved.jobs?.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {saved.jobs?.location}</span>
                        <Badge variant="outline" className="ml-2 font-normal">{saved.jobs?.job_type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                      <Button variant="outline" className="flex-1 sm:flex-none border-slate-300 text-slate-700" onClick={() => navigate(`/jobs/${saved.job_id}`)}>
                        Apply Now
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0" onClick={() => removeSavedJob(saved.job_id)} title="Remove">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-xl border-dashed">
              <BookmarkPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No saved jobs</h3>
              <p className="text-slate-500 mt-1 mb-6">Jobs you save will appear here for easy access.</p>
              <Button onClick={() => navigate('/jobs/search')} className="bg-emerald-600 hover:bg-emerald-700">Browse Jobs</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}