import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Briefcase, TrendingUp, AlertTriangle } from 'lucide-react';

const ExecutiveModule = ({ data }) => {
  const roiData = [
    { name: '2023 Q1', projected: 120, actual: 115 },
    { name: '2023 Q2', projected: 140, actual: 145 },
    { name: '2023 Q3', projected: 160, actual: 155 },
    { name: '2023 Q4', projected: 180, actual: 0 }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold">Executive Summary - Q3</h2>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          The program portfolio remains on track for the fiscal year. Key deliveries in Q3 included the successful API migration and launch of the mobile app v2 beta. We are tracking a minor budget under-run (-1.5%) and maintaining a healthy delivery velocity. 
        </p>
        <div className="flex gap-4">
          <div className="bg-slate-800 p-3 rounded-lg flex-1 border border-slate-700">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Portfolio Health</span>
            <div className="text-emerald-400 font-bold text-lg mt-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Strong
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg flex-1 border border-slate-700">
            <span className="text-slate-400 text-xs uppercase tracking-wider font-bold">Top Risk</span>
            <div className="text-red-400 font-bold text-sm mt-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> API Rate Limits
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">ROI Tracking (k$)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="projected" fill="#cbd5e1" name="Projected ROI" />
              <Bar dataKey="actual" fill="#10b981" name="Actual ROI" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveModule;