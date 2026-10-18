import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit2, Users, Briefcase, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function CRMManagerPage() {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [metricId, setMetricId] = useState(null);

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

  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchCRMData();
  }, []);

  const fetchCRMData = async () => {
    try {
      setLoading(true);

      const [metricsResult, leadsResult] = await Promise.all([
        supabase
          .from('crm_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (metricsResult.error && metricsResult.error.code !== 'PGRST116') {
        throw metricsResult.error;
      }

      if (metricsResult.data) {
        setMetricId(metricsResult.data.id);
        setMetrics({
          totalLeads: metricsResult.data.total_leads,
          activeDeals: metricsResult.data.active_deals,
          pipelineValue: metricsResult.data.pipeline_value
        });
      }

      if (leadsResult.error) throw leadsResult.error;
      setLeads((leadsResult.data || []).map(lead => ({ ...lead, isEditing: false })));

    } catch (error) {
      console.error('Error fetching CRM data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load CRM data from database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMetrics = async (updates) => {
    try {
      setUpdating(true);

      if (metricId) {
        const { error } = await supabase
          .from('crm_metrics')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', metricId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('crm_metrics')
          .insert([{
            total_leads: metrics.totalLeads,
            active_deals: metrics.activeDeals,
            pipeline_value: metrics.pipelineValue,
            ...updates
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) setMetricId(data.id);
      }

      toast({
        title: "Success",
        description: "CRM metrics updated successfully."
      });
    } catch (error) {
      console.error('Error updating CRM metrics:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update CRM metrics in database.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleUpdateMetric = async (key) => {
    const val = parseInt(metricInputs[key].replace(/,/g, ''), 10);
    if (!isNaN(val) && val >= 0) {
      const updates = { ...metrics };
      
      if (key === 'totalLeads') updates.totalLeads = val;
      if (key === 'activeDeals') updates.activeDeals = val;
      if (key === 'pipelineValue') updates.pipelineValue = val;

      setMetrics(updates);
      
      await updateMetrics({
        total_leads: updates.totalLeads,
        active_deals: updates.activeDeals,
        pipeline_value: updates.pipelineValue
      });
      
      setMetricInputs(prev => ({ ...prev, [key]: '' }));
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number.",
        variant: "destructive"
      });
    }
  };

  const handleLeadChange = (id, field, value) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, [field]: value } : lead
    ));
  };

  const toggleEdit = (id) => {
    setLeads(leads.map(lead => 
      lead.id === id ? { ...lead, isEditing: !lead.isEditing } : lead
    ));
  };

  const saveLead = async (id) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({
          client_name: lead.client_name,
          industry: lead.industry,
          status: lead.status,
          expected_value: lead.expected_value,
          next_followup: lead.next_followup
        })
        .eq('id', id);

      if (error) throw error;

      toggleEdit(id);
      toast({
        title: "Success",
        description: "Lead updated successfully."
      });
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update lead in database.",
        variant: "destructive"
      });
    }
  };

  const deleteLead = async (id) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLeads(leads.filter(lead => lead.id !== id));
      toast({
        title: "Success",
        description: "Lead deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete lead from database.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f5233] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading CRM data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">CRM Manager</h2>
          <p className="text-muted-foreground mt-1">Manage customer relationships and track business opportunities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Total Leads</CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-foreground">{metrics.totalLeads}</div>
            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-sm font-semibold">Update Leads</Label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  value={metricInputs.totalLeads} 
                  onChange={(e) => setMetricInputs({...metricInputs, totalLeads: e.target.value})}
                  className="bg-background text-foreground"
                  disabled={updating}
                />
                <Button 
                  onClick={() => handleUpdateMetric('totalLeads')} 
                  className="bg-[#1f5233] text-white hover:bg-[#173d26]"
                  disabled={updating || !metricInputs.totalLeads}
                >
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Active Deals</CardTitle>
            <Briefcase className="w-5 h-5 text-amber-600" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-foreground">{metrics.activeDeals}</div>
            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-sm font-semibold">Update Deals</Label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  value={metricInputs.activeDeals} 
                  onChange={(e) => setMetricInputs({...metricInputs, activeDeals: e.target.value})}
                  className="bg-background text-foreground"
                  disabled={updating}
                />
                <Button 
                  onClick={() => handleUpdateMetric('activeDeals')} 
                  className="bg-[#1f5233] text-white hover:bg-[#173d26]"
                  disabled={updating || !metricInputs.activeDeals}
                >
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Pipeline Value</CardTitle>
            <Wallet className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-foreground truncate">
              {formatCurrency(metrics.pipelineValue)}
            </div>
            <div className="space-y-3 pt-4 border-t border-border/50">
              <Label className="text-sm font-semibold">Update Value</Label>
              <div className="flex gap-2">
                <Input 
                  type="number"
                  value={metricInputs.pipelineValue} 
                  onChange={(e) => setMetricInputs({...metricInputs, pipelineValue: e.target.value})}
                  className="bg-background text-foreground"
                  disabled={updating}
                />
                <Button 
                  onClick={() => handleUpdateMetric('pipelineValue')} 
                  className="bg-[#1f5233] text-white hover:bg-[#173d26]"
                  disabled={updating || !metricInputs.pipelineValue}
                >
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card shadow-sm border-border">
        <CardHeader className="pb-0 border-b border-border/50 mb-4">
          <CardTitle className="text-lg font-bold pb-4">Lead Management</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="min-w-[180px] font-semibold text-foreground">Client Name</TableHead>
                  <TableHead className="min-w-[150px] font-semibold text-foreground">Industry</TableHead>
                  <TableHead className="min-w-[120px] font-semibold text-foreground">Status</TableHead>
                  <TableHead className="min-w-[150px] font-semibold text-foreground">Expected Value (₹)</TableHead>
                  <TableHead className="min-w-[140px] font-semibold text-foreground">Next Follow-up</TableHead>
                  <TableHead className="w-[120px] text-right font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No leads found in CRM database.
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        {lead.isEditing ? (
                          <Input 
                            type="text"
                            value={lead.client_name}
                            onChange={(e) => handleLeadChange(lead.id, 'client_name', e.target.value)}
                            placeholder="Client name"
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span className="font-medium">{lead.client_name || '—'}</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {lead.isEditing ? (
                          <Input 
                            type="text"
                            value={lead.industry}
                            onChange={(e) => handleLeadChange(lead.id, 'industry', e.target.value)}
                            placeholder="Industry"
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span>{lead.industry || '—'}</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {lead.isEditing ? (
                          <Select 
                            value={lead.status} 
                            onValueChange={(value) => handleLeadChange(lead.id, 'status', value)}
                          >
                            <SelectTrigger className="h-9 w-full bg-background">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Proposal">Proposal</SelectItem>
                              <SelectItem value="Contacted">Contacted</SelectItem>
                              <SelectItem value="Lead">Lead</SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                            ${lead.status === 'Closed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                              lead.status === 'Proposal' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                              lead.status === 'Contacted' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                              'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}`}
                          >
                            {lead.status || '—'}
                          </span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {lead.isEditing ? (
                          <Input 
                            type="number"
                            value={lead.expected_value}
                            onChange={(e) => handleLeadChange(lead.id, 'expected_value', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span className="font-semibold text-[#1f5233]">
                            {formatCurrency(lead.expected_value || 0)}
                          </span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {lead.isEditing ? (
                          <Input 
                            type="date"
                            value={lead.next_followup || ''}
                            onChange={(e) => handleLeadChange(lead.id, 'next_followup', e.target.value)}
                            className="h-9 w-full bg-background"
                          />
                        ) : (
                          <span className="text-sm">
                            {lead.next_followup ? new Date(lead.next_followup).toLocaleDateString('en-IN') : '—'}
                          </span>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {lead.isEditing ? (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => saveLead(lead.id)}
                              className="h-8 w-8 text-[#1f5233] hover:text-[#173d26] hover:bg-[#1f5233]/10"
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleEdit(lead.id)}
                              className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteLead(lead.id)}
                            className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
}