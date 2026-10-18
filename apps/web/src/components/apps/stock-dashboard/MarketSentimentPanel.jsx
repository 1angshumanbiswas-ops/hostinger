import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useRealTimeMarketData } from '@/hooks/useRealTimeMarketData';
import { Skeleton } from '@/components/ui/skeleton';

export default function MarketSentimentPanel() {
  const { topStocks, loading } = useRealTimeMarketData();

  const { score, isBullish, isBearish, text, colorClass, Icon } = useMemo(() => {
    if (!topStocks || topStocks.length === 0) {
      return { score: 50, isBullish: false, isBearish: false, text: 'Neutral', colorClass: 'text-muted-foreground', Icon: Minus };
    }

    const gainers = topStocks.filter(s => s.change > 0).length;
    const total = topStocks.length;
    const calculatedScore = Math.round((gainers / total) * 100);
    
    const bullish = calculatedScore >= 55;
    const bearish = calculatedScore <= 45;

    return {
      score: calculatedScore,
      isBullish: bullish,
      isBearish: bearish,
      text: bullish ? 'Bullish' : bearish ? 'Bearish' : 'Neutral',
      colorClass: bullish ? 'text-positive' : bearish ? 'text-negative' : 'text-dark-green',
      Icon: bullish ? TrendingUp : bearish ? TrendingDown : Minus
    };
  }, [topStocks]);

  return (
    <Card className="w-full shadow-sm flex flex-col justify-center bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-dark-green">Market Sentiment AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading && (!topStocks || topStocks.length === 0) ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4"><Skeleton className="h-12 w-12 rounded-full" /><Skeleton className="h-8 w-32" /></div>
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${isBullish ? 'bg-positive/10' : isBearish ? 'bg-negative/10' : 'bg-muted'}`}>
                  <Icon className={`h-8 w-8 ${colorClass}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Overall Pulse</p>
                  <h3 className={`text-3xl font-black tracking-tight ${colorClass}`}>{text}</h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-dark-green">{score}%</span>
                <p className="text-xs font-bold text-muted-foreground uppercase">Bullish Ratio</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase">
                <span className="text-negative">Bearish</span>
                <span className="text-dark-green/60">Neutral</span>
                <span className="text-positive">Bullish</span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                 <div 
                   className={`h-full transition-all duration-500 ease-out ${isBullish ? 'bg-positive' : isBearish ? 'bg-negative' : 'bg-dark-green'}`}
                   style={{ width: `${score}%` }}
                 />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2 font-bold uppercase tracking-tight">
                Analyzed from top {topStocks.length} market indicators
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}