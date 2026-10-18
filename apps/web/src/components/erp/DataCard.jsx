import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const DataCard = ({ 
  title, 
  value, 
  unit = '', 
  trend = 0, 
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  lastUpdated, 
  isLoading = false, 
  error = null, 
  onRefresh,
  children,
  className
}) => {
  
  const isPositive = trendDirection === 'up' ? trend >= 0 : trend < 0;
  const trendColor = trend >= 0 ? 'text-emerald-600' : 'text-red-600';
  const trendIcon = trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />;
  const badgeVariant = trend >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200';

  if (error) {
    return (
      <Card className={cn("shadow-lg border-red-100 bg-red-50/10", className)}>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
          <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
          <p className="text-sm font-medium text-red-800">Failed to load {title}</p>
          <Button variant="outline" size="sm" onClick={onRefresh} className="mt-4 border-red-200 hover:bg-red-50 text-red-700">
            <RefreshCw className="w-3 h-3 mr-2" /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("shadow-lg hover:shadow-2xl transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-slate-400 hover:text-slate-600 -mr-2 -mt-2"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900">{value}</span>
              <span className="text-sm font-medium text-slate-500">{unit}</span>
            </div>
            
            {(trend !== null && trend !== undefined) && (
              <div className="flex items-center mt-1">
                <Badge variant="outline" className={cn("text-xs font-medium px-1.5 py-0 h-5", badgeVariant)}>
                  {trendIcon} {Math.abs(trend)}%
                </Badge>
                <span className="text-xs text-slate-400 ml-2">vs last period</span>
              </div>
            )}
            
            {children && <div className="mt-4 pt-4 border-t border-slate-100">{children}</div>}

            {lastUpdated && (
              <p className="text-[10px] text-slate-400 mt-4 text-right">
                Updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;