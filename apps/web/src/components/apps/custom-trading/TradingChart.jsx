import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { Card } from '@/components/ui/card';

const TradingChart = ({ selectedAsset }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: '#f1f5f9' },
        horzLines: { color: '#f1f5f9' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      }
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444'
    });

    // Generate mock data for demonstration
    const generateData = () => {
      const data = [];
      let time = new Date('2024-01-01').getTime() / 1000;
      let price = selectedAsset?.price || 100;
      
      for(let i = 0; i < 100; i++) {
        const open = price + (Math.random() - 0.5) * 2;
        const close = open + (Math.random() - 0.5) * 4;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        
        data.push({ time, open, high, low, close });
        time += 86400; // +1 day
        price = close;
      }
      return data;
    };

    candlestickSeries.setData(generateData());

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [selectedAsset]);

  const timeframes = ['5m', '15m', '30m', '1h', '4h', '1d', '1w'];

  return (
    <Card className="h-full bg-white flex flex-col shadow-sm border-slate-200 p-1">
      <div className="flex gap-2 p-2 border-b border-slate-100 overflow-x-auto">
        {timeframes.map(tf => (
          <button key={tf} className="px-3 py-1 text-xs font-medium rounded bg-slate-100 text-slate-600 hover:bg-slate-200">
            {tf}
          </button>
        ))}
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full relative" />
    </Card>
  );
};

export default TradingChart;