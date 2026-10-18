import React, { useState } from 'react';
import { Loader2, Save, X, Building2, User, Mail, Phone, DollarSign, Briefcase } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const INDUSTRIES = [
  "Technology", 
  "Finance", 
  "Healthcare", 
  "Retail", 
  "Manufacturing", 
  "Education", 
  "Real Estate", 
  "Other"
];

const STATUS_OPTIONS = [
  "New", 
  "Discovery", 
  "Proposal", 
  "Negotiation"
];

const AddLeadModal = ({ isOpen, onClose, onLeadAdded }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    status: 'New',
    value: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive Validation
    const requiredFields = ['name', 'email', 'phone', 'company', 'industry', 'status', 'value'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in all fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('app_crm_leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            industry: formData.industry,
            status: formData.status,
            value: parseFloat(formData.value),
            last_contact: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Lead Successfully Added",
        description: `${formData.name} from ${formData.company} has been added to the pipeline.`,
        className: "bg-blue-50 border-blue-200 text-blue-700"
      });

      onLeadAdded();
      handleClose();
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        title: "Error Creating Lead",
        description: "There was a problem saving your lead. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      industry: '',
      status: 'New',
      value: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white text-slate-900 border-slate-200 shadow-xl p-0 overflow-hidden rounded-2xl">
        <div className="bg-blue-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Add New Lead
            </DialogTitle>
            <DialogDescription className="text-blue-100">
              Enter details for the new prospective client. All fields are required.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Deal Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">
              Deal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" /> Company Name
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => handleSelectChange('industry', value)}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm font-medium flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Deal Value
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="25,000"
                    className="pl-7 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Stage</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isSubmitting}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Lead
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;