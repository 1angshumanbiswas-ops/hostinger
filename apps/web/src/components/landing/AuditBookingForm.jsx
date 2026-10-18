import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function AuditBookingForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    cart_abandonment_rate: '',
    preferred_time: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('discovery_audits').insert([
        {
          ...formData,
          preferred_time: formData.preferred_time ? new Date(formData.preferred_time).toISOString() : null
        }
      ]);

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Audit Request Received!",
        description: "Our team will be in touch shortly to confirm your booking.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="bg-card border-border shadow-2xl overflow-hidden relative">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-white">You're All Set!</h3>
          <p className="text-muted-foreground max-w-sm">
            We've received your request for a Discovery Audit. One of our specialists will contact you at {formData.email} within 24 hours.
          </p>
          <Button variant="outline" onClick={() => setSuccess(false)} className="mt-8">Submit Another Request</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <CardContent className="p-8 sm:p-10 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name *</label>
              <Input required name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="bg-background border-border text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Company Name *</label>
              <Input required name="company" value={formData.company} onChange={handleChange} placeholder="Acme Corp" className="bg-background border-border text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Work Email *</label>
              <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" className="bg-background border-border text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="bg-background border-border text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Current Cart Abandonment Rate</label>
            <Select onValueChange={(val) => setFormData({...formData, cart_abandonment_rate: val})}>
              <SelectTrigger className="bg-background border-border text-white">
                <SelectValue placeholder="Select an estimate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-50">Under 50%</SelectItem>
                <SelectItem value="50-70">50% - 70%</SelectItem>
                <SelectItem value="over-70">Over 70%</SelectItem>
                <SelectItem value="unknown">I don't know</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Preferred Meeting Time (Local Time)</label>
            <Input type="datetime-local" name="preferred_time" value={formData.preferred_time} onChange={handleChange} className="bg-background border-border text-white" />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg font-bold shadow-lg shadow-primary/20">
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : "Schedule My Free Audit"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">No credit card required. 100% confidential analysis.</p>
        </form>
      </CardContent>
    </Card>
  );
}