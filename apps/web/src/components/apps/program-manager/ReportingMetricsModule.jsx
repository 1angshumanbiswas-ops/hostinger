import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Activity, Clock, CheckCircle } from 'lucide-react';

const ReportingMetricsModule = ({ data }) => {
  const kpis = data?.kpis || {};
  
  const resourceData = [
    { name: 'Engineering', capacity: 100, utilized: 95 },
    { name: 'Design', capacity: 40, utilized: 35 },
    { name: 'Product', capacity: 30, utilized: 28 },
    { name: 'QA', capacity: 50, utilized: 48 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{kpis.completionRate || 0}%</h3>
            <p className="text-sm text-slate-500 font-medium">Completion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{kpis.scheduleVariance || '0%'}</h3>
            <p className="text-sm text-slate-500 font-medium">Schedule Variance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">{kpis.overallHealth || 'N/A'}</h3>
            <p className="text-sm text-slate-500 font-medium">Overall Health</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="capacity" fill="#cbd5e1" name="Capacity (hrs)" />
              <Bar dataKey="utilized" fill="#4f46e5" name="Utilized (hrs)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingMetricsModule;