import { getCachedData, setCachedData } from '@/lib/apiCache';

const generateMockQuote = (symbol) => {
  const basePrice = Math.random() * 3000 + 100;
  const change = (Math.random() - 0.5) * basePrice * 0.05;
  return {
    symbol,
    price: basePrice,
    change: change,
    changePercent: (change / basePrice) * 100,
    volume: Math.floor(Math.random() * 10000000),
    timestamp: new Date().toISOString(),
    source: 'Indian-Stock-Market-API'
  };
};

export const getStockQuote = async (symbol) => {
  const cacheKey = `ind_api_quote_${symbol}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;
  
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = generateMockQuote(symbol);
  setCachedData(cacheKey, data, 30000); // 30s cache
  return data;
};

export const getMarketData = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].map(generateMockQuote);
};

export const getHistoricalData = async (symbol, days) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const data = [];
  let currentPrice = Math.random() * 3000 + 100;
  for(let i=days; i>=0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    currentPrice = currentPrice * (1 + (Math.random() - 0.5) * 0.04);
    data.push({
      date: d.toISOString().split('T')[0],
      close: Number(currentPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000)
    });
  }
  return data;
};