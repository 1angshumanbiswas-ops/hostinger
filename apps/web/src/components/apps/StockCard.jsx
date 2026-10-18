import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, X, Globe, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StockChart from './StockChart';

const StockCard = ({ stock, onRemove }) => {
  const isPositive = stock.change >= 0;
  
  // Format numbers for display
  const formatMarketCap = (cap) => {
    if (!cap || cap === 'N/A') return 'N/A';
    // Check if mock data string (e.g. "2.7T") or raw number
    if (typeof cap === 'string') return cap;
    if (cap > 1000000000000) return `$${(cap / 1000000000000).toFixed(2)}T`;
    if (cap > 1000000000) return `$${(cap / 1000000000).toFixed(2)}B`;
    return `$${(cap / 1000000).toFixed(2)}M`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group"
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50"
            onClick={() => onRemove(stock.symbol)}
        >
            <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Header */}
      <div className="p-4 border-b border-slate-50">
        <div className="flex justify-between items-start mb-1">
            <div>
                <h3 className="font-bold text-xl text-slate-900">{stock.symbol}</h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[150px]" title={stock.name || "Unknown Company"}>
                    {stock.name || "Loading..."}
                </p>
            </div>
            <div className={`text-right ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                <div className="font-bold text-lg flex items-center justify-end">
                    <span className="text-slate-900 mr-2 text-sm font-normal">$</span>
                    {stock.price ? Number(stock.price).toFixed(2) : '--.--'}
                </div>
                <div className={`text-xs font-bold flex items-center justify-end px-1.5 py-0.5 rounded ${isPositive ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {stock.change > 0 ? '+' : ''}{stock.change || '0.00'} ({stock.changePercent || '0%'})
                </div>
            </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="px-4 py-2 h-20 flex items-center">
        {stock.price ? (
            <StockChart symbol={stock.symbol} />
        ) : (
            <div className="w-full h-full bg-slate-50 animate-pulse rounded"></div>
        )}
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 mt-auto">
         <div className="bg-white p-3 flex flex-col justify-center">
             <span className="text-[10px] uppercase text-slate-400 font-semibold mb-0.5">52W High</span>
             <span className="text-sm font-medium text-slate-700">${stock.high || '--'}</span>
         </div>
         <div className="bg-white p-3 flex flex-col justify-center">
             <span className="text-[10px] uppercase text-slate-400 font-semibold mb-0.5">52W Low</span>
             <span className="text-sm font-medium text-slate-700">${stock.low || '--'}</span>
         </div>
         <div className="bg-white p-3 flex flex-col justify-center">
             <span className="text-[10px] uppercase text-slate-400 font-semibold mb-0.5">Mkt Cap</span>
             <span className="text-sm font-medium text-slate-700">{formatMarketCap(stock.mktCap)}</span>
         </div>
         <div className="bg-white p-3 flex flex-col justify-center">
             <span className="text-[10px] uppercase text-slate-400 font-semibold mb-0.5">Volume</span>
             <span className="text-sm font-medium text-slate-700">
                {stock.volume ? (stock.volume / 1000000).toFixed(1) + 'M' : '--'}
             </span>
         </div>
      </div>
      
      {/* Footer Status */}
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
         <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Market Open
         </span>
         <span>Real-time</span>
      </div>
    </motion.div>
  );
};

export default StockCard;