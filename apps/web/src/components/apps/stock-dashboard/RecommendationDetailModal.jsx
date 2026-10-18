import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, ShieldAlert, Activity, BarChart3, AlertTriangle, Clock } from 'lucide-react';

export default function RecommendationDetailModal({ open, onOpenChange, recommendation }) {
  if (!recommendation) return null;

  const isBuy = recommendation.type === 'BUY';
  const isSell = recommendation.type === 'SELL';
  const isHold = recommendation.type === 'HOLD';

  const typeColor = isBuy ? 'text-[hsl(var(--buy-color))]' : isSell ? 'text-[hsl(var(--sell-color))]' : 'text-[hsl(var(--hold-color))]';
  const bgTypeColor = isBuy ? 'bg-[hsl(var(--buy-color))]' : isSell ? 'bg-[hsl(var(--sell-color))]' : 'bg-[hsl(var(--hold-color))]';
  
  // Format chart data
  const chartData = [...(recommendation.historyData || [])].reverse().map(d => ({
    date: d.date.substring(5),
    price: d.close,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {recommendation.symbol} 
                <Badge className={`${bgTypeColor} text-white hover:${bgTypeColor}`}>{recommendation.type}</Badge>
              </DialogTitle>
              <DialogDescription className="text-base mt-1">{recommendation.companyName}</DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">₹{recommendation.currentPrice.toLocaleString('en-IN')}</div>
              <div className={`text-sm font-medium ${recommendation.changePercent >= 0 ? 'text-stock-up' : 'text-destructive'}`}>
                {recommendation.changePercent >= 0 ? '+' : ''}{recommendation.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-6">
            {/* Chart Section */}
            <div className="border border-border rounded-lg p-4 bg-muted/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> 90-Day Price Action
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickMargin={10} />
                    <YAxis domain={['auto', 'auto']} stroke="var(--muted-foreground)" fontSize={11} orientation="right" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                      labelStyle={{ color: 'var(--foreground)' }}
                    />
                    <Line type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Reasoning */}
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> AI Analysis & Reasoning
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {recommendation.aiReasoning}
              </p>
              
              {isHold && recommendation.geopoliticalContext && (
                <div className="mt-4 p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg">
                  <h4 className="font-medium text-amber-500 flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" /> Geopolitical & Macro Context
                  </h4>
                  <p className="text-sm text-muted-foreground">{recommendation.geopoliticalContext}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm font-medium">
                    <Clock className="h-4 w-4 text-amber-500" />
                    Estimated Recovery Timeline: {recommendation.recoveryTimeline}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="space-y-4 border border-border p-4 rounded-lg bg-muted/10">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Target Price</div>
                <div className="text-xl font-bold">₹{recommendation.targetPrice.toLocaleString('en-IN')}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Potential Return</div>
                <div className={`text-lg font-bold ${recommendation.potentialReturnPercent >= 0 ? 'text-stock-up' : 'text-destructive'}`}>
                  {recommendation.potentialReturnPercent >= 0 ? '+' : ''}{recommendation.potentialReturnPercent.toFixed(2)}%
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1 flex justify-between">
                  <span>Confidence Score</span>
                  <span className="font-medium">{recommendation.confidenceScore}%</span>
                </div>
                <Progress value={recommendation.confidenceScore} className={`h-2 [&>div]:${bgTypeColor}`} />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Time Horizon</span>
                <Badge variant="outline">{recommendation.timeHorizon}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> {recommendation.riskLevel}
                </Badge>
              </div>
            </div>

            {/* Technical Indicators Breakdown */}
            <div className="border border-border p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-sm">Indicator Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">RSI (14)</span>
                  <span className={`text-sm font-medium ${
                    recommendation.analysisFactors.rsi < 30 ? 'text-stock-up' : 
                    recommendation.analysisFactors.rsi > 70 ? 'text-destructive' : 'text-foreground'
                  }`}>
                    {recommendation.analysisFactors.rsi?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">SMA (20)</span>
                  <span className="text-sm font-medium">
                    ₹{recommendation.analysisFactors.sma20?.toFixed(2) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">MACD Histogram</span>
                  <span className={`text-sm font-medium ${
                    (recommendation.analysisFactors.macd?.histogram || 0) > 0 ? 'text-stock-up' : 'text-destructive'
                  }`}>
                    {recommendation.analysisFactors.macd?.histogram?.toFixed(3) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Sector Trend</span>
                  <span className={`text-sm font-medium ${
                    recommendation.analysisFactors.sectorTrend >= 0 ? 'text-stock-up' : 'text-destructive'
                  }`}>
                    {recommendation.analysisFactors.sectorTrend >= 0 ? '+' : ''}{recommendation.analysisFactors.sectorTrend?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}