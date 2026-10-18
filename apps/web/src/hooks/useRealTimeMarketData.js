import { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { fetchAllMarketData } from '@/utils/FreeFinancialDataSourcesIntegration';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/utils/debuggingLogger';

const MarketDataContext = createContext(null);

const MAX_RETRIES = 3;
const POLLING_INTERVAL = 30000; // 30 seconds

export const MarketDataProvider = ({ children }) => {
  const [sensexData, setSensexData] = useState(null);
  const [sensexHistory, setSensexHistory] = useState([]);
  const [topStocks, setTopStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const { toast } = useToast();
  const abortControllerRef = useRef(null);
  const timeoutRef = useRef(null);
  const isFetchingRef = useRef(false);
  const retryCountRef = useRef(0);

  const fetchData = useCallback(async (force = false) => {
    // Prevent overlapping fetch calls
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    // Abort previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      if (force && !sensexData) setLoading(true);
      
      const { sensex, history, stocks } = await fetchAllMarketData(force, signal);
      
      if (!sensex || !stocks || stocks.length === 0) {
        throw new Error('Received incomplete data from market providers.');
      }

      setSensexData(sensex);
      setSensexHistory(history);
      setTopStocks(stocks);
      setLastUpdated(new Date());
      setError(null);
      retryCountRef.current = 0; // Reset retries on success

    } catch (err) {
      if (err.name === 'AbortError') {
        // Ignored, component unmounted or request deliberately superseded
        return;
      }

      logger.logErrorOnce('useRealTimeMarketData', err);

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        const backoffTime = Math.pow(2, retryCountRef.current - 1) * 1000; // 1s, 2s, 4s
        
        logger.logWarnOnce('useRealTimeMarketData', `Retrying fetch in ${backoffTime}ms (Attempt ${retryCountRef.current}/${MAX_RETRIES})`);
        
        timeoutRef.current = setTimeout(() => {
          isFetchingRef.current = false;
          fetchData(force);
        }, backoffTime);
        
        return; // Don't set error state yet, wait for retry
      }

      // Only set error if we completely failed and have no data to show
      if (!sensexData && !topStocks.length) {
        setError(err.message || 'Failed to connect to market data providers. Please check your connection.');
      }

      toast({ 
        title: "Market Data Unavailable", 
        description: "Experiencing connectivity issues. Showing cached data if available.", 
        variant: "destructive" 
      });
      
    } finally {
      if (!timeoutRef.current) {
        isFetchingRef.current = false;
      }
      setLoading(false);
    }
  }, [sensexData, topStocks.length, toast]);

  // Expose a safe manual refresh wrapper
  const refresh = useCallback((force = true) => {
    retryCountRef.current = 0; // Reset retries on manual refresh
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    isFetchingRef.current = false;
    return fetchData(force);
  }, [fetchData]);

  useEffect(() => {
    // Initial fetch
    fetchData(false);

    // Setup polling interval
    const intervalId = setInterval(() => {
      retryCountRef.current = 0;
      fetchData(true);
    }, POLLING_INTERVAL);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Helper to determine if market is currently open
  const isMarketOpen = () => {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const hours = istTime.getHours();
    const mins = istTime.getMinutes();
    const day = istTime.getDay();
    
    if (day === 0 || day === 6) return false;
    const timeInHours = hours + mins / 60;
    return timeInHours >= 9.25 && timeInHours <= 15.5;
  };

  const value = {
    sensexData,
    sensexHistory,
    topStocks,
    loading,
    error,
    refresh,
    lastUpdated,
    isMarketOpen: isMarketOpen()
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};

export const useRealTimeMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error("useRealTimeMarketData must be used within a MarketDataProvider");
  }
  return context;
};