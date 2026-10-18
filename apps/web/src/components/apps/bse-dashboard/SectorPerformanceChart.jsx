import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

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

export default function SectorPerformanceChart({ stocks }) {
  const sectorData = useMemo(() => {
    try {
      if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
        // Return all sectors with 0 performance if no stocks
        return ALL_SECTORS.map(sector => ({
          sector,
          performance: 0,
          count: 0,
          status: 'no-data'
        }));
      }

      // Group stocks by sector and calculate average change
      const sectorMap = {};
      
      // Initialize all sectors
      ALL_SECTORS.forEach(sector => {
        sectorMap[sector] = { total: 0, count: 0 };
      });

      // Aggregate stock data by sector
      stocks.forEach(stock => {
        if (!stock || typeof stock !== 'object') return;
        
        const sector = stock.sector?.trim() || 'Other';
        const changePercent = parseFloat(stock.change_percent);
        
        // Only process if it's one of our defined sectors and has valid data
        if (ALL_SECTORS.includes(sector) && !isNaN(changePercent)) {
          sectorMap[sector].total += changePercent;
          sectorMap[sector].count += 1;
        }
      });

      // Calculate average performance for each sector
      const processedData = ALL_SECTORS.map(sector => {
        const { total, count } = sectorMap[sector];
        const performance = count > 0 ? Number((total / count).toFixed(2)) : 0;
        
        // Determine status for color coding
        let status = 'neutral';
        if (count === 0) {
          status = 'no-data';
        } else if (performance > 0.1) {
          status = 'positive';
        } else if (performance < -0.1) {
          status = 'negative';
        }

        return {
          sector,
          performance,
          count,
          status
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
        status: 'no-data'
      }));
    }
  }, [stocks]);

  // Color mapping based on performance
  const getBarColor = (status, performance) => {
    if (status === 'no-data') return '#94a3b8'; // Slate gray for no data
    if (performance > 0.1) return '#10b981'; // Green for positive
    if (performance < -0.1) return '#ef4444'; // Red for negative
    return '#f59e0b'; // Amber/yellow for neutral
  };

  // Custom tooltip component with comprehensive safety checks
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }

    const data = payload[0]?.payload;
    
    if (!data || typeof data !== 'object') {
      return null;
    }

    const { sector, count, performance } = data;
    
    if (typeof sector !== 'string' || typeof count !== 'number' || typeof performance !== 'number') {
      return null;
    }

    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="font-semibold text-foreground mb-1">{sector}</p>
        <p className="text-sm text-muted-foreground">
          {count > 0 ? `${count} stock${count !== 1 ? 's' : ''}` : 'No stocks'}
        </p>
        {count > 0 && (
          <p className={`text-sm font-bold mt-1 ${
            performance > 0 ? 'text-emerald-500' : 
            performance < 0 ? 'text-red-500' : 
            'text-amber-500'
          }`}>
            {performance > 0 ? '+' : ''}{performance.toFixed(2)}%
          </p>
        )}
      </div>
    );
  };

  // Validate data before rendering
  const hasValidData = sectorData && Array.isArray(sectorData) && sectorData.length > 0;
  const stocksWithSectors = hasValidData 
    ? sectorData.filter(s => s && s.count > 0).length 
    : 0;

  if (!hasValidData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sector Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No sector data available. Unable to display sector performance.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Sector Performance Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Analyzing {stocks?.length || 0} stocks across {stocksWithSectors} active sectors
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={sectorData} 
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                domain={['auto', 'auto']}
                tickFormatter={(val) => `${val}%`}
                fontSize={11}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                type="category" 
                dataKey="sector" 
                width={100}
                fontSize={11}
                stroke="hsl(var(--muted-foreground))"
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="performance" radius={[0, 4, 4, 0]}>
                {sectorData.map((entry, index) => {
                  const color = getBarColor(
                    entry?.status || 'no-data', 
                    entry?.performance || 0
                  );
                  const opacity = (entry?.count || 0) === 0 ? 0.3 : 1;
                  
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={color}
                      opacity={opacity}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-muted-foreground">Positive (&gt;0.1%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-muted-foreground">Neutral (±0.1%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-muted-foreground">Negative (&lt;-0.1%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded opacity-30" style={{ backgroundColor: '#94a3b8' }}></div>
            <span className="text-muted-foreground">No Data</span>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <p className="text-emerald-500 font-bold text-lg">
                {sectorData.filter(s => s && s.performance > 0.1).length}
              </p>
              <p className="text-muted-foreground">Advancing</p>
            </div>
            <div>
              <p className="text-amber-500 font-bold text-lg">
                {sectorData.filter(s => s && s.performance >= -0.1 && s.performance <= 0.1 && s.count > 0).length}
              </p>
              <p className="text-muted-foreground">Neutral</p>
            </div>
            <div>
              <p className="text-red-500 font-bold text-lg">
                {sectorData.filter(s => s && s.performance < -0.1).length}
              </p>
              <p className="text-muted-foreground">Declining</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}