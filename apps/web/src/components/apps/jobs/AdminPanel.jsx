import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, ShieldAlert, Loader2, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPanel() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const { toast } = useToast();

  const emptyForm = { title: '', company: '', location: '', salary_min: '', salary_max: '', job_type: 'Full-time', experience_level: 'Mid-level', description: '', requirements: '', benefits: '', featured: false };
  const [formData, setFormData] = useState(emptyForm);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch jobs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job.id);
      setFormData({ ...job, salary_min: job.salary_min || '', salary_max: job.salary_max || '' });
    } else {
      setEditingJob(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        updated_at: new Date().toISOString()
      };

      if (editingJob) {
        const { error } = await supabase.from('jobs').update(payload).eq('id', editingJob);
        if (error) throw error;
        toast({ description: 'Job updated successfully' });
      } else {
        const { error } = await supabase.from('jobs').insert([payload]);
        if (error) throw error;
        toast({ description: 'Job created successfully' });
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (err) {
      toast({ title: 'Save Failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
      toast({ description: 'Job deleted' });
      fetchJobs();
    } catch (err) {
      toast({ title: 'Delete Failed', description: err.message, variant: 'destructive' });
    }
  };

  const toggleFeatured = async (id, currentVal) => {
    try {
      await supabase.from('jobs').update({ featured: !currentVal }).eq('id', id);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><ShieldAlert className="w-8 h-8 text-amber-600"/> Admin Control Panel</h1>
          <p className="text-slate-500 mt-1">Manage job postings and platform data.</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" /> Post New Job
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-lg font-medium text-slate-800">Job Postings Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Job Title & Company</TableHead>
                  <TableHead>Type/Level</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400 mx-auto"/></TableCell></TableRow>
                ) : jobs.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-32 text-center text-slate-500">No jobs found. Create one.</TableCell></TableRow>
                ) : (
                  jobs.map(job => (
                    <TableRow key={job.id}>
                      <TableCell className="pl-6 py-4">
                        <div className="font-semibold text-slate-900">{job.title}</div>
                        <div className="text-sm text-slate-500">{job.company} • {job.location}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-700">{job.job_type}</div>
                        <div className="text-xs text-slate-500">{job.experience_level}</div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {format(new Date(job.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" onClick={() => toggleFeatured(job.id, job.featured)} className={job.featured ? 'text-amber-500' : 'text-slate-300'}>
                          <Star className={`w-5 h-5 ${job.featured ? 'fill-current' : ''}`} />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-8" onClick={() => handleOpenModal(job)}><Edit className="w-4 h-4 mr-1"/> Edit</Button>
                          <Button variant="outline" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleDelete(job.id)}><Trash2 className="w-4 h-4 mr-1"/> Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveJob} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Job Title *</Label><Input required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="bg-white text-slate-900"/></div>
              <div className="space-y-2"><Label>Company *</Label><Input required value={formData.company} onChange={e=>setFormData({...formData, company: e.target.value})} className="bg-white text-slate-900"/></div>
              <div className="space-y-2"><Label>Location</Label><Input value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote, New York..." className="bg-white text-slate-900"/></div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2"><Label>Min Salary</Label><Input type="number" value={formData.salary_min} onChange={e=>setFormData({...formData, salary_min: e.target.value})} placeholder="$" className="bg-white text-slate-900"/></div>
                <div className="space-y-2"><Label>Max Salary</Label><Input type="number" value={formData.salary_max} onChange={e=>setFormData({...formData, salary_max: e.target.value})} placeholder="$" className="bg-white text-slate-900"/></div>
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={formData.job_type} onValueChange={v=>setFormData({...formData, job_type: v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Contract">Contract</SelectItem><SelectItem value="Freelance">Freelance</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select value={formData.experience_level} onValueChange={v=>setFormData({...formData, experience_level: v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent><SelectItem value="Entry-level">Entry-level</SelectItem><SelectItem value="Mid-level">Mid-level</SelectItem><SelectItem value="Senior">Senior</SelectItem><SelectItem value="Lead">Lead</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea required className="min-h-[150px] bg-white text-slate-900" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Requirements</Label>
              <Textarea className="min-h-[100px] bg-white text-slate-900" value={formData.requirements} onChange={e=>setFormData({...formData, requirements: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Benefits</Label>
              <Textarea className="min-h-[80px] bg-white text-slate-900" value={formData.benefits} onChange={e=>setFormData({...formData, benefits: e.target.value})} />
            </div>
            
            <div className="flex items-center space-x-2 pt-2 border-t mt-4 border-slate-100">
              <Switch id="featured" checked={formData.featured} onCheckedChange={v=>setFormData({...formData, featured: v})} />
              <Label htmlFor="featured" className="font-medium text-slate-700">Feature this job listing (highlight on home page)</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={()=>setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Save Job Posting</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}