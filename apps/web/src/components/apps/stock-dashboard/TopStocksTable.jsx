import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TopStocksTable({ topStocks, loading, error }) {
  const sortedStocks = [...(topStocks || [])].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

  if (error && (!topStocks || topStocks.length === 0)) {
     return (
       <Card className="w-full shadow-sm bg-card border-border flex flex-col h-full min-h-[300px] justify-center items-center">
         <AlertCircle className="w-10 h-10 text-muted-foreground mb-4" />
         <p className="text-muted-foreground text-sm font-medium">Stocks table temporarily unavailable.</p>
       </Card>
     )
  }

  return (
    <Card className="w-full shadow-sm bg-card border-border flex flex-col h-full">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-foreground">BSE Market Movers</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 px-6 pb-6">
        {loading && (!sortedStocks || sortedStocks.length === 0) ? (
          <div className="space-y-3 mt-2">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
          </div>
        ) : (
          <div className="border border-border rounded-md overflow-hidden bg-background">
            <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 transition-colors relative">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Symbol</th>
                    <th className="px-4 py-3 font-semibold text-right">Price</th>
                    <th className="px-4 py-3 font-semibold text-right">Change</th>
                    <th className="px-4 py-3 font-semibold text-right hidden sm:table-cell">Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedStocks.map((stock) => {
                    const isPositive = stock.change >= 0;
                    return (
                      <tr key={stock.symbol} className="hover:bg-muted/50 transition-colors group">
                        <td className="px-4 py-3 font-bold text-foreground">
                          {stock.symbol}
                        </td>
                        <td className="px-4 py-3 font-medium text-right text-foreground">
                          ₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className={`inline-flex items-center justify-end font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground font-medium hidden sm:table-cell">
                          {((stock.volume || 0) / 100000).toFixed(1)}L
                        </td>
                      </tr>
                    );
                  })}
                  {sortedStocks.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-muted-foreground">
                        No market movers data available at the moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}