import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';
import RecommendationBadge from './RecommendationBadge';
import { Info, BarChart3, TrendingUp, Cpu } from 'lucide-react';

// Generate fake 30-day history for the chart
const generateChartHistory = (currentPrice, volatility = 0.02) => {
  const history = [];
  let price = currentPrice * (1 - (volatility * 15)); // reverse engineer
  for (let i = 0; i < 30; i++) {
    price = price * (1 + (Math.random() * volatility * 2 - volatility));
    history.push({ day: `Day ${i+1}`, price: Number(price.toFixed(2)) });
  }
  history[29].price = currentPrice; // Ensure last day matches current
  return history;
};

export default function StockDetailModal({ isOpen, onClose, stock, recommendation }) {
  // Move React hooks to the top level before conditional logic
  const chartData = React.useMemo(() => {
    if (!stock) return [];
    return generateChartHistory(stock.current_price);
  }, [stock]);

  if (!stock) return null;

  const isPositive = stock.change_percent >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
        <DialogHeader>
          <div className="flex items-start justify-between pr-6">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {stock.symbol}
                <Badge variant="outline" className="text-xs font-normal">NSE</Badge>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 text-base">
                {stock.company_name}
              </DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono">₹{stock.current_price.toLocaleString()}</div>
              <div className={`text-sm font-medium ${isPositive ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
                {isPositive ? '+' : ''}{stock.change_percent}%
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border my-2">
          <div>
            <div className="text-xs text-muted-foreground mb-1">52W High</div>
            <div className="font-semibold font-mono">₹{stock.week_52_high.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">52W Low</div>
            <div className="font-semibold font-mono">₹{stock.week_52_low.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Market Cap</div>
            <div className="font-semibold font-mono">₹{stock.market_cap.toLocaleString()} Cr</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">P/E Ratio</div>
            <div className="font-semibold font-mono">{stock.pe_ratio}</div>
          </div>
        </div>

        <div className="space-y-6 mt-4">
          <div className="h-[200px] w-full border border-border rounded-lg bg-background p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value) => [`₹${value}`, 'Price']}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--danger))'} 
                  strokeWidth={2} 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-secondary/50 rounded-xl p-5 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/20 p-2 rounded-full">
                <Cpu className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold">AI Analysis & Recommendation</h3>
              <div className="ml-auto">
                <RecommendationBadge recommendation={recommendation?.recommendation} />
              </div>
            </div>

            <p className="text-sm text-foreground/90 leading-relaxed mb-6">
              {recommendation?.analysis_summary || "AI Analysis currently unavailable."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Technical Score</span>
                </div>
                <div className="text-2xl font-bold mb-1">{recommendation?.technical_score || 0}/100</div>
                <div className="text-xs text-muted-foreground">Price trend & momentum</div>
              </div>
              
              <div className="bg-background rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Fundamental Score</span>
                </div>
                <div className="text-2xl font-bold mb-1">{recommendation?.fundamental_score || 0}/100</div>
                <div className="text-xs text-muted-foreground">P/E & Valuation metrics</div>
              </div>
              
              <div className="bg-background rounded-lg p-3 border border-border">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Sentiment Score</span>
                </div>
                <div className="text-2xl font-bold mb-1">{recommendation?.sentiment_score || 0}/100</div>
                <div className="text-xs text-muted-foreground">Market context analysis</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}