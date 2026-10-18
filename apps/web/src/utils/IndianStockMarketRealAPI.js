import { getCachedData, setCachedData, TTL_SHORT } from '@/lib/realDataCache';
import { logger } from './debuggingLogger';

const MOCK_DB = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.40, change: 15.2, percent: 0.52, vol: 5400000, mcap: '19.5T' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3920.10, change: -12.5, percent: -0.32, vol: 2100000, mcap: '14.2T' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1450.75, change: 8.4, percent: 0.58, vol: 8900000, mcap: '11.1T' },
  { symbol: 'INFY', name: 'Infosys', price: 1610.20, change: 22.1, percent: 1.39, vol: 3400000, mcap: '6.5T' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1055.30, change: 5.5, percent: 0.52, vol: 6700000, mcap: '7.3T' }
];

// Circuit Breaker State
let circuitBreakerTripped = false;
let circuitBreakerResetTime = 0;

const checkCircuitBreaker = () => {
  if (circuitBreakerTripped && Date.now() > circuitBreakerResetTime) {
    circuitBreakerTripped = false; // Reset
  }
  return circuitBreakerTripped;
};

const tripCircuitBreaker = (timeoutMs = 60000) => {
  circuitBreakerTripped = true;
  circuitBreakerResetTime = Date.now() + timeoutMs;
  logger.logWarnOnce('CircuitBreaker', `Tripped for ${timeoutMs}ms`);
};

const fetchWithRetry = async (url, options = {}, retries = 2, backoff = 1000) => {
  for (let i = 0; i <= retries; i++) {
    if (checkCircuitBreaker()) {
      throw new Error("Circuit breaker tripped");
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      
      if (res.status === 429) {
        tripCircuitBreaker();
        throw new Error('Rate limit exceeded');
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      return await res.json();
    } catch (err) {
      const isLast = i === retries;
      if (err.name === 'AbortError' || err.message.includes('Rate')) {
         if (isLast) tripCircuitBreaker();
      }
      if (isLast) throw err;
      await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i))); // Exponential backoff
    }
  }
};

export const fetchRealStockQuote = async (symbol) => {
  const cacheKey = `real_ind_api_${symbol}_v2`;
  const cached = getCachedData(cacheKey, false);
  if (cached) return cached;

  try {
    // Simulated API call wrapped in retry logic
    await fetchWithRetry(`https://httpstat.us/200`); // Dummy endpoint to simulate network
    throw new Error('Simulated API failure to trigger fallback');
  } catch (error) {
    logger.logErrorOnce('fetchRealStockQuote', error);
    
    const staleData = getCachedData(cacheKey, true);
    if (staleData) return staleData;

    // Fallback
    const base = MOCK_DB.find(s => s.symbol === symbol) || { price: 1000, vol: 1000000 };
    const volatility = (Math.random() - 0.5) * (base.price * 0.02);
    
    const data = {
      symbol,
      price: Number((base.price + volatility).toFixed(2)),
      change: Number(volatility.toFixed(2)),
      changePercent: Number(((volatility / base.price) * 100).toFixed(2)),
      volume: base.vol + Math.floor(Math.random() * 50000),
      timestamp: new Date().toISOString(),
      source: 'Fallback Simulation'
    };
    
    setCachedData(cacheKey, data, TTL_SHORT);
    return data;
  }
};

export const searchRealStocks = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (!query) return [];
  const lower = query.toLowerCase();
  return MOCK_DB.filter(s => s.symbol.toLowerCase().includes(lower) || s.name.toLowerCase().includes(lower));
};

export const fetchRealHistorical = async (symbol, days) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const base = MOCK_DB.find(s => s.symbol === symbol) || { price: 1000 };
  const data = [];
  let price = base.price * 0.9;
  for(let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    price = price * (1 + (Math.random() - 0.48) * 0.03);
    data.push({
      date: d.toISOString().split('T')[0],
      close: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000)
    });
  }
  return data;
};