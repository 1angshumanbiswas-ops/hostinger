import { getCachedData, setCachedData, TTL } from '@/lib/apiCache';

const BSE_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', basePrice: 2900, vol: 5000000, mcap: '19.5T' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', basePrice: 3800, vol: 2000000, mcap: '14.2T' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', basePrice: 1450, vol: 15000000, mcap: '11.1T' },
  { symbol: 'INFY', name: 'Infosys', basePrice: 1600, vol: 4000000, mcap: '6.5T' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', basePrice: 1050, vol: 12000000, mcap: '7.3T' },
  { symbol: 'SBIN', name: 'State Bank of India', basePrice: 750, vol: 18000000, mcap: '6.7T' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', basePrice: 1100, vol: 6000000, mcap: '6.2T' },
  { symbol: 'ITC', name: 'ITC Limited', basePrice: 420, vol: 10000000, mcap: '5.2T' },
];

const generateMockQuote = (stock) => {
  const variation = (Math.random() - 0.5) * 0.04; // +/- 2% daily variation
  const currentPrice = stock.basePrice * (1 + variation);
  const change = currentPrice - stock.basePrice;
  const changePercent = (change / stock.basePrice) * 100;
  
  return {
    symbol: stock.symbol,
    name: stock.name,
    price: parseFloat(currentPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    volume: Math.floor(stock.vol * (0.8 + Math.random() * 0.4)),
    marketCap: stock.mcap,
    timestamp: new Date().toISOString()
  };
};

export const fetchBSEQuote = async (symbol) => {
  const cacheKey = `bse_quote_${symbol}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency

  const stock = BSE_STOCKS.find(s => s.symbol === symbol);
  if (!stock) throw new Error(`Stock ${symbol} not found on BSE.`);

  const quote = generateMockQuote(stock);
  setCachedData(cacheKey, quote, TTL / 5); // 1 minute cache for real-time feel
  return quote;
};

export const fetchBSEHistoricalData = async (symbol, days = 30) => {
  const cacheKey = `bse_hist_${symbol}_${days}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 500));

  const stock = BSE_STOCKS.find(s => s.symbol === symbol) || BSE_STOCKS[0];
  const data = [];
  let currentPrice = stock.basePrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02; 
    const dailyChange = 1 + (Math.random() - 0.5) * volatility;
    
    const open = currentPrice;
    const close = currentPrice * dailyChange;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(stock.vol * (0.5 + Math.random()))
    });
    
    currentPrice = close;
  }

  setCachedData(cacheKey, data, TTL);
  return data;
};

export const fetchTopGainersAndLosers = async () => {
  const cacheKey = `bse_movers`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 400));

  const quotes = BSE_STOCKS.map(generateMockQuote);
  quotes.sort((a, b) => b.changePercent - a.changePercent);

  const result = {
    gainers: quotes.slice(0, 3),
    losers: quotes.slice(-3).reverse()
  };

  setCachedData(cacheKey, result, TTL / 5);
  return result;
};

export const searchStocks = async (query) => {
  if (!query) return [];
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const lowerQuery = query.toLowerCase();
  return BSE_STOCKS.filter(s => 
    s.symbol.toLowerCase().includes(lowerQuery) || 
    s.name.toLowerCase().includes(lowerQuery)
  ).map(s => ({ symbol: s.symbol, name: s.name }));
};