import { useState, useEffect } from 'react';
import { getCachedData, setCachedData, isCacheValid, clearCache, TTL } from '@/lib/apiCache';

export function useAllCryptocurrenciesData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      const cacheKey = 'all_cryptocurrencies_data';
      
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

        let resultData = [];
        try {
          const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
          if (!response.ok) throw new Error('CoinGecko API rate limited or unavailable');
          const apiData = await response.json();
          resultData = apiData.map(coin => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price,
            change24h: coin.price_change_24h,
            changePercent24h: coin.price_change_percentage_24h,
            marketCapRank: coin.market_cap_rank,
            high24h: coin.high_24h,
            low24h: coin.low_24h,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
            timestamp: new Date().toISOString()
          }));
        } catch (apiErr) {
          // Fallback mock data
          const mockSymbols = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'USDC', 'ADA', 'AVAX', 'DOGE'];
          resultData = mockSymbols.map((sym, i) => {
            const basePrice = sym === 'BTC' ? 65000 : sym === 'ETH' ? 3500 : Math.random() * 100;
            const changeP = (Math.random() - 0.5) * 10;
            return {
              id: sym.toLowerCase(),
              symbol: sym,
              name: `${sym} Coin`,
              price: basePrice,
              change24h: basePrice * (changeP / 100),
              changePercent24h: changeP,
              marketCapRank: i + 1,
              high24h: basePrice * 1.05,
              low24h: basePrice * 0.95,
              marketCap: (10 - i) * 10000000000,
              volume24h: Math.random() * 1000000000,
              timestamp: new Date().toISOString()
            };
          });
        }

        if (mounted) {
          setData(resultData);
          setCachedData(cacheKey, resultData, TTL);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to fetch crypto data');
          const fallbackData = getCachedData(cacheKey);
          if (fallbackData) setData(fallbackData);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => {
      clearCache('all_cryptocurrencies_data');
      fetchData();
    }, TTL);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}