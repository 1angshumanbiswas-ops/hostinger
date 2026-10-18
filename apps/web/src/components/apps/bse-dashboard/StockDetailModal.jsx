import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import RecommendationBadgeForBSE from './RecommendationBadgeForBSE';
import { TrendingUp, TrendingDown, Building2 } from 'lucide-react';

export default function StockDetailModal({ stock, open, onOpenChange }) {
  if (!stock) return null;
  
  const isPositive = stock.change_percent >= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <DialogTitle className="text-2xl font-bold">
                  {stock.symbol}
                </DialogTitle>
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {stock.sector || 'General'}
                </Badge>
              </div>
              <DialogDescription className="text-base mt-1">
                {stock.company_name}
              </DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                ₹{stock.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center justify-end gap-1 font-semibold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(stock.change_percent).toFixed(2)}%
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview & Chart</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="h-[300px] w-full border rounded-lg p-4 bg-card/50">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stock.chart_data || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" hide />
                  <YAxis domain={['auto', 'auto']} width={60} fontSize={12} tickFormatter={(val) => `₹${val.toFixed(0)}`} />
                  <RechartsTooltip 
                    formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Price']}
                    labelFormatter={() => ''}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isPositive ? '#10b981' : '#ef4444'} 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground mb-1">Sector</p>
                <p className="font-semibold">{stock.sector || 'General'}</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground mb-1">52W High</p>
                <p className="font-semibold">₹{stock.week_52_high.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground mb-1">52W Low</p>
                <p className="font-semibold">₹{stock.week_52_low.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground mb-1">Market Cap (Cr)</p>
                <p className="font-semibold">₹{(stock.market_cap / 10000000000).toFixed(2)}K</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground mb-1">P/E Ratio</p>
                <p className="font-semibold">{stock.pe_ratio}</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground mb-1">Volume</p>
                <p className="font-semibold">{stock.volume?.toLocaleString('en-IN') || 'N/A'}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-6 pt-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
              <div>
                <h4 className="font-bold text-lg mb-1">Primary Recommendation</h4>
                <p className="text-sm text-muted-foreground">{stock.rationale}</p>
              </div>
              <RecommendationBadgeForBSE 
                recommendation={stock.recommendation} 
                confidence={stock.confidence} 
              />
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-bold mb-4">AI Sub-Scores</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Technical Score</span>
                    <span className="font-medium">{stock.technical_score}/100</span>
                  </div>
                  <Progress value={stock.technical_score} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fundamental Score</span>
                    <span className="font-medium">{stock.fundamental_score}/100</span>
                  </div>
                  <Progress value={stock.fundamental_score} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Market Sentiment</span>
                    <span className="font-medium">{stock.sentiment_score}/100</span>
                  </div>
                  <Progress value={stock.sentiment_score} className="h-2" />
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-muted/10">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Sector Context: {stock.sector}
              </h4>
              <p className="text-sm text-muted-foreground">
                This stock operates in the {stock.sector} sector. AI analysis considers sector-specific metrics, industry trends, and peer comparisons when generating recommendations.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="fundamentals" className="pt-4">
            <div className="p-8 text-center text-muted-foreground border rounded-lg bg-muted/10 border-dashed">
              <p>Detailed fundamental analysis including balance sheets, cash flow statements, and quarterly results will be available in the next update.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}