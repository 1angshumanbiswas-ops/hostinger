import { getCachedData, setCachedData } from '@/lib/apiCache';

const NDAP_TTL = 3600000; // 1 hour for economic data

export const fetchEconomicIndicators = async () => {
  const cacheKey = 'ndap_indicators';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 700));

  const data = [
    { id: 'gdp', name: 'GDP Growth Rate', value: '7.6%', trend: 'up', previousValue: '7.2%', period: 'Q3 2023-24' },
    { id: 'inflation', name: 'CPI Inflation', value: '5.1%', trend: 'down', previousValue: '5.5%', period: 'Feb 2024' },
    { id: 'interest', name: 'Repo Rate', value: '6.5%', trend: 'neutral', previousValue: '6.5%', period: 'Current' },
    { id: 'unemployment', name: 'Unemployment Rate', value: '6.8%', trend: 'down', previousValue: '7.1%', period: 'Jan 2024' },
    { id: 'iip', name: 'Index of Industrial Prod', value: '3.8%', trend: 'up', previousValue: '3.1%', period: 'Jan 2024' }
  ];

  setCachedData(cacheKey, data, NDAP_TTL);
  return data;
};

export const fetchEconomicTrends = async (indicatorId) => {
  const cacheKey = `ndap_trend_${indicatorId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock historical trend data
  const data = Array.from({ length: 12 }).map((_, i) => ({
    month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
    value: 5 + Math.random() * 3
  }));

  setCachedData(cacheKey, data, NDAP_TTL);
  return data;
};

export const getAvailableDatasets = async () => {
  return [
    { id: 'macro', name: 'Macroeconomic Indicators' },
    { id: 'employment', name: 'Employment Statistics' },
    { id: 'trade', name: 'Foreign Trade' }
  ];
};