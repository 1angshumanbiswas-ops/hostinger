import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { Activity, Database, BarChart3, TrendingUp } from 'lucide-react';
import * as IndianAPI from '@/utils/IndianStockMarketAPIService';
import * as YahooAPI from '@/utils/YahooFinanceService';
import * as GoogleAPI from '@/utils/GoogleFinanceService';
import { fetchEconomicData } from '@/utils/FreeStockDataSources';
import { smaCalculator, rsiCalculator, macdCalculator } from '@/utils/TechnicalIndicatorsCalculator';
import DataSourceComparison from './DataSourceComparison';

export default function StockDetailedAnalysis() {
  const { symbol } = useParams();
  const [source, setSource] = useState('indian-api');
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeframe, setTimeframe] = useState('30');
  const [loading, setLoading] = useState(true);
  const [techData, setTechData] = useState([]);
  const [economy, setEconomy] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let q, h;
        const days = parseInt(timeframe);
        
        if (source === 'indian-api') {
          q = await IndianAPI.getStockQuote(symbol);
          h = await IndianAPI.getHistoricalData(symbol, days);
        } else if (source === 'yahoo') {
          q = await YahooAPI.getStockData(symbol);
          h = await YahooAPI.getHistoricalPrices(symbol, timeframe === '30' ? '1mo' : timeframe === '90' ? '3mo' : '1y');
        } else {
          q = await GoogleAPI.getStockInfo(symbol);
          h = await GoogleAPI.getPriceHistory(symbol);
        }

        setQuote(q);
        setHistory(h.reverse()); // Ensure chronological order for indicators

        const eco = await fetchEconomicData();
        setEconomy(eco);

        // Calculate Indicators
        const prices = h.map(d => d.close);
        const sma20 = smaCalculator(prices, 20);
        const rsi14 = rsiCalculator(prices, 14);
        const macd = macdCalculator(prices);

        const combined = h.map((d, i) => ({
          ...d,
          sma20: sma20[i],
          rsi: rsi14[i],
          macd: macd[i]?.macd,
          signal: macd[i]?.signal,
          histogram: macd[i]?.histogram
        }));

        setTechData(combined);
      } catch (e) {
        console.error("Failed to fetch analysis data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, source, timeframe]);

  if (loading || !quote) {
    return (
      <div className="p-8 flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isPos = quote.change >= 0;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{symbol}</h1>
            <Badge variant="secondary" className="text-xs">Equity</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-3xl font-bold">₹{quote.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            <span className={`text-xl font-medium flex items-center ${isPos ? 'text-stock-up' : 'text-destructive'}`}>
              {isPos ? '+' : ''}{quote.change.toFixed(2)} ({isPos ? '+' : ''}{quote.changePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Last Updated: {new Date(quote.timestamp).toLocaleString()} • Vol: {quote.volume.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
          <Database className="h-4 w-4 text-muted-foreground" />
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-[200px] border-none bg-transparent shadow-none focus:ring-0">
              <SelectValue placeholder="Data Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indian-api">Indian Stock Market API</SelectItem>
              <SelectItem value="yahoo">Yahoo Finance (Public)</SelectItem>
              <SelectItem value="google">Google Finance (Public)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="compare">Compare Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Price History</CardTitle>
                <CardDescription>Closing prices from {source}</CardDescription>
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">1 Month</SelectItem>
                  <SelectItem value="90">3 Months</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={techData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={v => v.substring(5)} />
                    <YAxis yAxisId="price" domain={['auto', 'auto']} stroke="var(--muted-foreground)" fontSize={12} orientation="left" />
                    <YAxis yAxisId="vol" domain={[0, 'auto']} hide orientation="right" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                      labelStyle={{ color: 'var(--muted-foreground)' }}
                    />
                    <Bar yAxisId="vol" dataKey="volume" fill="var(--muted)" opacity={0.5} name="Volume" />
                    <Line yAxisId="price" type="monotone" dataKey="close" stroke="var(--primary)" strokeWidth={2} dot={false} name="Price" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" /> NDAP Economic Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {economy?.indicators.map((ind, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-border pb-2 last:border-0 last:pb-0">
                      <span className="text-muted-foreground">{ind.name}</span>
                      <span className="font-medium">{ind.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Summary Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Previous Close</span>
                    <span className="font-medium">₹{(quote.price - quote.change).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Day's Range</span>
                    <span className="font-medium">₹{(quote.price * 0.98).toFixed(2)} - ₹{(quote.price * 1.02).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-muted-foreground">Volume</span>
                    <span className="font-medium">{quote.volume.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6 mt-6">
          <Card>
            <CardHeader><CardTitle>Moving Averages (Price & SMA 20)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={techData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickFormatter={v=>v.substring(5)} />
                    <YAxis domain={['auto', 'auto']} stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)' }} />
                    <Line type="monotone" dataKey="close" stroke="var(--muted-foreground)" dot={false} name="Price" opacity={0.5} />
                    <Line type="monotone" dataKey="sma20" stroke="var(--primary)" strokeWidth={2} dot={false} name="SMA 20" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>RSI (14)</span>
                  {techData[techData.length-1]?.rsi > 70 ? (
                     <Badge variant="destructive">Overbought</Badge>
                  ) : techData[techData.length-1]?.rsi < 30 ? (
                     <Badge className="bg-stock-up">Oversold</Badge>
                  ) : (
                     <Badge variant="secondary">Neutral</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={techData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                      <XAxis dataKey="date" hide />
                      <YAxis domain={[0, 100]} ticks={[0,30,70,100]} stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)' }} />
                      <Line type="step" dataKey={() => 70} stroke="var(--destructive)" strokeDasharray="4 4" dot={false} />
                      <Line type="step" dataKey={() => 30} stroke="var(--stock-up)" strokeDasharray="4 4" dot={false} />
                      <Line type="monotone" dataKey="rsi" stroke="var(--accent)" strokeWidth={2} dot={false} name="RSI" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>MACD (12, 26, 9)</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={techData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                      <XAxis dataKey="date" hide />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)' }} />
                      <Bar dataKey="histogram" fill="var(--muted-foreground)" opacity={0.6} name="Histogram" />
                      <Line type="monotone" dataKey="macd" stroke="var(--primary)" dot={false} name="MACD" />
                      <Line type="monotone" dataKey="signal" stroke="var(--destructive)" dot={false} name="Signal" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          <DataSourceComparison symbol={symbol} />
        </TabsContent>
      </Tabs>
    </div>
  );
}