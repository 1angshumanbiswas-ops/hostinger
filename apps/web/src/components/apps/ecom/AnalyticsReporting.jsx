import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function AnalyticsReporting() {
  const { toast } = useToast();
  
  const recoveryData = [
    { name: 'Week 1', revenue: 4000, recovered: 2400 },
    { name: 'Week 2', revenue: 3000, recovered: 1398 },
    { name: 'Week 3', revenue: 2000, recovered: 9800 },
    { name: 'Week 4', revenue: 2780, recovered: 3908 },
  ];

  const causeData = [
    { name: 'High Price', value: 400 },
    { name: 'Shipping Cost', value: 300 },
    { name: 'Distraction', value: 300 },
    { name: 'Other', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleExport = () => {
    toast({ title: "Export Started", description: "Your report is downloading." });
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">E-Commerce Analytics</h1>
        <Button onClick={handleExport}><Download className="w-4 h-4 mr-2"/> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs. Recovered (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recoveryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false}/>
                  <YAxis axisLine={false} tickLine={false}/>
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="revenue" fill="#94a3b8" radius={[4,4,0,0]} />
                  <Bar dataKey="recovered" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimated Abandonment Causes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={causeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {causeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4 text-sm text-slate-600">
               {causeData.map((d, i) => (
                 <div key={i} className="flex items-center gap-1">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                   {d.name}
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}