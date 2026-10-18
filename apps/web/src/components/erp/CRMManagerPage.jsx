import React, { useState } from 'react';
import { Users, Briefcase, Wallet, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Save, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function CRMManagerPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [metrics, setMetrics] = useState({
    totalLeads: 142,
    activeDeals: 38,
    pipelineValue: 4500000
  });

  const [metricInputs, setMetricInputs] = useState({
    totalLeads: '',
    activeDeals: '',
    pipelineValue: ''
  });

  const [leads, setLeads] = useState([
    { id: 1, name: 'Acme Corp', industry: 'Technology', status: 'Proposal', value: 1200000, date: '2026-04-15' },
    { id: 2, name: 'Global Logistics', industry: 'Supply Chain', status: 'Contacted', value: 850000, date: '2026-04-18' },
    { id: 3, name: 'Retail Plus', industry: 'Retail', status: 'Lead', value: 450000, date: '2026-04-20' },
    { id: 4, name: 'FinTech Solutions', industry: 'Finance', status: 'Closed', value: 2000000, date: '2026-04-12' },
  ]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleUpdateMetric = (key) => {
    const val = parseInt(metricInputs[key].replace(/,/g, ''), 10);
    if (!isNaN(val)) {
      setMetrics(prev => ({ ...prev, [key]: val }));
      toast({ title: "Metric Updated", description: "The dashboard has been updated." });
      setMetricInputs(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleLeadChange = (id, field, value) => {
    setLeads(leads.map(lead => lead.id === id ? { ...lead, [field]: value } : lead));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 relative">
      <header className="bg-slate-900 text-white shadow-sm border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#1f5233] rounded-md flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CRM Portal</h1>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Exit Portal
          </Button>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">CRM Manager</h2>
            <p className="text-muted-foreground mt-1">Manage client relationships, track leads, and monitor pipeline value.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Total Leads</CardTitle>
              <Users className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-slate-900 dark:text-white py-2">{metrics.totalLeads}</div>
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
                <Label className="text-sm font-semibold text-slate-600 dark:text-gray-300">Update Leads</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    value={metricInputs.totalLeads} 
                    onChange={(e) => setMetricInputs({...metricInputs, totalLeads: e.target.value})}
                    className="bg-white dark:bg-background text-slate-900 dark:text-white"
                  />
                  <Button onClick={() => handleUpdateMetric('totalLeads')} className="bg-[#1f5233] text-white hover:bg-[#173d26]">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Active Deals</CardTitle>
              <Briefcase className="w-5 h-5 text-amber-500" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-slate-900 dark:text-white py-2">{metrics.activeDeals}</div>
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
                <Label className="text-sm font-semibold text-slate-600 dark:text-gray-300">Update Deals</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    value={metricInputs.activeDeals} 
                    onChange={(e) => setMetricInputs({...metricInputs, activeDeals: e.target.value})}
                    className="bg-white dark:bg-background text-slate-900 dark:text-white"
                  />
                  <Button onClick={() => handleUpdateMetric('activeDeals')} className="bg-[#1f5233] text-white hover:bg-[#173d26]">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Pipeline Value</CardTitle>
              <Wallet className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-slate-900 dark:text-white py-2 truncate">{formatCurrency(metrics.pipelineValue)}</div>
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
                <Label className="text-sm font-semibold text-slate-600 dark:text-gray-300">Update Value</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    value={metricInputs.pipelineValue} 
                    onChange={(e) => setMetricInputs({...metricInputs, pipelineValue: e.target.value})}
                    className="bg-white dark:bg-background text-slate-900 dark:text-white"
                  />
                  <Button onClick={() => handleUpdateMetric('pipelineValue')} className="bg-[#1f5233] text-white hover:bg-[#173d26]">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Lead Management</CardTitle>
            <Button className="bg-[#1f5233] text-white hover:bg-[#173d26]" onClick={() => toast({ title: "Saved", description: "Changes saved locally." })}>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Client Name</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Industry</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Expected Value (₹)</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Next Follow-up</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <Input 
                          value={lead.name}
                          onChange={(e) => handleLeadChange(lead.id, 'name', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={lead.industry}
                          onChange={(e) => handleLeadChange(lead.id, 'industry', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={lead.status} onValueChange={(val) => handleLeadChange(lead.id, 'status', val)}>
                          <SelectTrigger className="h-8 w-[140px] bg-transparent border-transparent hover:border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lead">Lead</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Proposal">Proposal</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          value={lead.value}
                          onChange={(e) => handleLeadChange(lead.id, 'value', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="date"
                          value={lead.date}
                          onChange={(e) => handleLeadChange(lead.id, 'date', e.target.value)}
                          className="h-8 bg-transparent border-transparent hover:border-border focus:border-border"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-4 pb-8">
          <Button
            onClick={() => navigate('/finance-dashboard')}
            variant="outline"
            className="border-gray-300 text-slate-700 hover:bg-gray-50 flex items-center gap-2 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Finance Hub
          </Button>
          <Button
            onClick={() => navigate('/scm-logistics')}
            className="bg-[#1f5233] text-white hover:bg-[#173d26] shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
          >
            <span className="font-semibold">Go to SCM Logistics</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/finance-dashboard')}
            className="flex items-center gap-2 border-gray-300 text-slate-700 hover:bg-slate-100 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Page 4 of 6
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              CRM Manager
            </span>
          </div>

          <Button
            onClick={() => navigate('/scm-logistics')}
            className="flex items-center gap-2 bg-[#1f5233] text-white hover:bg-[#173d26]"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}