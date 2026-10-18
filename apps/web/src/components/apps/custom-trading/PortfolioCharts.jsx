import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#ec4899'];

const PortfolioCharts = ({ pieData, barData, equityOverTime }) => {
  // Mock equity over time if not provided
  const mockEquity = equityOverTime || [
    { name: 'Mon', value: 10000 },
    { name: 'Tue', value: 10150 },
    { name: 'Wed', value: 10080 },
    { name: 'Thu', value: 10300 },
    { name: 'Fri', value: 10250 },
    { name: 'Sat', value: 10500 },
    { name: 'Sun', value: 10600 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-600">Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData?.length ? pieData : [{name: 'Cash', value: 100}]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {(pieData?.length ? pieData : [{name: 'Cash', value: 100}]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-600">P&L by Asset</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData?.length ? barData : []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} cursor={{fill: 'transparent'}} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {barData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-slate-600">Portfolio Growth</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockEquity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={['auto', 'auto']} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioCharts;