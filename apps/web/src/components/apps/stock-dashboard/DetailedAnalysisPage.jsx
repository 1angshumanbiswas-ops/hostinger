import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { Activity, Database, TrendingUp } from 'lucide-react';
import { Helmet } from 'react-helmet';

import * as IndianAPI from '@/utils/IndianStockMarketRealAPI';
import * as FreeSources from '@/utils/FreeFinancialDataSources';
import { fetchRealEconomicIndicators } from '@/utils/NDAPRealAPI';
import { smaCalculator, rsiCalculator, macdCalculator } from '@/utils/TechnicalIndicatorsCalculator';
import DataSourceComparison from './DataSourceComparison';

export default function DetailedAnalysisPage() {
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
      if (!symbol) return;
      setLoading(true);
      try {
        let q, h;
        const days = parseInt(timeframe);
        
        if (source === 'indian-api') {
          q = await IndianAPI.fetchRealStockQuote(symbol);
        } else if (source === 'yahoo') {
          q = await FreeSources.fetchYahooFinanceQuote(symbol);
        } else {
          q = await FreeSources.fetchGoogleFinanceQuote(symbol);
        }
        
        // Historical always fetched from IndianAPI for simplicity in this demo logic
        h = await IndianAPI.fetchRealHistorical(symbol, days);

        setQuote(q);
        setHistory(h.reverse());

        const eco = await fetchRealEconomicIndicators();
        setEconomy(eco);

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
      <Helmet>
        <title>BSE Stock Market AI - {symbol} Detailed Analysis</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{symbol}</h1>
            <Badge variant="secondary" className="text-xs animate-pulse bg-primary/10">BSE Live Analysis</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-3xl font-bold">₹{quote.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            <span className={`text-xl font-medium flex items-center ${isPos ? 'text-stock-up' : 'text-destructive'}`}>
              {isPos ? '+' : ''}{quote.change.toFixed(2)} ({isPos ? '+' : ''}{quote.changePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Last Updated: {new Date(quote.timestamp).toLocaleTimeString()} • Source: {quote.source}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border">
          <Database className="h-4 w-4 text-muted-foreground" />
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-[220px] border-none bg-transparent shadow-none focus:ring-0 font-medium">
              <SelectValue placeholder="Data Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indian-api">BSE Market API</SelectItem>
              <SelectItem value="yahoo">Yahoo Finance (External)</SelectItem>
              <SelectItem value="google">Google Finance (External)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[500px]">
          <TabsTrigger value="overview">Real-Time Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Indicators</TabsTrigger>
          <TabsTrigger value="compare">Source Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>BSE Historical Price & Volume</CardTitle>
                <CardDescription>Actual closing prices and trading volume from BSE sources</CardDescription>
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
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
                      labelStyle={{ color: 'var(--foreground)' }}
                    />
                    <Bar yAxisId="vol" dataKey="volume" fill="var(--muted)" opacity={0.5} name="Volume" />
                    <Line yAxisId="price" type="monotone" dataKey="close" stroke="var(--primary)" strokeWidth={2} dot={false} name="Price" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6 mt-6">
          <Card>
            <CardHeader><CardTitle>BSE Price with SMA 20</CardTitle></CardHeader>
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
                  <span>Relative Strength Index (RSI 14)</span>
                  {techData[techData.length-1]?.rsi > 70 ? (
                     <Badge variant="destructive">Overbought</Badge>
                  ) : techData[techData.length-1]?.rsi < 30 ? (
                     <Badge className="bg-stock-up text-white">Oversold</Badge>
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
              <CardHeader><CardTitle>BSE MACD (12, 26, 9)</CardTitle></CardHeader>
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