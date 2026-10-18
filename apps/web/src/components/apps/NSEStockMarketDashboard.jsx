import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Search, Clock, ChevronLeft, ChevronRight, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { useNSEStocks } from '@/hooks/useNSEStocks';
import MarketOverviewCard from './nse-dashboard/MarketOverviewCard';
import StockTableRow from './nse-dashboard/StockTableRow';
import StockDetailModal from './nse-dashboard/StockDetailModal';

// Dummy Sparkline Data for Overviews
const niftyData = Array.from({ length: 20 }, (_, i) => ({ value: 22000 + Math.random() * 500 + (i * 20) }));
const sensexData = Array.from({ length: 20 }, (_, i) => ({ value: 73000 + Math.random() * 1000 + (i * 40) }));

export default function NSEStockMarketDashboard() {
  const navigate = useNavigate();
  const { stocks, recommendations, loading, error } = useNSEStocks();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    const lower = searchTerm.toLowerCase();
    return stocks.filter(s => 
      s.symbol.toLowerCase().includes(lower) || 
      s.company_name.toLowerCase().includes(lower)
    );
  }, [stocks, searchTerm]);

  const handleViewDetails = (stock, recommendation) => {
    setSelectedStock({ stock, recommendation });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24 relative font-sans text-foreground">
      <Helmet>
        <title>NSE STOCK MARKET Agentic AI | ERP</title>
        <meta name="description" content="Real-time NSE Stock Analysis and AI Recommendations." />
      </Helmet>

      {/* HEADER SECTION */}
      <header className="bg-card text-card-foreground shadow-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">NSE STOCK MARKET Agentic AI</h1>
              <p className="text-sm text-muted-foreground">Real-time Stock Analysis & AI Recommendations</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
            <Clock className="w-4 h-4" />
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* MARKET OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MarketOverviewCard 
            title="NIFTY 50" 
            value="22,453.30" 
            changePercent={0.85} 
            sparklineData={niftyData} 
          />
          <MarketOverviewCard 
            title="SENSEX" 
            value="73,903.91" 
            changePercent={0.72} 
            sparklineData={sensexData} 
          />
          <Card className="bg-card shadow-sm border-border flex flex-col">
            <CardContent className="pt-6 flex flex-col h-full justify-between space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-1">Market Status</div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--success))] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(var(--success))]"></span>
                    </span>
                    <span className="text-xl font-bold text-foreground">Open</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">Sentiment</div>
                  <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20 font-bold">
                    Bullish
                  </Badge>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 flex justify-between items-center border border-border">
                <span className="text-sm text-muted-foreground">Trading Volume</span>
                <span className="font-mono font-semibold">1.24B</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h3 className="font-bold">Error Loading Market Data</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* STOCK WATCHLIST TABLE */}
        <Card className="bg-card shadow-sm border-border">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-foreground">AI Watchlist & Recommendations</h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search symbol or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background border-input"
              />
            </div>
          </div>
          
          <div className="rounded-b-lg border-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-foreground">Symbol</TableHead>
                  <TableHead className="font-semibold text-foreground hidden md:table-cell">Company Name</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Price (₹)</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Change %</TableHead>
                  <TableHead className="font-semibold text-foreground text-right hidden lg:table-cell">52W High</TableHead>
                  <TableHead className="font-semibold text-foreground text-right hidden lg:table-cell">52W Low</TableHead>
                  <TableHead className="font-semibold text-foreground text-right hidden xl:table-cell">P/E</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">AI Rec</TableHead>
                  <TableHead className="font-semibold text-foreground">Confidence</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 10 }).map((_, j) => (
                        <TableCell key={j} className={j > 3 && j < 7 ? "hidden lg:table-cell" : ""}>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <StockTableRow 
                      key={stock.id} 
                      stock={stock} 
                      recommendation={recommendations[stock.id]} 
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                      No stocks found matching "{searchTerm}"
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Back Navigation */}
        <div className="pt-4 flex justify-start">
          <Button
            onClick={() => navigate('/scm-logistics')}
            variant="outline"
            className="border-border text-foreground hover:bg-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to SCM Logistics
          </Button>
        </div>
      </main>

      {/* Pagination Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/scm-logistics')}
            className="flex items-center gap-2 border-border text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-foreground">
              Page 6 of 6
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              NSE Stock Dashboard
            </span>
          </div>

          <Button
            disabled={true}
            className="flex items-center gap-2 bg-primary opacity-50 text-primary-foreground cursor-not-allowed"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <StockDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stock={selectedStock?.stock}
        recommendation={selectedStock?.recommendation}
      />
    </div>
  );
}