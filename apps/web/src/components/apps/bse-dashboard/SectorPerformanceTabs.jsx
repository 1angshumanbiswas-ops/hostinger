import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

// Define all sectors without Consumer, with IT after Banking
const ALL_SECTORS = [
  'Banking',
  'IT',
  'Automobile',
  'Pharma',
  'Energy',
  'FMCG',
  'Metals',
  'Realty',
  'Telecom',
  'Utilities',
  'Cement',
  'Chemicals',
  'Textiles'
];

// Normalized sector matching function
const normalizeSector = (sector) => {
  if (!sector || typeof sector !== 'string') return '';
  return sector.trim().toLowerCase();
};

const matchesSector = (stockSector, targetSector) => {
  const normalizedStock = normalizeSector(stockSector);
  const normalizedTarget = normalizeSector(targetSector);
  return normalizedStock === normalizedTarget;
};

export default function SectorPerformanceTabs({ stocks }) {
  const [activeTab, setActiveTab] = useState('Banking');

  // DEBUG: Log incoming stocks prop
  useEffect(() => {
    console.log('=== SectorPerformanceTabs DEBUG ===');
    console.log('Total stocks received:', stocks?.length || 0);
    
    if (stocks && stocks.length > 0) {
      console.log('First stock structure:', stocks[0]);
      console.log('Sample stock data:');
      stocks.slice(0, 3).forEach(stock => {
        console.log(`  - ${stock.symbol} (${stock.company_name}): sector="${stock.sector}", change=${stock.change_percent}%, price=₹${stock.current_price}`);
      });

      // Log IT sector stocks specifically
      const itStocks = stocks.filter(s => normalizeSector(s.sector) === 'it');
      console.log('\n=== IT SECTOR STOCKS ===');
      console.log('IT stocks found:', itStocks.length);
      itStocks.forEach(stock => {
        console.log(`  - ${stock.symbol} (${stock.company_name}): change=${stock.change_percent}%, price=₹${stock.current_price}`);
      });
    }
  }, [stocks]);

  // Calculate sector performance metrics with comprehensive logging
  const sectorMetrics = useMemo(() => {
    console.log('\n=== CALCULATING SECTOR METRICS ===');
    
    if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
      console.warn('No stocks data available for sector metrics calculation');
      return ALL_SECTORS.reduce((acc, sector) => {
        acc[sector] = {
          sector,
          totalChange: 0,
          stockCount: 0,
          totalPriceChange: 0,
          performance: 0,
          avgPriceChange: 0,
          hasData: false
        };
        return acc;
      }, {});
    }

    const metrics = {};

    // Initialize all sectors
    ALL_SECTORS.forEach(sector => {
      metrics[sector] = {
        sector,
        totalChange: 0,
        stockCount: 0,
        totalPriceChange: 0,
        hasData: false,
        matchedStocks: [] // For debugging
      };
    });

    console.log('Total stocks to process:', stocks.length);

    // Track unmatched stocks
    const unmatchedStocks = [];

    // Aggregate stock data by sector
    stocks.forEach((stock, index) => {
      if (!stock || typeof stock !== 'object') {
        console.warn(`Stock at index ${index} is invalid:`, stock);
        return;
      }

      const stockSector = stock.sector;
      const changePercent = parseFloat(stock.change_percent);
      const currentPrice = parseFloat(stock.current_price);

      // Calculate price change (current price * change percentage / 100)
      const priceChange = !isNaN(currentPrice) && !isNaN(changePercent) 
        ? (currentPrice * changePercent / 100) 
        : 0;

      // Log first few stocks in detail
      if (index < 5) {
        console.log(`\nProcessing stock #${index + 1}:`);
        console.log(`  Symbol: ${stock.symbol}`);
        console.log(`  Company: ${stock.company_name}`);
        console.log(`  Sector (raw): "${stockSector}"`);
        console.log(`  Sector (normalized): "${normalizeSector(stockSector)}"`);
        console.log(`  Change %: ${changePercent}`);
        console.log(`  Current Price: ₹${currentPrice}`);
        console.log(`  Calculated Price Change: ₹${priceChange.toFixed(2)}`);
      }

      // Try to match with known sectors
      let matched = false;
      for (const targetSector of ALL_SECTORS) {
        if (matchesSector(stockSector, targetSector)) {
          if (index < 10) {
            console.log(`  ✓ Matched to sector: ${targetSector}`);
          }
          
          if (!isNaN(changePercent)) {
            metrics[targetSector].totalChange += changePercent;
            metrics[targetSector].stockCount += 1;
            metrics[targetSector].totalPriceChange += priceChange;
            metrics[targetSector].hasData = true;
            metrics[targetSector].matchedStocks.push(stock.symbol);
          }
          matched = true;
          break;
        }
      }

      if (!matched) {
        unmatchedStocks.push({
          symbol: stock.symbol,
          sector: stockSector,
          normalizedSector: normalizeSector(stockSector)
        });
      }
    });

    console.log('\n=== SECTOR BREAKDOWN ===');
    ALL_SECTORS.forEach(sector => {
      const data = metrics[sector];
      if (data.stockCount > 0) {
        data.performance = Number((data.totalChange / data.stockCount).toFixed(2));
        data.avgPriceChange = Number((data.totalPriceChange / data.stockCount).toFixed(2));
        
        console.log(`${sector}:`);
        console.log(`  Stock Count: ${data.stockCount}`);
        console.log(`  Stocks: ${data.matchedStocks.join(', ')}`);
        console.log(`  Avg Performance: ${data.performance}%`);
        console.log(`  Avg Price Change: ₹${data.avgPriceChange.toFixed(2)}`);
      } else {
        data.performance = 0;
        data.avgPriceChange = 0;
        console.log(`${sector}: No stocks`);
      }
    });

    // Special IT sector verification
    if (metrics['IT']) {
      console.log('\n=== IT SECTOR VERIFICATION ===');
      console.log('IT Sector Data:', {
        stockCount: metrics['IT'].stockCount,
        stocks: metrics['IT'].matchedStocks,
        performance: metrics['IT'].performance,
        avgPriceChange: metrics['IT'].avgPriceChange,
        hasData: metrics['IT'].hasData
      });
      
      // Verify we have the expected 5 IT stocks
      const expectedITStocks = ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM'];
      const foundITStocks = metrics['IT'].matchedStocks;
      console.log('Expected IT stocks:', expectedITStocks);
      console.log('Found IT stocks:', foundITStocks);
      
      const missingStocks = expectedITStocks.filter(s => !foundITStocks.includes(s));
      if (missingStocks.length > 0) {
        console.warn('⚠️ Missing IT stocks:', missingStocks);
      }
    }

    if (unmatchedStocks.length > 0) {
      console.warn('\n⚠️ UNMATCHED STOCKS:');
      unmatchedStocks.forEach(stock => {
        console.warn(`  ${stock.symbol}: sector="${stock.sector}" (normalized: "${stock.normalizedSector}")`);
      });
    }

    console.log('\n=== METRICS CALCULATION COMPLETE ===\n');

    return metrics;
  }, [stocks]);

  const activeSectorData = sectorMetrics[activeTab] || {
    sector: activeTab,
    performance: 0,
    stockCount: 0,
    avgPriceChange: 0,
    hasData: false
  };

  const isPositive = activeSectorData.performance > 0;
  const isNegative = activeSectorData.performance < 0;

  // Log active tab data
  useEffect(() => {
    console.log(`\n=== ACTIVE TAB: ${activeTab} ===`);
    console.log('Sector data:', activeSectorData);
  }, [activeTab, activeSectorData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Sector Performance Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Select a sector to view detailed performance metrics
        </p>
      </CardHeader>
      <CardContent>
        {/* Two-Column Layout: Vertical Tabs Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-6">
          {/* LEFT COLUMN: Vertical Sector Tabs */}
          <div className="flex flex-col gap-1 border-r border-border pr-4">
            {ALL_SECTORS.map(sector => {
              const data = sectorMetrics[sector];
              const hasData = data?.hasData;
              const isActive = activeTab === sector;

              return (
                <button
                  key={sector}
                  onClick={() => setActiveTab(sector)}
                  className={`
                    px-4 py-3 rounded-lg text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-md font-semibold' 
                      : 'bg-muted/30 hover:bg-muted/50 text-foreground'
                    }
                    ${!hasData ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{sector}</span>
                    {hasData && (
                      <span className={`text-xs font-bold ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {data.stockCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Sector Content */}
          <div className="space-y-6">
            {/* Sector Header with Active Badge */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <h3 className="text-2xl font-bold text-foreground">{activeTab} Sector</h3>
              {activeSectorData.hasData ? (
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-muted-foreground opacity-30" />
                  <span className="text-sm font-medium text-muted-foreground">No Data</span>
                </div>
              )}
            </div>

            {/* No Data State */}
            {!activeSectorData.hasData && (
              <div className="p-6 bg-muted/20 rounded-lg border border-dashed border-border">
                <Activity className="w-8 h-8 mb-3 text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground">
                  No stocks available in the {activeTab} sector at this time.
                </p>
              </div>
            )}

            {/* Performance Metrics - Vertical Stack */}
            {activeSectorData.hasData && (
              <div className="flex flex-col gap-3">
                {/* Overall Performance */}
                <div className="sector-metric-card py-3 px-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Overall Performance</span>
                    {isPositive ? (
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    ) : isNegative ? (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    ) : (
                      <Activity className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`text-3xl font-black tracking-tight ${
                    isPositive ? 'sector-performance-positive' : 
                    isNegative ? 'sector-performance-negative' : 
                    'text-muted-foreground'
                  }`}>
                    {activeSectorData.performance > 0 ? '+' : ''}{activeSectorData.performance.toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average change across all stocks
                  </p>
                </div>

                {/* Stock Count */}
                <div className="sector-metric-card py-3 px-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Stock Count</span>
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-black tracking-tight text-foreground">
                    {activeSectorData.stockCount}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeSectorData.stockCount === 1 ? 'Stock' : 'Stocks'} in this sector
                  </p>
                </div>

                {/* Average Price Change */}
                <div className="sector-metric-card py-3 px-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Avg. Price Change</span>
                    {activeSectorData.avgPriceChange > 0 ? (
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    ) : activeSectorData.avgPriceChange < 0 ? (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    ) : (
                      <Activity className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`text-3xl font-black tracking-tight ${
                    activeSectorData.avgPriceChange > 0 ? 'sector-performance-positive' : 
                    activeSectorData.avgPriceChange < 0 ? 'sector-performance-negative' : 
                    'text-muted-foreground'
                  }`}>
                    {activeSectorData.avgPriceChange > 0 ? '+' : ''}₹{Math.abs(activeSectorData.avgPriceChange).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average price movement
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}