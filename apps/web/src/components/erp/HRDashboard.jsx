import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, Phone, MoreHorizontal, UserCheck, UserX, Clock, Users, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { fetchLaborStats } from '@/utils/LaborAPI';
import DataCard from './DataCard';
import { useRefresh } from '@/contexts/RefreshContext';

const HRDashboard = () => {
  const [laborData, setLaborData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { registerCallback, unregisterCallback } = useRefresh();

  const loadLaborData = useCallback(async () => {
    setLoading(true);
    return fetchLaborStats().then(data => {
      setLaborData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadLaborData();
    registerCallback('hr', loadLaborData);
    return () => unregisterCallback('hr');
  }, [loadLaborData, registerCallback, unregisterCallback]);

  const employees = [
    { id: 1, name: 'Alice Johnson', role: 'Senior Developer', dept: 'Engineering', status: 'Active', image: '' },
    { id: 2, name: 'Bob Smith', role: 'Product Manager', dept: 'Product', status: 'On Leave', image: '' },
    { id: 3, name: 'Charlie Davis', role: 'Sales Executive', dept: 'Sales', status: 'Active', image: '' },
    { id: 4, name: 'Diana Evans', role: 'HR Specialist', dept: 'HR', status: 'Active', image: '' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Human Resources</h1>
          <p className="text-slate-500">Employee management and performance tracking</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Departments</Button>
            <Button>Add Employee</Button>
        </div>
      </div>

      {/* --- LABOR STATISTICS --- */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Labor Market Insights (BLS Data)</h3>
            <Button variant="ghost" size="sm" onClick={() => loadLaborData()} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {loading ? (
               Array(5).fill(0).map((_, i) => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl" />)
            ) : (
               laborData.map((item, idx) => (
                  <DataCard 
                    key={idx}
                    title={item.industry}
                    value={item.employed}
                    unit="Emp."
                    trend={item.growth}
                    lastUpdated={item.updated}
                  >
                    <div className="mt-2 text-xs text-slate-500">
                       Wage Growth: <span className="font-semibold text-emerald-600">+{item.wage_growth}%</span>
                    </div>
                  </DataCard>
               ))
            )}
         </div>
      </div>
      {/* --- END SECTION --- */}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
            <CardContent className="p-6 flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-500">Total Employees</span>
                <span className="text-2xl font-bold text-slate-900">142</span>
                <span className="text-xs text-emerald-600 font-medium">+4 this month</span>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6 flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-500">Attendance Rate</span>
                <span className="text-2xl font-bold text-slate-900">96.5%</span>
                <span className="text-xs text-slate-400 font-medium">Last 30 days</span>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6 flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-500">Open Positions</span>
                <span className="text-2xl font-bold text-slate-900">8</span>
                <span className="text-xs text-blue-600 font-medium">View hiring pipeline</span>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-6 flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-500">Upcoming Reviews</span>
                <span className="text-2xl font-bold text-slate-900">12</span>
                <span className="text-xs text-amber-600 font-medium">Due this week</span>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Directory */}
          <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Employee Directory</CardTitle>
                        <CardDescription>Manage your team members</CardDescription>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search employees..." className="pl-9" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {employees.map((emp) => (
                        <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={emp.image} />
                                    <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-slate-900">{emp.name}</p>
                                    <p className="text-xs text-slate-500">{emp.role} • {emp.dept}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant={emp.status === 'Active' ? 'default' : 'secondary'} className={emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}>
                                    {emp.status}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>

          {/* Activity / Notifications */}
          <div className="space-y-6">
             <Card>
                 <CardHeader>
                     <CardTitle className="text-lg">Upcoming Birthdays</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <div className="space-y-4">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">JD</div>
                             <div>
                                 <p className="text-sm font-medium">John Doe</p>
                                 <p className="text-xs text-slate-500">Tomorrow</p>
                             </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">MJ</div>
                             <div>
                                 <p className="text-sm font-medium">Mary Jane</p>
                                 <p className="text-xs text-slate-500">Oct 24</p>
                             </div>
                         </div>
                     </div>
                 </CardContent>
             </Card>

             <Card>
                 <CardHeader>
                     <CardTitle className="text-lg">Leave Requests</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <div className="space-y-3">
                         <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                             <div>
                                 <p className="text-sm font-medium">Sarah Connor</p>
                                 <p className="text-xs text-slate-500">Oct 20-22 (Sick Leave)</p>
                             </div>
                             <div className="flex gap-1">
                                 <Button size="icon" variant="ghost" className="h-6 w-6 text-emerald-600"><UserCheck className="w-4 h-4" /></Button>
                                 <Button size="icon" variant="ghost" className="h-6 w-6 text-red-600"><UserX className="w-4 h-4" /></Button>
                             </div>
                         </div>
                     </div>
                 </CardContent>
             </Card>
          </div>
      </div>
    </div>
  );
};

export default HRDashboard;