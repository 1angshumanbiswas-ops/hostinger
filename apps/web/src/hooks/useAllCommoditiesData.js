import { useState, useEffect } from 'react';
import { getCachedData, setCachedData, isCacheValid, clearCache, TTL } from '@/lib/apiCache';

const COMMODITIES = [
  { symbol: 'CL=F', name: 'Crude Oil', category: 'Energy', unit: 'Barrels' },
  { symbol: 'NG=F', name: 'Natural Gas', category: 'Energy', unit: 'MMBtu' },
  { symbol: 'GC=F', name: 'Gold', category: 'Precious Metals', unit: 'Ounces' },
  { symbol: 'SI=F', name: 'Silver', category: 'Precious Metals', unit: 'Ounces' },
  { symbol: 'HG=F', name: 'Copper', category: 'Industrial Metals', unit: 'Pounds' },
  { symbol: 'ZC=F', name: 'Corn', category: 'Agriculture', unit: 'Bushels' },
  { symbol: 'ZW=F', name: 'Wheat', category: 'Agriculture', unit: 'Bushels' },
  { symbol: 'LE=F', name: 'Live Cattle', category: 'Livestock', unit: 'Pounds' },
];

export function useAllCommoditiesData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      const cacheKey = 'all_commodities_data';
      
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

        // Mocking real API calls with realistic data for demonstration
        const mockData = COMMODITIES.map(c => {
          const basePrice = Math.random() * 100 + 50;
          const change = (Math.random() - 0.5) * 5;
          return {
            ...c,
            price: basePrice,
            change: change,
            changePercent: (change / basePrice) * 100,
            high: basePrice + Math.random() * 2,
            low: basePrice - Math.random() * 2,
            volume: Math.floor(Math.random() * 100000),
            openInterest: Math.floor(Math.random() * 50000),
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
          setError(err.message || 'Failed to fetch commodity data');
          // Fallback to cache even if expired if we have it
          const fallbackData = getCachedData(cacheKey);
          if (fallbackData) {
            setData(fallbackData);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      clearCache('all_commodities_data');
      fetchData();
    }, TTL);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}