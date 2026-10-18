import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useRealTimeMarketData } from '@/hooks/useRealTimeMarketData';
import { Skeleton } from '@/components/ui/skeleton';

export default function SENSEXChart() {
  const { sensexHistory, loading } = useRealTimeMarketData();

  const dataAvailable = sensexHistory && sensexHistory.length > 0;
  
  const isTrendPositive = dataAvailable && 
    (sensexHistory[sensexHistory.length - 1].close >= sensexHistory[0].close);
  const strokeColor = isTrendPositive ? 'hsl(var(--positive))' : 'hsl(var(--negative))';

  return (
    <Card className="w-full shadow-sm bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-dark-green">SENSEX 7-Day Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && !dataAvailable ? (
          <Skeleton className="h-[300px] w-full rounded-xl" />
        ) : dataAvailable ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensexHistory} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--dark-green))', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 500', 'dataMax + 500']} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--dark-green))', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => (value / 1000).toFixed(1) + 'k'}
                  width={45}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--dark-green))',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: strokeColor, fontWeight: 'bold' }}
                  formatter={(value) => [value.toLocaleString('en-IN'), 'Points']}
                  labelStyle={{ color: 'hsl(var(--dark-green))', fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke={strokeColor} 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: strokeColor, strokeWidth: 2, stroke: 'hsl(var(--background))' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] w-full flex items-center justify-center text-dark-green/50 border border-dashed rounded-xl bg-muted/10">
            No historical data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}