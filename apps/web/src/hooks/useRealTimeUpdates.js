import { useState, useEffect } from 'react';
import { TTL } from '@/lib/apiCache';

export function useRealTimeUpdates(symbols = []) {
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    let mounted = true;
    
    const pollUpdates = () => {
      if (!mounted || symbols.length === 0) return;
      
      const newUpdates = {};
      symbols.forEach(sym => {
        // Simulate minor price fluctuations for real-time feel
        newUpdates[sym] = {
          priceTick: (Math.random() - 0.5) * 2,
          timestamp: Date.now()
        };
      });
      setUpdates(prev => ({ ...prev, ...newUpdates }));
    };

    const interval = setInterval(pollUpdates, 5000); // Fast poll for ticker effect
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [symbols.join(',')]);

  return updates;
}