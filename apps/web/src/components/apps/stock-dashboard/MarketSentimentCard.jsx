import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MarketSentimentCard({ loading, topStocks }) {
  if (loading && (!topStocks || !topStocks.length)) {
    return (
      <Card className="w-full shadow-md border-border bg-card overflow-hidden">
        <CardContent className="p-6">
           <Skeleton className="h-6 w-32 mb-4" />
           <Skeleton className="h-12 w-48 mb-4" />
           <Skeleton className="h-4 w-full mb-2" />
           <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  let bullishRatio = 56;
  if (topStocks && topStocks.length > 0) {
    const positiveCount = topStocks.filter(s => s.changePercent > 0).length;
    bullishRatio = Math.round((positiveCount / topStocks.length) * 100);
  }
  
  const neutralRatio = Math.floor((100 - bullishRatio) / 2);
  const bearishRatio = 100 - bullishRatio - neutralRatio;

  return (
    <Card className="w-full shadow-md border-border bg-gradient-to-br from-emerald-50/50 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background overflow-hidden relative">
      <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Market Sentiment AI</h2>
            </div>
            
            <div className="flex items-baseline gap-3">
              <h3 className="text-5xl font-black text-foreground tracking-tighter">{bullishRatio}%</h3>
              <div className="flex flex-col items-start gap-1">
                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-0.5 flex items-center gap-1 shadow-sm">
                  {bullishRatio >= 50 ? 'Bullish' : 'Bearish'} <TrendingUp className={`w-3 h-3 ${bullishRatio < 50 ? 'rotate-180' : ''}`} />
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground">Bullish Ratio</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-foreground">
                <span className="text-emerald-600 dark:text-emerald-500">Bullish ({bullishRatio}%)</span>
                <span className="text-slate-500 dark:text-slate-400">Neutral ({neutralRatio}%)</span>
                <span className="text-rose-600 dark:text-rose-500">Bearish ({bearishRatio}%)</span>
              </div>
              
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${bullishRatio}%` }} />
                <div className="h-full bg-slate-300 dark:bg-slate-600 transition-all duration-500" style={{ width: `${neutralRatio}%` }} />
                <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${bearishRatio}%` }} />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-background/50 p-2 rounded-md border border-border/50 w-fit">
              <BarChart2 className="w-3.5 h-3.5 text-primary" />
              <span>Analyzed from top {topStocks?.length || 5} market indicators</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}