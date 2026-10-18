import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { fetchDailySeries } from '@/utils/StockAPI';

const StockChart = ({ symbol, color = "#2563eb" }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      const series = await fetchDailySeries(symbol);
      if (mounted) {
        // Take last 7 days for a sparkline effect
        setData(series.slice(-7)); 
        setLoading(false);
      }
    };
    loadData();
    return () => mounted = false;
  }, [symbol]);

  if (loading) {
    return (
      <div className="h-16 w-full flex items-center justify-center bg-slate-50/50 rounded">
        <Loader2 className="h-4 w-4 text-slate-300 animate-spin" />
      </div>
    );
  }

  if (data.length < 2) {
    return <div className="h-16 w-full flex items-center justify-center text-xs text-slate-300">No Data</div>;
  }

  // Calculate min/max for scaling
  const values = data.map(d => parseFloat(d.close));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = range * 0.1; // 10% padding
  const plotMin = Math.max(0, min - padding);
  const plotMax = max + padding;
  const plotRange = plotMax - plotMin;

  // Generate SVG points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.close - plotMin) / plotRange) * 100;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = data[data.length - 1].close >= data[0].close;
  const strokeColor = isPositive ? '#10b981' : '#ef4444'; // Green or Red

  return (
    <div className="h-16 w-full relative overflow-hidden">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible" 
        preserveAspectRatio="none"
      >
        <motion.polyline
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Fill Gradient Area */}
        <motion.polygon
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.1 }}
           transition={{ delay: 0.5 }}
           points={`${points} 100,120 0,120`}
           fill={strokeColor}
           stroke="none"
        />
      </svg>
    </div>
  );
};

export default StockChart;