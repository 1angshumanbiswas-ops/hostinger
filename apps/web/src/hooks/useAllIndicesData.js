import { useState, useEffect } from 'react';
import { getCachedData, setCachedData, isCacheValid, clearCache, TTL } from '@/lib/apiCache';

const INDICES_LIST = [
  { symbol: 'SPX', name: 'S&P 500', region: 'US' },
  { symbol: 'NDX', name: 'NASDAQ 100', region: 'US' },
  { symbol: 'DJI', name: 'Dow Jones', region: 'US' },
  { symbol: 'RUT', name: 'Russell 2000', region: 'US' },
  { symbol: 'N225', name: 'Nikkei 225', region: 'Asia' },
  { symbol: 'FTSE', name: 'FTSE 100', region: 'Europe' },
  { symbol: 'DAX', name: 'DAX Performance-Index', region: 'Europe' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', region: 'US' },
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', region: 'US' },
];

export function useAllIndicesData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      const cacheKey = 'all_indices_data';
      
      try {
        setLoading(true);

        if (isCacheValid(cacheKey)) {
          if (mounted) {
            setData(getCachedData(cacheKey));
            setError(null);
            setLoading(false);
          }
          return;
        }

        // Mock data generator for indices since free APIs for real-time indices are often heavily rate-limited
        const mockData = INDICES_LIST.map(idx => {
          const basePrice = Math.random() * 4000 + 100;
          const change = (Math.random() - 0.5) * 50;
          return {
            symbol: idx.symbol,
            name: idx.name,
            region: idx.region,
            price: basePrice,
            change: change,
            changePercent: (change / basePrice) * 100,
            high: basePrice + Math.random() * 20,
            low: basePrice - Math.random() * 20,
            volume: Math.floor(Math.random() * 50000000),
            timestamp: new Date().toISOString()
          };
        });

        if (mounted) {
          setData(mockData);
          setCachedData(cacheKey, mockData, TTL);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to fetch indices data');
          const fallbackData = getCachedData(cacheKey);
          if (fallbackData) setData(fallbackData);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      clearCache('all_indices_data');
      fetchData();
    }, TTL);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}