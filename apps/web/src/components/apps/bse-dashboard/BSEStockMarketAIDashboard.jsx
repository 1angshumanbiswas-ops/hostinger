import React, { useState, useMemo } from 'react';
import { RefreshCw, Activity, ArrowUpDown, TrendingUp, TrendingDown, Star, BarChart2, Search } from 'lucide-react';
import { useBSEStocks } from '@/hooks/useBSEStocks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecommendationBadgeForBSE from './RecommendationBadgeForBSE';
import PerformanceMetricsCard from './PerformanceMetricsCard';
import StockSearchBar from './StockSearchBar';
import StockFilterPanel from './StockFilterPanel';
import StockDetailModal from './StockDetailModal';
import SectorPerformanceTabs from './SectorPerformanceTabs';
import InsertITStocksButton from './InsertITStocksButton';
import { useToast } from '@/hooks/use-toast';

export default function BSEStockMarketAIDashboard() {
  const { stocks, loading, error, refreshData, usingMock } = useBSEStocks();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const [filters, setFilters] = useState({ sector: 'All', recommendation: 'All' });
  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const { toast } = useToast();

  const sectors = useMemo(() => {
    if (!stocks || stocks.length === 0) return [];
    return [...new Set(stocks.map(s => s.sector).filter(Boolean))].sort();
  }, [stocks]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleWatchlist = (e, symbol) => {
    e.stopPropagation();
    setWatchlist(prev => {
      const isWatched = prev.includes(symbol);
      if (isWatched) {
        toast({ title: "Removed from Watchlist", description: `${symbol} has been removed.` });
        return prev.filter(s => s !== symbol);
      } else {
        toast({ title: "Added to Watchlist", description: `${symbol} has been added.` });
        return [...prev, symbol];
      }
    });
  };

  const filteredAndSortedStocks = useMemo(() => {
    let result = [...(stocks || [])];

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(stock => 
        stock.symbol.toLowerCase().includes(lowerSearch) || 
        stock.company_name.toLowerCase().includes(lowerSearch)
      );
    }

    // Sector filter
    if (filters.sector !== 'All') {
      const normalizedFilterSector = filters.sector.trim().toLowerCase();
      result = result.filter(stock => {
        const stockSector = (stock.sector || '').trim().toLowerCase();
        return stockSector === normalizedFilterSector;
      });
    }

    // Recommendation filter
    if (filters.recommendation !== 'All') {
      result = result.filter(stock => stock.recommendation === filters.recommendation);
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [stocks, searchTerm, sortConfig, filters]);

  // Calculate Market Overview Metrics
  const sensexValue = useMemo(() => {
    if (!stocks?.length) return { value: 73500, change: 0 };
    const avgChange = stocks.reduce((acc, curr) => acc + curr.change_percent, 0) / stocks.length;
    return { 
      value: (73500 * (1 + avgChange/100)).toFixed(2), 
      change: avgChange.toFixed(2) 
    };
  }, [stocks]);

  const advances = useMemo(() => stocks?.filter(s => s.change_percent > 0).length || 0, [stocks]);
  const declines = useMemo(() => stocks?.filter(s => s.change_percent < 0).length || 0, [stocks]);

  const topAIPick = useMemo(() => {
    if (!stocks?.length) return 'N/A';
    const buyStocks = stocks.filter(s => s.recommendation === 'BUY' && s.confidence);
    if (buyStocks.length === 0) return 'N/A';
    const topPick = buyStocks.sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0];
    return topPick.symbol;
  }, [stocks]);

  if (loading && !stocks?.length) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Initializing BSE AI Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                BSE Stock Market AI
              </h1>
              <Badge variant="secondary" className="ml-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                {usingMock ? 'DEMO' : 'LIVE'}
              </Badge>
            </div>
            <p className="mt-2 text-muted-foreground">
              Real-time Bombay Stock Exchange analysis with intelligent AI-powered recommendations across {sectors.length} sectors.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <InsertITStocksButton onSuccess={refreshData} />
            <Button onClick={refreshData} disabled={loading} variant="outline" className="flex items-center gap-2 border-primary/20 hover:bg-primary/10">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg border border-destructive/20 text-sm font-medium">
            Failed to sync with BSE market feed: {error.message}. Using fallback data.
          </div>
        )}

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PerformanceMetricsCard 
            title="BSE SENSEX" 
            value={sensexValue.value} 
            change={parseFloat(sensexValue.change)}
            isPercent={true}
            icon={Activity}
          />
          <PerformanceMetricsCard 
            title="Market Breadth" 
            value={`${advances} Adv / ${declines} Dec`} 
            icon={BarChart2}
          />
          <PerformanceMetricsCard 
            title="AI Top Pick" 
            value={topAIPick}
            icon={Star}
          />
        </div>

        {/* Sector Performance Tabs - NEW COMPONENT */}
        <SectorPerformanceTabs stocks={stocks || []} />

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between bg-card p-4 rounded-xl border border-border">
          <StockSearchBar value={searchTerm} onChange={setSearchTerm} />
          <StockFilterPanel filters={filters} setFilters={setFilters} sectors={sectors} />
        </div>

        {/* Active Filters Display */}
        {(filters.sector !== 'All' || filters.recommendation !== 'All') && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active Filters:</span>
            {filters.sector !== 'All' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Sector: {filters.sector}
                <button 
                  onClick={() => setFilters({...filters, sector: 'All'})}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.recommendation !== 'All' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Signal: {filters.recommendation}
                <button 
                  onClick={() => setFilters({...filters, recommendation: 'All'})}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            <button 
              onClick={() => setFilters({ sector: 'All', recommendation: 'All' })}
              className="text-xs text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSortedStocks.length} of {stocks?.length || 0} BSE stocks
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold w-10"></th>
                  <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('symbol')}>
                    <div className="flex items-center gap-1">Symbol <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('sector')}>
                    <div className="flex items-center gap-1">Sector <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('current_price')}>
                    <div className="flex items-center gap-1">LTP (₹) <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('change_percent')}>
                    <div className="flex items-center gap-1">Change <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold hidden md:table-cell cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('market_cap')}>
                    <div className="flex items-center gap-1">Market Cap <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors hidden lg:table-cell" onClick={() => handleSort('pe_ratio')}>
                    <div className="flex items-center gap-1">P/E <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('confidence')}>
                    <div className="flex items-center gap-1">AI Signal <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedStocks?.map((stock) => {
                  const isPositive = stock.change_percent >= 0;
                  const isWatched = watchlist.includes(stock.symbol);
                  return (
                    <tr 
                      key={`stock-${stock.id}`}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedStock(stock)}
                    >
                      <td className="px-6 py-4">
                        <button 
                          onClick={(e) => toggleWatchlist(e, stock.symbol)}
                          className="focus:outline-none"
                        >
                          <Star className={`w-4 h-4 transition-colors ${isWatched ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground group-hover:text-foreground'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                          {stock.company_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-xs">
                          {stock.sector || 'General'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        ₹{stock.current_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 font-semibold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {Math.abs(stock.change_percent).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">
                        ₹{(stock.market_cap / 10000000000).toFixed(2)}K Cr
                      </td>
                      <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell">
                        {stock.pe_ratio.toFixed(1)}
                      </td>
                      <td className="px-6 py-4">
                        <RecommendationBadgeForBSE 
                          recommendation={stock.recommendation} 
                          confidence={stock.confidence || 60} 
                          rationale={stock.rationale || 'AI analysis in progress'}
                        />
                      </td>
                    </tr>
                  );
                })}
                {filteredAndSortedStocks.length === 0 && !loading && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-muted-foreground">
                      <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p>No BSE stocks found matching filters</p>
                      <p className="text-xs mt-2">Try selecting a different sector or clearing filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {selectedStock && (
        <StockDetailModal 
          stock={selectedStock} 
          open={!!selectedStock} 
          onOpenChange={(open) => !open && setSelectedStock(null)} 
        />
      )}
    </div>
  );
}