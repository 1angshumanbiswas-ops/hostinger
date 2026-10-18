import { getCachedData, setCachedData } from '@/lib/apiCache';

// Simulating Yahoo Finance Public Endpoints
export const getStockData = async (symbol) => {
  const cacheKey = `yf_quote_${symbol}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  await new Promise(resolve => setTimeout(resolve, 450));
  const basePrice = Math.random() * 3000 + 100;
  const data = {
    symbol,
    price: basePrice * 1.002, // slight variation to show diff sources
    change: (Math.random() - 0.5) * 50,
    changePercent: (Math.random() - 0.5) * 3,
    volume: Math.floor(Math.random() * 12000000),
    timestamp: new Date(Date.now() - 5000).toISOString(),
    source: 'Yahoo Finance'
  };
  setCachedData(cacheKey, data, 30000);
  return data;
};

export const getHistoricalPrices = async (symbol, range) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const days = range === '1mo' ? 30 : range === '3mo' ? 90 : 365;
  const data = [];
  let price = Math.random() * 3000 + 100;
  for(let i=days; i>=0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    price = price * (1 + (Math.random() - 0.5) * 0.05);
    data.push({
      date: d.toISOString().split('T')[0],
      close: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 8000000)
    });
  }
  return data;
};