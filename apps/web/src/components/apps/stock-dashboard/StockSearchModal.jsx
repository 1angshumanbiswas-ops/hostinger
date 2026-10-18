import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { getFallbackStocks } from '@/lib/bseMarketFallbackData';

export default function StockSearchModal({ open, onOpenChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        // Fallback simulated search since we may lack full DB access in real time without api keys
        const allStocks = getFallbackStocks();
        const lowerQ = query.toLowerCase();
        const matches = allStocks.filter(s => 
          s.symbol.toLowerCase().includes(lowerQ) || 
          (s.name && s.name.toLowerCase().includes(lowerQ))
        );
        
        // Simulating search latency
        await new Promise(res => setTimeout(res, 400));
        setResults(matches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (symbol) => {
    onOpenChange(false);
    navigate(`/stock-dashboard/analysis/${symbol}`);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle>Search BSE Stocks (BSE Stock Market AI)</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Type company name or symbol (e.g. RELIANCE)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto mt-4 space-y-2">
          {loading && <div className="text-center text-sm text-muted-foreground py-4">Searching BSE data...</div>}
          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">No BSE results found for "{query}"</div>
          )}
          {!loading && results.map((stock) => {
            const isPositive = stock.change >= 0;
            return (
              <div
                key={stock.symbol}
                onClick={() => handleSelect(stock.symbol)}
                className="flex justify-between items-center p-3 hover:bg-muted rounded-md cursor-pointer transition-colors border border-transparent hover:border-border"
              >
                <div>
                  <div className="font-semibold text-foreground">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-foreground">₹{stock.price?.toFixed(2)}</div>
                  <div className={`text-xs flex items-center justify-end ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {stock.changePercent?.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}