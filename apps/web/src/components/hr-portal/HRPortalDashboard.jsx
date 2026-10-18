import React, { useState, useEffect } from 'react';
import { Users, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function HRPortalDashboard() {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [metricId, setMetricId] = useState(null);
  
  const [totalStaff, setTotalStaff] = useState(1245);
  const [staffInput, setStaffInput] = useState('');
  
  const [leaveRequests, setLeaveRequests] = useState(42);
  const [leaveInput, setLeaveInput] = useState('');

  const [attritionRisk, setAttritionRisk] = useState('Low');
  const [attritionStatus, setAttritionStatus] = useState('Stable');

  useEffect(() => {
    fetchHRMetrics();
  }, []);

  const fetchHRMetrics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hr_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setMetricId(data.id);
        setTotalStaff(data.total_staff);
        setLeaveRequests(data.leave_requests);
        setAttritionRisk(data.attrition_risk);
        setAttritionStatus(data.attrition_status);
      }
    } catch (error) {
      console.error('Error fetching HR metrics:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load HR metrics from database.",
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
          .from('hr_metrics')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', metricId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('hr_metrics')
          .insert([{
            total_staff: totalStaff,
            leave_requests: leaveRequests,
            attrition_risk: attritionRisk,
            attrition_status: attritionStatus,
            ...updates
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) setMetricId(data.id);
      }

      toast({
        title: "Success",
        description: "HR metrics updated successfully."
      });
    } catch (error) {
      console.error('Error updating HR metrics:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update HR metrics in database.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStaff = async () => {
    const val = parseInt(staffInput.replace(/,/g, ''), 10);
    if (!isNaN(val) && val > 0) {
      setTotalStaff(val);
      await updateMetrics({ total_staff: val });
      setStaffInput('');
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid staff count.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateLeaves = async () => {
    const val = parseInt(leaveInput.replace(/,/g, ''), 10);
    if (!isNaN(val) && val >= 0) {
      setLeaveRequests(val);
      await updateMetrics({ leave_requests: val });
      setLeaveInput('');
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of leave requests.",
        variant: "destructive"
      });
    }
  };

  const handleToggleRisk = async (isHigh) => {
    const newRisk = isHigh ? 'High' : 'Low';
    const newStatus = isHigh ? 'Critical' : 'Stable';
    setAttritionRisk(newRisk);
    setAttritionStatus(newStatus);
    await updateMetrics({
      attrition_risk: newRisk,
      attrition_status: newStatus
    });
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f5233] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading HR metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">HR Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Manage your workforce metrics and analyze organizational health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Total Staff</CardTitle>
            <Users className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-slate-900 dark:text-white py-2">
              {totalStaff.toLocaleString()}
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
              <Label htmlFor="staff-input" className="text-sm font-semibold text-slate-600 dark:text-gray-300">
                Update Staff Count
              </Label>
              <div className="flex flex-col gap-3">
                <Input 
                  id="staff-input"
                  type="number"
                  value={staffInput} 
                  onChange={(e) => setStaffInput(e.target.value)}
                  className="bg-white dark:bg-background text-slate-900 dark:text-white focus-visible:ring-[#1f5233]"
                  placeholder="Enter new count"
                  disabled={updating}
                />
                <Button 
                  onClick={handleUpdateStaff}
                  className="bg-[#1f5233] text-white hover:bg-[#173d26] font-medium w-full shadow-sm"
                  disabled={updating || !staffInput}
                >
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Leave Requests</CardTitle>
            <Calendar className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-slate-900 dark:text-white py-2">
              {leaveRequests}
            </div>
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-border">
              <Label htmlFor="leave-input" className="text-sm font-semibold text-slate-600 dark:text-gray-300">
                Update Leave Requests
              </Label>
              <div className="flex flex-col gap-3">
                <Input 
                  id="leave-input"
                  type="number"
                  value={leaveInput} 
                  onChange={(e) => setLeaveInput(e.target.value)}
                  className="bg-white dark:bg-background text-slate-900 dark:text-white focus-visible:ring-[#1f5233]"
                  placeholder="Enter leave requests"
                  disabled={updating}
                />
                <Button 
                  onClick={handleUpdateLeaves}
                  className="bg-[#1f5233] text-white hover:bg-[#173d26] font-medium w-full shadow-sm"
                  disabled={updating || !leaveInput}
                >
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card shadow-sm border-gray-200 dark:border-border flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Attrition Risk</CardTitle>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col">
            <div className="flex gap-2 py-2">
              <Button
                variant={attritionRisk === 'Low' ? "default" : "outline"}
                onClick={() => handleToggleRisk(false)}
                className={`flex-1 transition-colors ${attritionRisk === 'Low' ? 'bg-[#1f5233] text-white hover:bg-[#173d26]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                disabled={updating}
              >
                Low
              </Button>
              <Button
                variant={attritionRisk === 'High' ? "default" : "outline"}
                onClick={() => handleToggleRisk(true)}
                className={`flex-1 transition-colors ${attritionRisk === 'High' ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}
                disabled={updating}
              >
                High
              </Button>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-border">
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-gray-100 dark:border-gray-800 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-slate-600 dark:text-gray-400">Current Status</Label>
                  {attritionRisk === 'High' ? (
                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 font-semibold px-2.5 py-0.5 border-0">
                      Critical
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold px-2.5 py-0.5 border-0">
                      Stable
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {attritionRisk === 'High'
                    ? "High risk profile active. Employee retention programs require immediate attention and intervention."
                    : "Low risk profile active. Employee retention programs are performing optimally across all departments."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}