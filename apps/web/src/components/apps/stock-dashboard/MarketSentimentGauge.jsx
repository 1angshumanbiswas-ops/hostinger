import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Compass, Info, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateMarketSentiment } from '@/utils/MSNIndiaDataService';

export default function MarketSentimentGauge({ stocks, sensex, loading }) {
  
  const sentiment = useMemo(() => {
    if (!stocks || stocks.length === 0) return null;
    try {
      return calculateMarketSentiment(stocks, sensex);
    } catch (e) {
      console.error('[MarketSentimentGauge] Error calculating sentiment:', e);
      return null;
    }
  }, [stocks, sensex]);

  if (loading && (!stocks || stocks.length === 0)) {
    return (
      <Card className="h-full min-h-[300px] shadow-sm">
        <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
        <CardContent className="flex justify-center"><Skeleton className="h-32 w-32 rounded-t-full" /></CardContent>
      </Card>
    );
  }

  if (!sentiment) {
    return (
      <Card className="h-full min-h-[300px] flex flex-col items-center justify-center bg-card border-border shadow-sm">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Sentiment data unavailable</p>
      </Card>
    );
  }

  const rotation = (sentiment.score / 100) * 180;
  const isBullish = sentiment.score > 50;
  const isBearish = sentiment.score < 50;
  
  const color = isBullish ? 'text-emerald-500' : isBearish ? 'text-rose-500' : 'text-slate-500';
  const borderColor = isBullish ? '#10b981' : isBearish ? '#f43f5e' : '#64748b';

  return (
    <Card className="h-full min-h-[300px] bg-card border-border shadow-sm flex flex-col transition-all duration-300">
      <CardHeader className="pb-2 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <Compass className="h-4 w-4 text-primary" /> Market Sentiment
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Calculated dynamically based on MSN India live SENSEX momentum and top stocks advance/decline breadth.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-6 flex-1">
        <div className="relative w-48 h-24 overflow-hidden mb-4">
          {/* Background Arch */}
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[20px] border-muted"></div>
          {/* Colored Arch */}
          <div 
            className="absolute top-0 left-0 w-48 h-48 rounded-full border-[20px] border-transparent transition-transform duration-1000 ease-out"
            style={{ 
              borderTopColor: borderColor, 
              borderRightColor: borderColor,
              transform: `rotate(${rotation - 45}deg)`
            }}
          ></div>
          {/* Needle */}
          <div 
            className="absolute bottom-0 left-[50%] w-1 h-20 bg-foreground origin-bottom transition-transform duration-1000 ease-out z-10 rounded-full"
            style={{ transform: `translateX(-50%) rotate(${rotation - 90}deg)` }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-foreground"></div>
          </div>
        </div>
        
        <h3 className={`text-2xl font-bold ${color}`}>{sentiment.label}</h3>
        <p className="text-xs text-muted-foreground mt-1 mb-3">Confidence: {sentiment.confidence}%</p>
        
        <div className="flex items-center gap-4 mt-2 text-sm w-full justify-center">
          <div className="flex flex-col items-center">
            <span className="text-emerald-500 font-bold">{sentiment.gainers}</span>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Advancing</span>
          </div>
          <div className="h-8 w-px bg-border"></div>
          <div className="flex flex-col items-center">
            <span className="text-foreground font-bold">{sentiment.score}/100</span>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Score</span>
          </div>
          <div className="h-8 w-px bg-border"></div>
          <div className="flex flex-col items-center">
            <span className="text-rose-500 font-bold">{sentiment.losers}</span>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Declining</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">Updated: {new Date(sentiment.timestamp).toLocaleTimeString()}</p>
      </CardContent>
    </Card>
  );
}