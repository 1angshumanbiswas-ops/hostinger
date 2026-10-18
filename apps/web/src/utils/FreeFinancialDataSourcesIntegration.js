import { getCachedData, setCachedData, TTL_SHORT, TTL_LONG } from '@/lib/realDataCache';
import { logger } from './debuggingLogger';

// Master Sector to Company Mapping
export const SECTOR_MAPPING = {
  'IT': { symbols: ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM'], description: 'Information Technology', sector: 'IT' },
  'Banking': { symbols: ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK'], description: 'Banking Services', sector: 'Banking' },
  'Finance': { symbols: ['BAJAJFINSV'], description: 'Financial Services', sector: 'Finance' },
  'Energy': { symbols: ['RELIANCE', 'ONGC', 'POWERGRID'], description: 'Oil, Gas, and Power Generation', sector: 'Energy' },
  'Automobile': { symbols: ['MARUTI', 'TATAMOTORS', 'M&M', 'BAJAJ-AUTO'], description: 'Automobiles and Auto Components', sector: 'Automobile' },
  'Cement': { symbols: ['ULTRACEMCO'], description: 'Cement and Building Materials', sector: 'Cement' },
  'Chemicals': { symbols: ['GRASIM'], description: 'Chemicals and Materials', sector: 'Chemicals' },
  'Infrastructure': { symbols: ['LT'], description: 'Construction and Infrastructure', sector: 'Infrastructure' },
  'Pharma': { symbols: ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'DIVISLAB'], description: 'Pharmaceuticals and Healthcare', sector: 'Pharma' },
  'FMCG': { symbols: ['ITC', 'HUL', 'NESTLEIND', 'BRITANNIA'], description: 'Fast Moving Consumer Goods', sector: 'FMCG' },
  'Metals': { symbols: ['TATASTEEL', 'JSWSTEEL', 'HINDALCO'], description: 'Mining and Metal Production', sector: 'Metals' },
  'Utilities': { symbols: ['NTPC', 'TATAPOWER', 'ADANIGREEN'], description: 'Public Utilities and Green Energy', sector: 'Utilities' },
  'Realty': { symbols: ['DLF', 'GODREJPROP', 'MACROTECH'], description: 'Real Estate and Property Development', sector: 'Realty' },
  'Telecom': { symbols: ['BHARTIARTL', 'IDEA', 'VODAFONE'], description: 'Telecommunications Services', sector: 'Telecom' }
};

const TARGET_STOCKS = Object.values(SECTOR_MAPPING).flatMap(sector => sector.symbols);

// Helper to get sector for a symbol
const getSectorForSymbol = (symbol) => {
  for (const [sectorKey, sectorData] of Object.entries(SECTOR_MAPPING)) {
    if (sectorData.symbols.includes(symbol)) {
      return sectorData.sector;
    }
  }
  return 'General';
};

const simulateLiveDrift = (symbol) => {
  const basePrices = {
    'RELIANCE': 2950.40, 'TCS': 3920.10, 'INFY': 1610.20, 'HDFCBANK': 1450.75,
    'ICICIBANK': 1055.30, 'WIPRO': 465.90, 'BAJAJFINSV': 1580.40, 'MARUTI': 12450.00,
    'SBIN': 845.60, 'LT': 3420.50, 'ONGC': 275.40, 'POWERGRID': 285.10,
    'TATAMOTORS': 980.20, 'M&M': 1950.80, 'ULTRACEMCO': 9850.50,
    'HCLTECH': 1580.30, 'TECHM': 1320.60, 'KOTAKBANK': 1780.90,
    'SUNPHARMA': 1150.20, 'DRREDDY': 5850.40, 'CIPLA': 1240.30, 'DIVISLAB': 3650.80,
    'ITC': 450.60, 'HUL': 2540.20, 'NESTLEIND': 2450.80, 'BRITANNIA': 4850.90,
    'TATASTEEL': 140.50, 'JSWSTEEL': 820.40, 'HINDALCO': 560.30,
    'NTPC': 310.20, 'TATAPOWER': 380.50, 'ADANIGREEN': 1850.40,
    'DLF': 850.60, 'GODREJPROP': 2250.30, 'MACROTECH': 1150.80, 'BAJAJ-AUTO': 8250.40, 'GRASIM': 2150.60,
    'BHARTIARTL': 1250.30, 'IDEA': 14.50, 'VODAFONE': 12.80
  };
  const base = basePrices[symbol] || 1000;
  const change = (Math.random() - 0.48) * (base * 0.02);
  const price = base + change;
  
  return {
    symbol,
    name: symbol,
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(((change / base) * 100).toFixed(2)),
    volume: Math.floor(Math.random() * 5000000) + 500000,
    sector: getSectorForSymbol(symbol)
  };
};

export const fetchSENSEXData = async (forceRefresh = false, signal = null) => {
  const cacheKey = 'api_sensex_live_v3';
  if (!forceRefresh) {
    const cached = getCachedData(cacheKey, false);
    if (cached) return cached;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 
    if (signal) signal.addEventListener('abort', () => controller.abort());

    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/^BSESN?interval=1m', { 
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Yahoo Finance API returned status: ${res.status}`);
    
    const data = await res.json();
    if (!data?.chart?.result?.[0]?.meta) throw new Error('Invalid Yahoo Finance data structure');

    const quote = data.chart.result[0].meta;
    const result = {
      currentValue: quote.regularMarketPrice,
      change: quote.regularMarketPrice - quote.chartPreviousClose,
      changePercent: ((quote.regularMarketPrice - quote.chartPreviousClose) / quote.chartPreviousClose) * 100,
      status: 'Open',
      timestamp: new Date(quote.regularMarketTime * 1000).toISOString(),
      _source: 'Yahoo Finance'
    };
    
    setCachedData(cacheKey, result, TTL_SHORT);
    return result;
  } catch (err) {
    if (err.name === 'AbortError') throw err; 
    logger.logErrorOnce('fetchSENSEXData', err);
    
    const staleData = getCachedData(cacheKey, true);
    if (staleData) return { ...staleData, _source: 'Cached (Stale)' };

    const baseValue = 80432.50;
    const drift = (Math.random() - 0.45) * 150;
    const result = {
      currentValue: Number((baseValue + drift).toFixed(2)),
      change: Number(drift.toFixed(2)),
      changePercent: Number(((drift / baseValue) * 100).toFixed(2)),
      status: 'Open',
      timestamp: new Date().toISOString(),
      _source: 'Simulated Fallback'
    };
    setCachedData(cacheKey, result, TTL_SHORT);
    return result;
  }
};

export const fetchSENSEXHistorical = async (forceRefresh = false, signal = null) => {
  const cacheKey = 'api_sensex_history_7d_v3';
  if (!forceRefresh) {
    const cached = getCachedData(cacheKey, false);
    if (cached) return cached;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    if (signal) signal.addEventListener('abort', () => controller.abort());

    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/^BSESN?interval=1d&range=7d', { 
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Yahoo API failed: ${res.status}`);
    
    const data = await res.json();
    if (!data?.chart?.result?.[0]) throw new Error('Invalid historical data structure');

    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const closes = result.indicators?.quote?.[0]?.close || [];
    
    const history = timestamps.map((ts, i) => ({
      date: new Date(ts * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      close: Number(closes[i]?.toFixed(2))
    })).filter(item => !isNaN(item.close)).slice(-7);

    setCachedData(cacheKey, history, TTL_LONG);
    return history;
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    logger.logErrorOnce('fetchSENSEXHistorical', err);
    
    const staleData = getCachedData(cacheKey, true);
    if (staleData) return staleData;

    const data = [];
    let currentValue = 79500;
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      currentValue = currentValue * (1 + (Math.random() - 0.45) * 0.015);
      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        close: Number(currentValue.toFixed(2))
      });
    }
    setCachedData(cacheKey, data, TTL_LONG);
    return data;
  }
};

export const fetchTopBSEStocks = async (forceRefresh = false, signal = null) => {
  const cacheKey = 'api_top_stocks_bse_v5'; // version bump to include sector data
  if (!forceRefresh) {
    const cached = getCachedData(cacheKey, false);
    if (cached) return cached;
  }

  const finnhubKey = import.meta.env.VITE_FINNHUB_API_KEY;
  
  if (!finnhubKey) {
    logger.logWarnOnce('fetchTopBSEStocks', 'Finnhub API key missing. Falling back to simulated constituent data.');
    const stocks = TARGET_STOCKS.map(simulateLiveDrift);
    setCachedData(cacheKey, stocks, 300000); // 5 min TTL
    return stocks;
  }

  try {
    // Fetch a subset to avoid rate limits, simulate the rest for completeness
    const primarySymbols = TARGET_STOCKS.slice(0, 10); 
    const requests = primarySymbols.map(symbol => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); 
      if (signal) signal.addEventListener('abort', () => controller.abort());

      return fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}.BO&token=${finnhubKey}`, { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      })
      .then(res => {
        clearTimeout(timeoutId);
        if (res.status === 429) throw new Error('Rate limit exceeded');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json().then(data => ({ symbol, data }));
      });
    });

    const responses = await Promise.allSettled(requests);
    
    const allFailed = responses.length > 0 && responses.every(r => r.status === 'rejected');
    if (allFailed) {
      throw new Error(responses[0].reason?.message || 'All stock requests failed');
    }
    
    const stocks = TARGET_STOCKS.map((symbol) => {
      const primaryIdx = primarySymbols.indexOf(symbol);
      if (primaryIdx !== -1) {
        const res = responses[primaryIdx];
        if (res.status === 'fulfilled' && res.value?.data?.c) {
          const d = res.value.data;
          return {
            symbol,
            name: symbol,
            price: d.c,
            change: d.d,
            changePercent: d.dp,
            volume: Math.floor(Math.random() * 5000000) + 100000,
            sector: getSectorForSymbol(symbol)
          };
        }
      }
      return simulateLiveDrift(symbol);
    });

    setCachedData(cacheKey, stocks, 300000); // 5 minute TTL for stock constituents
    return stocks;
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    logger.logErrorOnce('fetchTopBSEStocks', err);
    
    const staleData = getCachedData(cacheKey, true);
    if (staleData) return staleData;

    const stocks = TARGET_STOCKS.map(simulateLiveDrift);
    setCachedData(cacheKey, stocks, 300000);
    return stocks;
  }
};

export const fetchAllMarketData = async (forceRefresh = false, signal = null) => {
  const [sensex, history, stocks] = await Promise.all([
    fetchSENSEXData(forceRefresh, signal),
    fetchSENSEXHistorical(forceRefresh, signal),
    fetchTopBSEStocks(forceRefresh, signal)
  ]);
  return { sensex, history, stocks };
};