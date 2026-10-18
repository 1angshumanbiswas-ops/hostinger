import { getCachedData, setCachedData, TTL } from '@/lib/apiCache';

// Mock data to use when API keys are missing or limits reached
const MOCK_STOCKS = {
  AAPL: { symbol: 'AAPL', price: 178.35, change: 2.45, changePercent: 1.39, updated: new Date().toISOString() },
  MSFT: { symbol: 'MSFT', price: 334.21, change: -1.20, changePercent: -0.36, updated: new Date().toISOString() },
  GOOGL: { symbol: 'GOOGL', price: 135.40, change: 1.10, changePercent: 0.82, updated: new Date().toISOString() },
  TSLA: { symbol: 'TSLA', price: 245.67, change: -5.30, changePercent: -2.11, updated: new Date().toISOString() },
  AMZN: { symbol: 'AMZN', price: 129.50, change: 0.95, changePercent: 0.74, updated: new Date().toISOString() },
};

const getMockData = (symbol) => {
  const base = MOCK_STOCKS[symbol];
  if (!base) return null;
  
  const variation = (Math.random() - 0.5) * 2;
  const newPrice = base.price + variation;
  const newChange = base.change + variation;
  const newPercent = (newChange / (newPrice - newChange)) * 100;
  
  return {
    ...base,
    price: parseFloat(newPrice.toFixed(2)),
    change: parseFloat(newChange.toFixed(2)),
    changePercent: parseFloat(newPercent.toFixed(2)),
    updated: new Date().toISOString()
  };
};

export const fetchStockPrice = async (symbol) => {
  const cacheKey = `stock_${symbol}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'DEMO';
    
    if (symbol !== 'IBM' && API_KEY === 'DEMO') {
      throw new Error('Demo key limit');
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      const result = {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        updated: new Date().toISOString()
      };
      
      setCachedData(cacheKey, result, TTL);
      return result;
    }
    
    throw new Error('No data returned');
  } catch (error) {
    const mock = getMockData(symbol);
    setCachedData(cacheKey, mock, TTL);
    return mock;
  }
};

export const fetchStockQuote = async (symbol) => {
  const cacheKey = `stock_quote_${symbol}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'DEMO';
    
    if (symbol !== 'IBM' && API_KEY === 'DEMO') {
      throw new Error('Demo key limit');
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      const result = {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        timestamp: quote['07. latest trading day'],
        volume: quote['06. volume'],
        updated: new Date().toISOString()
      };
      
      setCachedData(cacheKey, result, TTL);
      return result;
    }
    
    throw new Error('No data returned');
  } catch (error) {
    const mock = getMockData(symbol);
    setCachedData(cacheKey, mock, TTL);
    return mock;
  }
};

export const fetchCompanyOverview = async (symbol) => {
  const cacheKey = `company_overview_${symbol}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'DEMO';
    
    if (symbol !== 'IBM' && API_KEY === 'DEMO') {
      throw new Error('Demo key limit');
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data.Name) {
      const result = {
        Name: data.Name,
        Sector: data.Sector || 'Unknown',
        MarketCapitalization: data.MarketCapitalization || 'N/A',
        '52WeekHigh': parseFloat(data['52WeekHigh']) || 0,
        '52WeekLow': parseFloat(data['52WeekLow']) || 0,
        Description: data.Description || '',
        updated: new Date().toISOString()
      };
      
      setCachedData(cacheKey, result, TTL);
      return result;
    }
    
    throw new Error('No overview data returned');
  } catch (error) {
    return {
      Name: symbol,
      Sector: 'Unknown',
      MarketCapitalization: 'N/A',
      '52WeekHigh': 0,
      '52WeekLow': 0,
      Description: ''
    };
  }
};

export const fetchDailySeries = async (symbol) => {
  const cacheKey = `daily_series_${symbol}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'DEMO';
    
    if (symbol !== 'IBM' && API_KEY === 'DEMO') {
      throw new Error('Demo key limit');
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data['Time Series (Daily)']) {
      const timeSeries = data['Time Series (Daily)'];
      const result = Object.entries(timeSeries).map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      })).reverse();
      
      setCachedData(cacheKey, result, TTL);
      return result;
    }
    
    throw new Error('No time series data returned');
  } catch (error) {
    const mockSeries = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      mockSeries.push({
        date: date.toISOString().split('T')[0],
        open: 100 + Math.random() * 20,
        high: 110 + Math.random() * 20,
        low: 95 + Math.random() * 15,
        close: 100 + Math.random() * 20,
        volume: Math.floor(Math.random() * 1000000)
      });
    }
    return mockSeries;
  }
};

export const fetchStockSearch = async (query) => {
  const cacheKey = `stock_search_${query}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'DEMO';
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
    );

    const data = await response.json();

    if (data.bestMatches && Array.isArray(data.bestMatches)) {
      const result = data.bestMatches.slice(0, 10);
      setCachedData(cacheKey, result, TTL);
      return result;
    }
    
    throw new Error('No search results returned');
  } catch (error) {
    return [];
  }
};

export const fetchAllStocks = async (symbols = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN']) => {
  const promises = symbols.map(sym => fetchStockPrice(sym));
  return Promise.all(promises);
};