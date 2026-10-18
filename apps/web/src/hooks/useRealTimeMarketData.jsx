import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { fetchAllMarketData } from '@/utils/FreeFinancialDataSourcesIntegration';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/utils/debuggingLogger';

const MarketDataContext = createContext(null);

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

export const MarketDataProvider = ({ children }) => {
  const [sensexData, setSensexData] = useState(null);
  const [sensexHistory, setSensexHistory] = useState([]);
  const [topStocks, setTopStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const { toast } = useToast();
  const consecutiveErrors = useRef(0);
  const maxErrorsBeforeMute = 3;

  const refresh = useCallback(async (force = true) => {
    try {
      if (force && !sensexData) setLoading(true); // Only show global loading if we have no data at all
      
      const { sensex, history, stocks } = await fetchAllMarketData(force);
      
      if (!sensex || !stocks || stocks.length === 0) {
        throw new Error('Received incomplete data from APIs');
      }

      setSensexData(sensex);
      setSensexHistory(history);
      setTopStocks(stocks);
      setLastUpdated(new Date());
      setError(null);
      consecutiveErrors.current = 0; // Reset error count on success
      
      if (force && consecutiveErrors.current === 0) {
        // Optional success toast
      }
    } catch (err) {
      consecutiveErrors.current += 1;
      const errorMsg = err.message || 'Failed to fetch real-time market data';
      
      // Categorize error severity
      const isTemporary = errorMsg.includes('Rate limit') || errorMsg.includes('timeout') || errorMsg.includes('fetch');
      
      if (isTemporary) {
        logger.logWarnOnce('useRealTimeMarketData', `Temporary API issue: ${errorMsg}`);
      } else {
        logger.logErrorOnce('useRealTimeMarketData', err);
      }

      // Only set error state if we have absolutely no data to show
      if (!sensexData && !topStocks.length) {
        setError(errorMsg);
      }

      // Only toast if we haven't spammed the user recently
      if (force && consecutiveErrors.current <= maxErrorsBeforeMute) {
        toast({ 
          title: "Market Data Degraded", 
          description: "Using cached or fallback data due to connectivity limits.", 
          variant: "destructive" 
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast, sensexData, topStocks.length]);

  useEffect(() => {
    refresh(false);

    // Dynamic polling interval based on errors (Exponential Backoff)
    const getIntervalTime = () => {
      if (!isMarketOpen()) return 300000; // 5 mins if closed
      const base = 60000; // 1 min base
      // Backoff up to ~8 mins max
      return Math.min(base * Math.pow(1.5, consecutiveErrors.current), 500000);
    };

    let timeoutId;
    const poll = () => {
      timeoutId = setTimeout(async () => {
        await refresh(true);
        poll(); // schedule next iteration
      }, getIntervalTime());
    };
    
    poll();

    return () => clearTimeout(timeoutId);
  }, [refresh]);

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