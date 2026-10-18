import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function OverallSensexMetricCard({ topStocks, loading }) {
  const calculateOverallSensexChange = () => {
    if (!topStocks || topStocks.length === 0) return 0;

    // Calculate simple average of all stock change percentages
    const totalChangePercent = topStocks.reduce((sum, stock) => {
      return sum + (stock.changePercent || 0);
    }, 0);

    const averageChange = totalChangePercent / topStocks.length;
    return Number(averageChange.toFixed(2));
  };

  const sensexChange = calculateOverallSensexChange();
  const isPositive = sensexChange >= 0;
  const isNeutral = Math.abs(sensexChange) < 0.01;

  if (loading) {
    return (
      <Card className="border-border shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Overall Sensex
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-28" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Overall Sensex
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          {isNeutral ? (
            <Activity className="w-8 h-8 text-muted-foreground" />
          ) : isPositive ? (
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          ) : (
            <TrendingDown className="w-8 h-8 text-red-500" />
          )}
          <div>
            <div className={`text-3xl font-bold ${
              isNeutral 
                ? 'text-muted-foreground' 
                : isPositive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-red-600 dark:text-red-400'
            }`}>
              {isPositive && sensexChange !== 0 ? '+' : ''}{sensexChange}%
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              vs Previous Day
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}