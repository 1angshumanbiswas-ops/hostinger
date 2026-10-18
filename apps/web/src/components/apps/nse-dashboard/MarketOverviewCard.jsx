import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export default function MarketOverviewCard({ title, value, changePercent, sparklineData, icon: Icon = Activity }) {
  const isPositive = changePercent >= 0;
  
  return (
    <Card className="bg-card shadow-sm border-border overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1">
          <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
            {value}
          </div>
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {isPositive ? '+' : ''}{changePercent}%
          </div>
        </div>
        
        {sparklineData && (
          <div className="h-[60px] mt-4 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--danger))'} 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}