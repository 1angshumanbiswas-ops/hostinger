import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';

// Technical Calculation Utilities
const calculateSMA = (data, period) => {
  return data.map((item, index) => {
    if (index < period - 1) return { ...item, [`sma${period}`]: null };
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[index - i].close;
    }
    return { ...item, [`sma${period}`]: parseFloat((sum / period).toFixed(2)) };
  });
};

const calculateRSI = (data, period = 14) => {
  let gains = 0, losses = 0;
  const result = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push({ ...data[i], rsi: null });
      continue;
    }

    const change = data[i].close - data[i - 1].close;
    if (i <= period) {
      if (change > 0) gains += change;
      else losses -= change;
      
      if (i === period) {
        const rs = (gains / period) / (losses / period || 1);
        result.push({ ...data[i], rsi: 100 - (100 / (1 + rs)) });
      } else {
        result.push({ ...data[i], rsi: null });
      }
    } else {
      const avgGain = (gains * 13 + (change > 0 ? change : 0)) / period;
      const avgLoss = (losses * 13 + (change < 0 ? -change : 0)) / period;
      
      gains = avgGain;
      losses = avgLoss;
      
      const rs = avgGain / (avgLoss || 1);
      result.push({ ...data[i], rsi: parseFloat((100 - (100 / (1 + rs))).toFixed(2)) });
    }
  }
  return result;
};

export default function TechnicalIndicators({ data }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    let processed = calculateSMA(data, 10);
    processed = calculateSMA(processed, 20);
    processed = calculateRSI(processed, 14);
    return processed;
  }, [data]);

  if (!chartData.length) return null;

  const currentRSI = chartData[chartData.length - 1]?.rsi;
  const rsiSignal = currentRSI > 70 ? 'Overbought' : currentRSI < 30 ? 'Oversold' : 'Neutral';

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Moving Averages (10 & 20 Day)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => v.slice(5)} />
                <YAxis domain={['auto', 'auto']} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Line type="monotone" dataKey="close" stroke="var(--muted-foreground)" name="Price" dot={false} strokeWidth={1} opacity={0.5} />
                <Line type="monotone" dataKey="sma10" stroke="var(--primary)" name="SMA 10" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="sma20" stroke="var(--secondary)" name="SMA 20" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">RSI (14 Period)</CardTitle>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            rsiSignal === 'Overbought' ? 'bg-destructive/20 text-destructive' : 
            rsiSignal === 'Oversold' ? 'bg-stock-up/20 text-stock-up' : 
            'bg-muted text-muted-foreground'
          }`}>
            Signal: {rsiSignal} {currentRSI && `(${currentRSI.toFixed(1)})`}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => v.slice(5)} />
                <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} ticks={[0, 30, 70, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', color: 'var(--popover-foreground)' }}
                />
                {/* Overbought/Oversold reference lines */}
                <Line type="step" dataKey={() => 70} stroke="var(--destructive)" strokeDasharray="5 5" dot={false} strokeWidth={1} name="Overbought" />
                <Line type="step" dataKey={() => 30} stroke="var(--stock-up)" strokeDasharray="5 5" dot={false} strokeWidth={1} name="Oversold" />
                
                <Line type="monotone" dataKey="rsi" stroke="var(--accent)" name="RSI" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}