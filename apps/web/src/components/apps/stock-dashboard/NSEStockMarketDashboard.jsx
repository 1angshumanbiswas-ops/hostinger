import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, AlertCircle } from 'lucide-react';
import { useNSEStocks } from '@/hooks/useNSEStocks';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import MarketOverviewCard from '@/components/apps/nse-dashboard/MarketOverviewCard';
import StockTableRow from '@/components/apps/nse-dashboard/StockTableRow';
import StockDetailModal from '@/components/apps/nse-dashboard/StockDetailModal';

export default function NSEStockMarketDashboard() {
  const { stocks, loading, error, refreshData } = useNSEStocks();
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const marketSummary = {
    totalStocks: stocks?.length || 0,
    advancing: stocks?.filter(s => s.change_percent > 0).length || 0,
    declining: stocks?.filter(s => s.change_percent < 0).length || 0,
    topGainer: stocks?.reduce((prev, current) => (prev.change_percent > current.change_percent) ? prev : current, stocks[0] || {}),
    topLoser: stocks?.reduce((prev, current) => (prev.change_percent < current.change_percent) ? prev : current, stocks[0] || {})
  };

  if (loading && !stocks?.length) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Activity className="h-12 w-12 animate-pulse text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              BSE/NSE Market AI
            </h1>
            <p className="mt-2 text-muted-foreground">
              Real-time analysis and AI-driven recommendations for Indian stocks.
            </p>
          </div>
          <Button 
            onClick={refreshData} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load market data. {error.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Market Overview */}
        {stocks?.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MarketOverviewCard 
              title="Market Breadth" 
              value={`${marketSummary.advancing} Adv / ${marketSummary.declining} Dec`} 
              subtitle="Current session"
              trend={marketSummary.advancing > marketSummary.declining ? 'up' : 'down'}
            />
            <MarketOverviewCard 
              title="Top Gainer" 
              value={marketSummary.topGainer?.symbol || 'N/A'} 
              subtitle={`+${marketSummary.topGainer?.change_percent?.toFixed(2)}%`}
              trend="up"
            />
            <MarketOverviewCard 
              title="Top Loser" 
              value={marketSummary.topLoser?.symbol || 'N/A'} 
              subtitle={`${marketSummary.topLoser?.change_percent?.toFixed(2)}%`}
              trend="down"
            />
            <MarketOverviewCard 
              title="Active Assets" 
              value={marketSummary.totalStocks.toString()} 
              subtitle="Tracked symbols"
              trend="neutral"
            />
          </div>
        )}

        {/* Stock List Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Symbol</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Change</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">52W High/Low</th>
                  <th className="px-6 py-4 font-medium">AI Signal</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stocks?.map((stock) => (
                  <StockTableRow 
                    key={stock.id} 
                    stock={stock} 
                    onClick={() => handleRowClick(stock)} 
                  />
                ))}
                {!stocks?.length && !loading && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground">
                      No stocks found. Please refresh or check your connection.
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
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}