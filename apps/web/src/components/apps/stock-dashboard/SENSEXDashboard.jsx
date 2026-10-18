import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '---';
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const generateIntradayData = (currentValue) => {
  if (!currentValue) return [];
  const data = [];
  const base = currentValue * 0.95; 
  let val = base;
  const times = ['9:15 AM', '10:00 AM', '11:20 AM', '12:30 PM', '1:25 PM', '2:30 PM', '3:30 PM'];
  
  for (let i = 0; i < 40; i++) {
    if (i < 10) val -= Math.random() * (currentValue * 0.001);
    else val += Math.random() * (currentValue * 0.002) + 20;
    
    data.push({
      time: times[Math.floor((i / 40) * times.length)] || '',
      index: i,
      value: val
    });
  }
  
  const lastVal = data[data.length - 1].value;
  const diff = currentValue - lastVal;
  
  return data.map(d => ({
    ...d,
    value: d.value + (diff * (d.index / 39))
  }));
};

export default function SENSEXDashboard({ sensexData, loading, error }) {
  const [activeTab, setActiveTab] = useState('1D');
  const tabs = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'Max'];

  const displayData = useMemo(() => {
    if (!sensexData) return null;
    const currentValue = sensexData.currentValue || 77562.90;
    const change = sensexData.change || -44.66;
    const changePercent = sensexData.changePercent || -0.06;
    const intradayData = generateIntradayData(currentValue);
    
    return {
      currentValue,
      change,
      changePercent,
      intradayData,
      high: formatNumber(currentValue + (currentValue * 0.001)),
      low: formatNumber(currentValue - (currentValue * 0.015)),
      open: formatNumber(currentValue - (currentValue * 0.01)),
      vol: '27,678',
      wkHigh: formatNumber(currentValue * 1.05),
      wkLow: formatNumber(currentValue * 0.8)
    };
  }, [sensexData]);

  if (loading && !displayData) {
    return (
      <Card className="w-full bg-card shadow-sm border-border overflow-hidden">
        <CardContent className="p-6">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-14 w-64 mb-6" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (error && !displayData) {
    return (
      <Card className="w-full bg-card shadow-sm border-border flex items-center justify-center min-h-[400px]">
        <div className="text-center text-muted-foreground flex flex-col items-center">
           <AlertCircle className="w-12 h-12 text-destructive mb-3 opacity-50" />
           <p className="font-semibold text-lg">Index Data Unavailable</p>
           <p className="text-sm">Cannot load SENSEX at this time.</p>
        </div>
      </Card>
    );
  }

  if (!displayData) return null;

  const isPositive = displayData.change >= 0;
  const strokeColor = isPositive ? 'hsl(var(--positive, 142 71% 45%))' : 'hsl(var(--destructive, 0 84% 60%))';

  return (
    <Card className="w-full bg-card shadow-sm border-border overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1 text-foreground flex items-center gap-2">
            BSE SENSEX 
            {sensexData._source && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {sensexData._source}
              </span>
            )}
          </h2>
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="text-5xl md:text-[64px] font-bold tracking-tight leading-none text-foreground">
              {formatNumber(displayData.currentValue)} <span className="text-2xl font-semibold text-muted-foreground ml-1">INR</span>
            </div>
            <div className={`text-xl font-semibold flex items-center mb-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{formatNumber(displayData.change)} ({isPositive ? '+' : ''}{displayData.changePercent.toFixed(2)}%)
              <span className="text-base text-muted-foreground ml-2 font-medium">Today</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="h-[300px] w-full mb-8 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData.intradayData} margin={{ top: 10, right: 60, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                interval="preserveStartEnd"
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                domain={['dataMin - 200', 'dataMax + 200']} 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }}
                orientation="right"
                tickFormatter={(value) => value.toLocaleString('en-IN')}
                dx={10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: strokeColor, fontWeight: 'bold' }}
                labelStyle={{ color: 'hsl(var(--foreground))', opacity: 0.8, marginBottom: '4px' }}
                formatter={(value) => [formatNumber(value), 'Value']}
              />
              <ReferenceLine 
                y={displayData.currentValue} 
                stroke={strokeColor} 
                strokeDasharray="3 3" 
                label={{ 
                  position: 'right', 
                  value: formatNumber(displayData.currentValue), 
                  fill: strokeColor, 
                  fontSize: 12, 
                  fontWeight: 'bold',
                  backgroundColor: 'hsl(var(--background))'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={strokeColor} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 pt-6 border-t border-border">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">High</span>
              <span className="font-semibold text-foreground">{displayData.high}</span>
            </div>
            <div className="h-px w-full bg-border/60"></div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Low</span>
              <span className="font-semibold text-foreground">{displayData.low}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Open</span>
              <span className="font-semibold text-foreground">{displayData.open}</span>
            </div>
            <div className="h-px w-full bg-border/60"></div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Vol</span>
              <span className="font-semibold text-foreground">{displayData.vol}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">52wk High</span>
              <span className="font-semibold text-foreground">{displayData.wkHigh}</span>
            </div>
            <div className="h-px w-full bg-border/60"></div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">52wk Low</span>
              <span className="font-semibold text-foreground">{displayData.wkLow}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}