import { getCachedData, setCachedData, TTL } from '@/lib/apiCache';

// Mocking BSE India Official Data
const generateHistoricalData = (baseValue, days) => {
  const data = [];
  let current = baseValue;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    current = current * (1 + (Math.random() - 0.48) * 0.015); // Slight upward bias
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(current.toFixed(2))
    });
  }
  return data;
};

export const fetchSENSEXData = async () => {
  const cacheKey = 'bse_sensex_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 600));

  const baseValue = 73500;
  const history = generateHistoricalData(baseValue, 30);
  const current = history[history.length - 1].value;
  const previous = history[history.length - 2].value;
  const change = current - previous;
  const changePercent = (change / previous) * 100;

  const data = {
    indexName: 'S&P BSE SENSEX',
    currentValue: current,
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    history,
    timestamp: new Date().toISOString()
  };

  setCachedData(cacheKey, data, TTL);
  return data;
};

export const fetchTopStocksByMarketCap = async () => {
  const cacheKey = 'bse_top_stocks';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 400));

  const data = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', mcap: '19.5T', price: 2950, change: 1.2 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', mcap: '14.2T', price: 3820, change: -0.5 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', mcap: '11.1T', price: 1465, change: 0.8 },
    { symbol: 'INFY', name: 'Infosys', mcap: '6.5T', price: 1610, change: 2.1 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', mcap: '7.3T', price: 1055, change: 1.5 },
    { symbol: 'SBIN', name: 'State Bank of India', mcap: '6.7T', price: 760, change: -1.1 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', mcap: '6.2T', price: 1120, change: 0.4 },
    { symbol: 'ITC', name: 'ITC Limited', mcap: '5.2T', price: 425, change: -0.2 },
    { symbol: 'HUL', name: 'Hindustan Unilever', mcap: '5.0T', price: 2350, change: 0.1 },
    { symbol: 'L&T', name: 'Larsen & Toubro', mcap: '4.8T', price: 3400, change: 1.8 }
  ];

  setCachedData(cacheKey, data, TTL);
  return data;
};

export const fetchSectorPerformance = async () => {
  const cacheKey = 'bse_sectors';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 500));

  const data = [
    { name: 'IT', change: 2.4, value: 35000 },
    { name: 'Banking', change: 1.2, value: 48000 },
    { name: 'Pharma', change: -0.8, value: 16500 },
    { name: 'Auto', change: 1.5, value: 32000 },
    { name: 'FMCG', change: -0.2, value: 19000 },
    { name: 'Metals', change: 3.1, value: 24000 },
    { name: 'Energy', change: 0.5, value: 12000 },
    { name: 'Realty', change: -1.5, value: 8000 }
  ];

  setCachedData(cacheKey, data, TTL);
  return data;
};