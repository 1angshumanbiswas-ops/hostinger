// Mock implementations for API calls to prevent breaking without real API keys
// Implements 5-minute TTL caching internally

const CACHE = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const cached = CACHE.get(key);
  if (cached && Date.now() - cached.timestamp < TTL) {
    return cached.data;
  }
  return null;
};

const setCache = (key, data) => {
  CACHE.set(key, { data, timestamp: Date.now() });
};

export const fetchStockPrice = async (symbol) => {
  const cached = getCached(`stock_${symbol}`);
  if (cached) return cached;
  
  // Mock API Call
  const data = {
    asset_name: symbol,
    type: 'stock',
    price: +(Math.random() * 500 + 50).toFixed(2),
    change_24h: +(Math.random() * 10 - 5).toFixed(2),
    bid: +(Math.random() * 500 + 49).toFixed(2),
    ask: +(Math.random() * 500 + 51).toFixed(2),
    timestamp: new Date().toISOString()
  };
  setCache(`stock_${symbol}`, data);
  return data;
};

export const fetchCommodityPrice = async (commodity) => {
  const cached = getCached(`commodity_${commodity}`);
  if (cached) return cached;
  const data = {
    asset_name: commodity,
    type: 'commodity',
    price: +(Math.random() * 2000 + 1000).toFixed(2),
    change_24h: +(Math.random() * 5 - 2.5).toFixed(2),
    bid: +(Math.random() * 2000 + 990).toFixed(2),
    ask: +(Math.random() * 2000 + 1010).toFixed(2),
    timestamp: new Date().toISOString()
  };
  setCache(`commodity_${commodity}`, data);
  return data;
};

export const fetchCryptoPrice = async (symbol) => {
  const cached = getCached(`crypto_${symbol}`);
  if (cached) return cached;
  const data = {
    asset_name: symbol,
    type: 'crypto',
    price: +(Math.random() * 60000 + 1000).toFixed(2),
    change_24h: +(Math.random() * 20 - 10).toFixed(2),
    bid: +(Math.random() * 60000 + 900).toFixed(2),
    ask: +(Math.random() * 60000 + 1100).toFixed(2),
    timestamp: new Date().toISOString()
  };
  setCache(`crypto_${symbol}`, data);
  return data;
};

export const fetchForexRate = async (pair) => {
  const cached = getCached(`forex_${pair}`);
  if (cached) return cached;
  const data = {
    asset_name: pair,
    type: 'forex',
    price: +(Math.random() * 1.5 + 0.5).toFixed(4),
    change_24h: +(Math.random() * 2 - 1).toFixed(2),
    bid: +(Math.random() * 1.5 + 0.49).toFixed(4),
    ask: +(Math.random() * 1.5 + 0.51).toFixed(4),
    timestamp: new Date().toISOString()
  };
  setCache(`forex_${pair}`, data);
  return data;
};

export const fetchAllMarketData = async () => {
  const assets = [
    { fn: fetchStockPrice, args: ['AAPL'] },
    { fn: fetchStockPrice, args: ['TSLA'] },
    { fn: fetchCryptoPrice, args: ['BTC'] },
    { fn: fetchCryptoPrice, args: ['ETH'] },
    { fn: fetchCommodityPrice, args: ['GOLD'] },
    { fn: fetchForexRate, args: ['EUR/USD'] }
  ];
  
  try {
    return await Promise.all(assets.map(a => a.fn(...a.args)));
  } catch (error) {
    console.error("Error fetching all market data", error);
    return [];
  }
};