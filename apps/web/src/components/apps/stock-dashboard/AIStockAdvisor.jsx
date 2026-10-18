import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus, RefreshCw, Bot, AlertCircle, Clock } from 'lucide-react';
import { generateRecommendations, refreshRecommendations } from '@/utils/AIStockRecommendationEngine';
import RecommendationDetailModal from './RecommendationDetailModal';

export default function AIStockAdvisor() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedRec, setSelectedRec] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async (forceRefresh = false) => {
    forceRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const data = forceRefresh ? await refreshRecommendations() : await generateRecommendations();
      setRecommendations(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load AI recommendations", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh AI analysis every 5 minutes
    const interval = setInterval(() => loadData(true), 300000);
    return () => clearInterval(interval);
  }, []);

  const openDetails = (rec) => {
    setSelectedRec(rec);
    setModalOpen(true);
  };

  const renderCards = (type) => {
    const filtered = recommendations.filter(r => r.type === type);
    
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-xl" />)}
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center p-12 border border-dashed border-border rounded-xl mt-4">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-medium">No {type} signals detected</h3>
          <p className="text-muted-foreground text-sm mt-1">Our AI engine hasn't identified strong {type} candidates in the current market cycle.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filtered.map(rec => (
          <Card key={rec.id} className={`ai-advisor-card ${rec.type.toLowerCase()} flex flex-col h-full bg-card/50 backdrop-blur-sm border-border`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {rec.symbol}
                    {rec.type === 'BUY' && <TrendingUp className="h-5 w-5 text-[hsl(var(--buy-color))]" />}
                    {rec.type === 'SELL' && <TrendingDown className="h-5 w-5 text-[hsl(var(--sell-color))]" />}
                    {rec.type === 'HOLD' && <Minus className="h-5 w-5 text-[hsl(var(--hold-color))]" />}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{rec.companyName}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">₹{rec.currentPrice.toLocaleString('en-IN')}</div>
                  <div className={`text-xs font-medium ${rec.changePercent >= 0 ? 'text-stock-up' : 'text-destructive'}`}>
                    {rec.changePercent >= 0 ? '+' : ''}{rec.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="text-sm text-muted-foreground line-clamp-3">
                <span className="font-semibold text-foreground mr-1">AI Reasoning:</span> 
                {rec.aiReasoning}
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Target Price</span>
                  <span className="font-bold">₹{rec.targetPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Potential</span>
                  <span className={`font-bold ${rec.potentialReturnPercent >= 0 ? 'text-stock-up' : 'text-destructive'}`}>
                    {rec.potentialReturnPercent >= 0 ? '+' : ''}{rec.potentialReturnPercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className="font-medium">{rec.confidenceScore}%</span>
                </div>
                <Progress 
                  value={rec.confidenceScore} 
                  className={`h-1.5 [&>div]:bg-[hsl(var(--${rec.type.toLowerCase()}-color))]`} 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Badge variant="outline" className="text-[10px]"><Clock className="h-3 w-3 mr-1"/> {rec.timeHorizon}</Badge>
                <Badge variant="outline" className="text-[10px]"><AlertCircle className="h-3 w-3 mr-1"/> {rec.riskLevel} Risk</Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="secondary" className="w-full text-xs" onClick={() => openDetails(rec)}>
                Expand Deep Analysis
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 mt-8 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" /> 
            AI Stock Recommendations
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time algorithmic analysis using NDAP models, technicals, and sentiment data.
          </p>
        </div>
        <div className="flex flex-col items-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => loadData(true)} 
            disabled={refreshing}
            className="border-primary/20 hover:bg-primary/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Re-Analyze Markets
          </Button>
          <span className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <Tabs defaultValue="BUY" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="BUY" className="data-[state=active]:bg-[hsl(var(--buy-color))] data-[state=active]:text-white">
            STRONG BUY
          </TabsTrigger>
          <TabsTrigger value="HOLD" className="data-[state=active]:bg-[hsl(var(--hold-color))] data-[state=active]:text-white">
            HOLD / WATCH
          </TabsTrigger>
          <TabsTrigger value="SELL" className="data-[state=active]:bg-[hsl(var(--sell-color))] data-[state=active]:text-white">
            SELL / REDUCE
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="BUY">
          {renderCards('BUY')}
        </TabsContent>
        <TabsContent value="HOLD">
          {renderCards('HOLD')}
        </TabsContent>
        <TabsContent value="SELL">
          {renderCards('SELL')}
        </TabsContent>
      </Tabs>

      <RecommendationDetailModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        recommendation={selectedRec} 
      />
    </div>
  );
}