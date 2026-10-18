import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { marketData } from '@/utils/MarketAnalysisData';

export default function DeviceAbandonmentChart() {
  const data = [
    { name: 'Mobile', value: 69, color: 'hsl(var(--chart-1))', abandonment: 85 },
    { name: 'Desktop/Tablet', value: 31, color: 'hsl(var(--chart-3))', abandonment: 61 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border p-3 rounded-lg shadow-xl">
          <p className="font-medium text-white mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Order Share: <span className="font-bold text-white">{data.value}%</span></p>
            <p className="text-sm text-muted-foreground">Abandonment Rate: <span className="font-bold text-destructive">{data.abandonment}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">69%</p>
          <p className="text-xs text-muted-foreground">Mobile Share</p>
        </div>
      </div>
    </div>
  );
}