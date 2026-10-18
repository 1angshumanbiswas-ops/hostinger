import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllMarketData, SECTOR_MAPPING } from '@/utils/FreeFinancialDataSourcesIntegration';

export const useRealTimeSectorData = () => {
  const [data, setData] = useState({
    sensexData: null,
    topStocks: [],
    sectors: [],
    loading: true,
    error: null,
    lastUpdated: new Date(),
    validationErrors: []
  });

  const abortControllerRef = useRef(null);

  const calculateSectorsAndValidate = (stocks) => {
    const result = [];
    const validationErrors = [];

    Object.entries(SECTOR_MAPPING).forEach(([sectorName, details]) => {
      const sectorStocks = stocks.filter(s => details.symbols.includes(s.symbol));
      
      if (sectorStocks.length > 0) {
        // Calculate sector performance as the average change percent of constituents
        const avgChange = sectorStocks.reduce((sum, s) => sum + s.changePercent, 0) / sectorStocks.length;
        const calculatedAvg = Number(avgChange.toFixed(2));
        
        // Data Validation Logic
        const maxConstituentChange = Math.max(...sectorStocks.map(s => s.changePercent));
        const minConstituentChange = Math.min(...sectorStocks.map(s => s.changePercent));
        
        if (calculatedAvg > maxConstituentChange || calculatedAvg < minConstituentChange) {
            validationErrors.push(`Sector ${sectorName} calculation mismatch: Average (${calculatedAvg}%) is out of constituent bounds.`);
        }
        
        result.push({
          sectorName,
          description: details.description,
          changePercent: calculatedAvg,
          status: calculatedAvg > 0.05 ? 'positive' : calculatedAvg < -0.05 ? 'negative' : 'neutral',
          constituents: sectorStocks.map(s => s.symbol).join(', '),
          constituentData: sectorStocks
        });
      } else {
        validationErrors.push(`Sector ${sectorName} has no constituent data from BSE feed.`);
        result.push({ 
          sectorName, 
          description: details.description, 
          changePercent: 0, 
          status: 'neutral', 
          constituents: 'None',
          constituentData: []
        });
      }
    });

    return { 
      sectors: result.sort((a,b) => b.changePercent - a.changePercent),
      validationErrors 
    };
  };

  const fetchData = useCallback(async (forceReal = false) => {
    setData(prev => ({ ...prev, loading: true, error: null, validationErrors: [] }));

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const realData = await fetchAllMarketData(forceReal, abortControllerRef.current.signal);
      const { sectors, validationErrors } = calculateSectorsAndValidate(realData.stocks);

      setData({
        sensexData: realData.sensex,
        topStocks: realData.stocks,
        sectors,
        loading: false,
        error: null,
        lastUpdated: new Date(),
        validationErrors
      });

      if (validationErrors.length > 0) {
        console.warn('[Data Validation] Discrepancies detected in sector rollups:', validationErrors);
      }

    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('[useRealTimeSectorData] Fetch failed:', error);
      
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch unified market data',
        validationErrors: ['Failed to fetch live data. Showing cached or fallback data.']
      }));
    }
  }, []);

  useEffect(() => {
    fetchData(false);
    // Polling with 5-minute TTL (300,000 ms)
    const interval = setInterval(() => fetchData(true), 300000); 
    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchData]);

  return { ...data, refresh: () => fetchData(true) };
};