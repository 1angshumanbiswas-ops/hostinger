import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, DollarSign } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PlanningStrategyModule = ({ data }) => {
  const budgetData = [
    { name: 'Q1', allocated: 4000, spent: 3800 },
    { name: 'Q2', allocated: 4500, spent: 4200 },
    { name: 'Q3', allocated: 5000, spent: 4800 },
    { name: 'Q4', allocated: 5000, spent: 2000 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><Target className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active OKRs</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600"><TrendingUp className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Strategic Alignment</p>
                <h3 className="text-2xl font-bold">94%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg text-purple-600"><DollarSign className="w-6 h-6" /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Budget Variance</p>
                <h3 className="text-2xl font-bold">{data?.kpis?.budgetVariance || '-1.5%'}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
             <CardTitle className="text-base font-semibold">Budget Allocation vs Spend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="allocated" fill="#94a3b8" name="Allocated (k)" />
                <Bar dataKey="spent" fill="#3b82f6" name="Spent (k)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="text-base font-semibold">Key Objectives (OKRs)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { obj: "Expand API Capabilities", progress: 75, status: "On Track" },
              { obj: "Reduce Infrastructure Costs", progress: 40, status: "At Risk" },
              { obj: "Improve Security Posture", progress: 90, status: "Ahead" }
            ].map((okr, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{okr.obj}</span>
                  <span className={`font-semibold ${okr.status === 'At Risk' ? 'text-red-500' : 'text-emerald-600'}`}>{okr.status}</span>
                </div>
                <Progress value={okr.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanningStrategyModule;