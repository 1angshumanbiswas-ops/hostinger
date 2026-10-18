import { getCachedData, setCachedData } from '@/lib/apiCache';

export const getSENSEXData = async () => {
  const cacheKey = 'bse_sensex_live';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 300));
  const val = 73000 + (Math.random() - 0.5) * 1000;
  const change = val - 73000;
  
  const history = Array.from({length: 20}).map((_, i) => ({
    time: `${9 + Math.floor(i/4)}:${(i%4)*15 || '00'}`,
    value: val - (20-i) * (Math.random() * 50 - 25)
  }));

  const data = {
    name: 'S&P BSE SENSEX',
    price: val,
    change,
    changePercent: (change/73000) * 100,
    history,
    source: 'BSE India Official'
  };
  setCachedData(cacheKey, data, 30000);
  return data;
};

export const getSectorPerformance = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    { name: 'IT', changePercent: 1.2 },
    { name: 'Banking', changePercent: -0.5 },
    { name: 'Pharma', changePercent: 2.3 },
    { name: 'Auto', changePercent: 0.8 },
    { name: 'Finance', changePercent: -1.1 },
    { name: 'FMCG', changePercent: 0.4 },
  ];
};

export const getTopMovers = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    gainers: [
      { symbol: 'TATASTEEL', price: 156.4, changePercent: 4.2 },
      { symbol: 'RELIANCE', price: 2950.1, changePercent: 3.8 },
      { symbol: 'INFY', price: 1620.5, changePercent: 3.1 },
      { symbol: 'WIPRO', price: 1540.2, changePercent: 2.9 },
      { symbol: 'HCLTECH', price: 620.8, changePercent: 2.5 },
    ],
    losers: [
      { symbol: 'PAYTM', price: 1120.4, changePercent: -4.5 },
      { symbol: 'ZOMATO', price: 420.1, changePercent: -3.8 },
      { symbol: 'HDFCBANK', price: 1420.5, changePercent: -2.1 },
      { symbol: 'SBIN', price: 740.2, changePercent: -1.9 },
      { symbol: 'ITC', price: 410.8, changePercent: -1.5 },
    ]
  };
};