import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PerformanceMetricsCard({ title, value, change, isPercent, icon: Icon }) {
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">
              {value}
            </p>
          </div>
          {Icon && (
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
        
        {change !== undefined && !isNaN(change) && (
          <div className="mt-4 flex items-center text-sm">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
            ) : isNegative ? (
              <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
            ) : (
              <Minus className="w-4 h-4 mr-1 text-muted-foreground" />
            )}
            <span className={`font-medium ${isPositive ? 'text-emerald-500' : isNegative ? 'text-red-500' : 'text-muted-foreground'}`}>
              {isPositive ? '+' : ''}{change}{isPercent ? '%' : ''}
            </span>
            <span className="text-muted-foreground ml-2">vs last close</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}