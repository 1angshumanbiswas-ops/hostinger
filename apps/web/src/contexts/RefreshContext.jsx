import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { clearAllAppCache } from '@/lib/apiCache';
import { useToast } from '@/components/ui/use-toast';

const RefreshContext = createContext(null);

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};

export const RefreshProvider = ({ children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const { toast } = useToast();
  
  // Store callbacks for active components that need to refresh their data
  const refreshCallbacks = useRef({});

  const registerCallback = useCallback((id, callback) => {
    refreshCallbacks.current[id] = callback;
  }, []);

  const unregisterCallback = useCallback((id) => {
    delete refreshCallbacks.current[id];
  }, []);

  const refreshAllData = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    
    try {
      // 1. Clear the API Cache
      clearAllAppCache();
      
      // 2. Trigger re-fetch on all registered components
      const promises = Object.values(refreshCallbacks.current).map(callback => {
        // Ensure the callback returns a promise or handle sync functions
        try {
          return Promise.resolve(callback());
        } catch (e) {
          console.error("Error in refresh callback", e);
          return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      setLastRefreshTime(new Date());
      toast({
        title: "Data Refreshed",
        description: "All dashboards have been updated with the latest data.",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200"
      });
      
    } catch (error) {
      console.error("Global refresh failed", error);
      toast({
        title: "Refresh Failed",
        description: "There was a problem updating the data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const value = {
    isRefreshing,
    lastRefreshTime,
    refreshAllData,
    registerCallback,
    unregisterCallback
  };

  return (
    <RefreshContext.Provider value={value}>
      {children}
    </RefreshContext.Provider>
  );
};

export default RefreshContext;