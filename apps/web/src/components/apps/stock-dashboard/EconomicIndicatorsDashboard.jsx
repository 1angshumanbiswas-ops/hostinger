import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus, Building2 } from 'lucide-react';

export default function EconomicIndicatorsDashboard({ indicators, loading }) {
  if (loading || !indicators) {
    return (
      <Card className="h-full">
        <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  const renderTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-stock-up" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          NDAP Macro Indicators
        </CardTitle>
        <Badge variant="secondary" className="text-xs">Official Data</Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {indicators.map((ind) => (
            <div key={ind.name} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/50 transition-colors">
              <div>
                <div className="text-sm font-medium">{ind.name}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-lg font-bold flex items-center gap-2">
                  {ind.value}
                  {renderTrendIcon(ind.trend)}
                </div>
                <div className="text-xs text-muted-foreground">Prev: {ind.previous}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}