import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchStockSearch } from '@/utils/StockAPI';
import { useToast } from "@/components/ui/use-toast";

const StockSearchBar = ({ onAddStock, watchlist }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const { toast } = useToast();

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length > 1) {
        setSearching(true);
        setIsOpen(true);
        const matches = await fetchStockSearch(query);
        setResults(matches);
        setSearching(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (symbol) => {
    if (watchlist.includes(symbol)) {
      toast({
        title: "Already in Watchlist",
        description: `${symbol} is already being tracked.`,
        variant: "default",
      });
      return;
    }
    onAddStock(symbol);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md z-30" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, MSFT)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className="pl-9 bg-white border-slate-200 focus:border-blue-500 transition-all shadow-sm"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result['1. symbol']}
              onClick={() => handleSelect(result['1. symbol'])}
              className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
            >
              <div>
                <p className="font-bold text-slate-900">{result['1. symbol']}</p>
                <p className="text-xs text-slate-500 truncate max-w-[200px]">{result['2. name']}</p>
              </div>
              <div>
                {watchlist.includes(result['1. symbol']) ? (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Added
                  </span>
                ) : (
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Plus className="w-4 h-4 text-slate-400" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isOpen && !searching && results.length === 0 && query.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-slate-200 shadow-xl p-4 text-center text-sm text-slate-500">
           No matching stocks found.
        </div>
      )}
    </div>
  );
};

export default StockSearchBar;