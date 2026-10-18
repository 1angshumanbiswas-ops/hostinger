import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, UploadCloud, CheckCircle } from 'lucide-react';

export default function ApplicationModal({ isOpen, onClose, job }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    coverLetter: '',
    resumeUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate file upload delay
      await new Promise(r => setTimeout(r, 800));

      const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        job_id: job.id,
        resume_url: formData.resumeUrl || 'uploaded_resume.pdf',
        cover_letter: formData.coverLetter,
        status: 'pending'
      });

      if (error) throw error;

      setSuccess(true);
      toast({ title: 'Application Submitted!', description: 'The employer will review your application soon.' });
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ ...formData, coverLetter: '', resumeUrl: '' });
      }, 2000);

    } catch (error) {
      toast({ title: 'Submission Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Apply for {job?.title}</DialogTitle>
          <DialogDescription>
            at {job?.company}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Application Sent!</h3>
            <p className="text-slate-500">Good luck with your application.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-white text-slate-900"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="bg-white text-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label>Resume <span className="text-red-500">*</span></Label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF, DOCX up to 5MB</p>
                <Input type="file" className="hidden" required onChange={(e) => setFormData({...formData, resumeUrl: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
              <Textarea 
                id="coverLetter" 
                placeholder="Why are you a great fit for this role?"
                className="min-h-[120px] bg-white text-slate-900"
                value={formData.coverLetter}
                onChange={e => setFormData({...formData, coverLetter: e.target.value})}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}