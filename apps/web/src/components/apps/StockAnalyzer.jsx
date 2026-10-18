import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, LayoutGrid, Clock, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import StockSearchBar from './StockSearchBar';
import StockCard from './StockCard';
import { fetchStockQuote, fetchCompanyOverview } from '@/utils/StockAPI';

const DEFAULT_WATCHLIST = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];

const StockAnalyzer = () => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('stock_watchlist');
    return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
  });
  
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { toast } = useToast();

  // Persist Watchlist
  useEffect(() => {
    localStorage.setItem('stock_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch Data Logic
  const fetchAllData = async (isAutoRefresh = false) => {
    if (watchlist.length === 0) return;
    
    setLoading(true);
    const newData = { ...stockData };
    let errors = 0;

    // Process serially or in small batches to respect rate limits if possible
    // For "Demo" API key it's fast, but for real free key we might hit 429s.
    // We will try parallel for better UX and handle failures individually.
    
    const promises = watchlist.map(async (symbol) => {
      try {
        const [quote, overview] = await Promise.all([
            fetchStockQuote(symbol),
            fetchCompanyOverview(symbol)
        ]);
        
        newData[symbol] = {
            ...quote,
            name: overview?.Name || quote.name || symbol,
            sector: overview?.Sector || 'Unknown',
            mktCap: overview?.MarketCapitalization || 'N/A',
            high: overview?.['52WeekHigh'] || 0,
            low: overview?.['52WeekLow'] || 0,
        };
      } catch (err) {
        console.error(`Failed to fetch ${symbol}`, err);
        errors++;
      }
    });

    await Promise.all(promises);

    setStockData(newData);
    setLastUpdated(new Date());
    setLoading(false);

    if (errors > 0 && !isAutoRefresh) {
        toast({
            title: "Partial Update",
            description: `Updated data, but ${errors} stocks failed to sync.`,
            variant: "destructive"
        });
    } else if (!isAutoRefresh) {
        toast({
            title: "Market Data Updated",
            description: "Successfully synced latest prices.",
            className: "bg-emerald-600 text-white border-none"
        });
    }
  };

  // Initial Load & Auto Refresh
  useEffect(() => {
    fetchAllData(true);
    const interval = setInterval(() => fetchAllData(true), 60000); // 60s
    return () => clearInterval(interval);
  }, [watchlist]); // Refetch if watchlist changes? Ideally optimize this.

  const handleAddStock = async (symbol) => {
    if (watchlist.includes(symbol)) return;
    
    const newWatchlist = [...watchlist, symbol];
    setWatchlist(newWatchlist);
    
    toast({
        title: "Stock Added",
        description: `Tracking ${symbol} in your watchlist.`,
    });
    
    // Fetch data for new stock immediately
    try {
        setLoading(true);
        const [quote, overview] = await Promise.all([
            fetchStockQuote(symbol),
            fetchCompanyOverview(symbol)
        ]);
        
        setStockData(prev => ({
            ...prev,
            [symbol]: {
                ...quote,
                name: overview?.Name || symbol,
                sector: overview?.Sector || 'Unknown',
                mktCap: overview?.MarketCapitalization || 'N/A',
                high: overview?.['52WeekHigh'] || 0,
                low: overview?.['52WeekLow'] || 0,
            }
        }));
    } catch (e) {
        toast({ title: "Fetch Error", description: "Could not load initial data.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const handleRemoveStock = (symbol) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
    setStockData(prev => {
        const next = { ...prev };
        delete next[symbol];
        return next;
    });
    toast({
        title: "Stock Removed",
        description: `${symbol} removed from watchlist.`,
    });
  };

  return (
    <div className="min-h-[600px] flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
         <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <LayoutGrid className="w-6 h-6 text-blue-600" />
               Global Markets Tracker
            </h1>
            <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                   <Clock className="w-3.5 h-3.5" />
                   Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Syncing...'}
                </p>
                {import.meta.env.VITE_ALPHA_VANTAGE_API_KEY ? null : (
                     <Badge variant="outline" className="text-[10px] h-5 bg-amber-50 text-amber-700 border-amber-200">
                        Demo Mode
                     </Badge>
                )}
            </div>
         </div>
         
         <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
             <StockSearchBar onAddStock={handleAddStock} watchlist={watchlist} />
             <Button 
                variant="outline" 
                onClick={() => fetchAllData(false)}
                className={loading ? "opacity-70 cursor-not-allowed" : ""}
                disabled={loading}
             >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
             </Button>
         </div>
      </div>

      {/* Grid Content */}
      {watchlist.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center min-h-[300px]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <LayoutGrid className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Your watchlist is empty</h3>
              <p className="text-slate-500 max-w-sm mt-2 mb-6">
                  Search for companies like Apple, Tesla, or Microsoft to start tracking their performance.
              </p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                  {watchlist.map(symbol => (
                      <StockCard 
                        key={symbol} 
                        stock={{ symbol, ...stockData[symbol] }} 
                        onRemove={handleRemoveStock}
                      />
                  ))}
              </AnimatePresence>
          </div>
      )}
      
      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3 text-xs text-blue-700">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Market data provided by Alpha Vantage. Prices may be delayed by up to 15 minutes. 
            In Demo Mode, some data is simulated for demonstration purposes. 
            Trading involves risk; this tool is for informational purposes only.
          </p>
      </div>
    </div>
  );
};

export default StockAnalyzer;