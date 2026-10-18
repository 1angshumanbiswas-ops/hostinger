import React, { createContext, useContext, useState, useCallback } from 'react';

const StockRefreshContext = createContext();

export const useStockRefresh = () => useContext(StockRefreshContext);

export const StockRefreshProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    // Simulate a brief minimum loading time for visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRefreshing(false);
  }, []);

  return (
    <StockRefreshContext.Provider value={{ refreshTrigger, triggerRefresh, isRefreshing }}>
      {children}
    </StockRefreshContext.Provider>
  );
};