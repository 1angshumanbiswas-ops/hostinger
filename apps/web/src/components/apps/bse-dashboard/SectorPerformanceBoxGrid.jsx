import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronUp, ChevronDown, Minus, TrendingUp, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define all 14 BSE sectors
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
  'Consumer',
  'Cement',
  'Chemicals',
  'Textiles'
];

export default function SectorPerformanceBoxGrid({ stocks }) {
  const sectorData = useMemo(() => {
    try {
      if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
        // Return all sectors with 0 performance if no stocks
        return ALL_SECTORS.map(sector => ({
          sector,
          performance: 0,
          count: 0,
          status: 'no-data',
          avgPrice: 0
        }));
      }

      // Group stocks by sector and calculate metrics
      const sectorMap = {};
      
      // Initialize all sectors
      ALL_SECTORS.forEach(sector => {
        sectorMap[sector] = { 
          total: 0, 
          count: 0, 
          totalPrice: 0 
        };
      });

      // Aggregate stock data by sector
      stocks.forEach(stock => {
        if (!stock || typeof stock !== 'object') return;
        
        const sector = stock.sector?.trim() || 'Other';
        const changePercent = parseFloat(stock.change_percent);
        const currentPrice = parseFloat(stock.current_price);
        
        // Only process if it's one of our defined sectors and has valid data
        if (ALL_SECTORS.includes(sector) && !isNaN(changePercent)) {
          sectorMap[sector].total += changePercent;
          sectorMap[sector].count += 1;
          if (!isNaN(currentPrice)) {
            sectorMap[sector].totalPrice += currentPrice;
          }
        }
      });

      // Calculate average performance for each sector
      const processedData = ALL_SECTORS.map(sector => {
        const { total, count, totalPrice } = sectorMap[sector];
        const performance = count > 0 ? Number((total / count).toFixed(2)) : 0;
        const avgPrice = count > 0 ? Number((totalPrice / count).toFixed(2)) : 0;
        
        // Determine status for color coding
        let status = 'neutral';
        if (count === 0) {
          status = 'no-data';
        } else if (performance > 0) {
          status = 'positive';
        } else if (performance < 0) {
          status = 'negative';
        }

        return {
          sector,
          performance,
          count,
          status,
          avgPrice
        };
      });

      // Filter out any invalid data and sort by performance
      const validData = processedData.filter(item => 
        item && 
        typeof item.sector === 'string' && 
        typeof item.performance === 'number' && 
        !isNaN(item.performance) &&
        typeof item.count === 'number'
      );

      return validData.sort((a, b) => b.performance - a.performance);
    } catch (error) {
      console.error('Error processing sector data:', error);
      return ALL_SECTORS.map(sector => ({
        sector,
        performance: 0,
        count: 0,
        status: 'no-data',
        avgPrice: 0
      }));
    }
  }, [stocks]);

  // Get status-specific class names
  const getBoxClassName = (status) => {
    const baseClass = 'sector-box';
    if (status === 'positive') return `${baseClass} sector-box-positive`;
    if (status === 'negative') return `${baseClass} sector-box-negative`;
    return `${baseClass} sector-box-neutral`;
  };

  // Get appropriate icon based on performance
  const getPerformanceIcon = (performance) => {
    if (performance > 0) return <ChevronUp className="sector-box-icon" />;
    if (performance < 0) return <ChevronDown className="sector-box-icon" />;
    return <Minus className="sector-box-icon" />;
  };

  // Loading skeleton
  if (!stocks || stocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sector Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="sector-performance-grid">
            {ALL_SECTORS.map((sector, index) => (
              <div key={index} className="sector-box-skeleton" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const stocksWithSectors = stocks.filter(s => s.sector && ALL_SECTORS.includes(s.sector)).length;
  const activeSectors = sectorData.filter(s => s && s.count > 0).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Sector Performance Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Analyzing {stocksWithSectors} stocks across {activeSectors} active sectors
        </p>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={200}>
          <div className="sector-performance-grid">
            {sectorData.map((sector) => {
              if (!sector) return null;

              const hasData = sector.count > 0;

              return (
                <Tooltip key={sector.sector}>
                  <TooltipTrigger asChild>
                    <div className={getBoxClassName(sector.status)}>
                      {/* Sector Name */}
                      <div className="sector-box-name">
                        {sector.sector}
                      </div>

                      {/* Performance with Icon */}
                      <div className="sector-box-performance">
                        {getPerformanceIcon(sector.performance)}
                        <span className="sector-box-percentage">
                          {sector.performance > 0 ? '+' : ''}{sector.performance.toFixed(2)}%
                        </span>
                      </div>

                      {/* Stock Count */}
                      <div className="sector-box-count">
                        {hasData 
                          ? `${sector.count} stock${sector.count !== 1 ? 's' : ''}`
                          : 'No stocks'
                        }
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs p-3">
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-sm border-b border-border pb-1">
                        {sector.sector}
                      </h4>
                      <div className="text-xs space-y-1">
                        <p>
                          <span className="font-semibold text-foreground">Performance:</span>{' '}
                          <span className={`font-bold ${
                            sector.performance > 0 ? 'text-emerald-500' : 
                            sector.performance < 0 ? 'text-red-500' : 
                            'text-muted-foreground'
                          }`}>
                            {sector.performance > 0 ? '+' : ''}{sector.performance.toFixed(2)}%
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Stock Count:</span>{' '}
                          <span className="text-muted-foreground">
                            {sector.count} {sector.count === 1 ? 'stock' : 'stocks'}
                          </span>
                        </p>
                        {hasData && sector.avgPrice > 0 && (
                          <p>
                            <span className="font-semibold text-foreground">Avg. Price:</span>{' '}
                            <span className="text-muted-foreground">
                              ₹{sector.avgPrice.toLocaleString('en-IN', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </span>
                          </p>
                        )}
                        <p className="text-muted-foreground italic mt-2 pt-2 border-t border-border">
                          {sector.status === 'positive' 
                            ? 'Sector showing positive momentum' 
                            : sector.status === 'negative' 
                            ? 'Sector experiencing decline' 
                            : hasData 
                            ? 'Sector relatively stable' 
                            : 'No data available for this sector'
                          }
                        </p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Summary stats */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <p className="text-emerald-500 font-bold text-xl">
                {sectorData.filter(s => s && s.performance > 0 && s.count > 0).length}
              </p>
              <p className="text-muted-foreground font-medium">Advancing</p>
            </div>
            <div>
              <p className="text-muted-foreground font-bold text-xl">
                {sectorData.filter(s => s && s.performance === 0 && s.count > 0).length}
              </p>
              <p className="text-muted-foreground font-medium">Neutral</p>
            </div>
            <div>
              <p className="text-red-500 font-bold text-xl">
                {sectorData.filter(s => s && s.performance < 0 && s.count > 0).length}
              </p>
              <p className="text-muted-foreground font-medium">Declining</p>
            </div>
          </div>
        </div>

        {/* Info message if no data */}
        {activeSectors === 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground p-4 bg-muted/20 rounded-lg border border-dashed border-border">
            <AlertCircle className="w-4 h-4" />
            <p>No sector data available. Stock data may still be loading.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}