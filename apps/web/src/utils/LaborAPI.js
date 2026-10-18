import { getCachedData, setCachedData, TTL } from '@/lib/apiCache';

const MOCK_LABOR_DATA = [
  { industry: 'Technology', employed: '5.2M', growth: 4.2, wage_growth: 3.5 },
  { industry: 'Healthcare', employed: '18.1M', growth: 2.8, wage_growth: 4.1 },
  { industry: 'Manufacturing', employed: '12.8M', growth: -0.5, wage_growth: 2.1 },
  { industry: 'Retail', employed: '15.5M', growth: 1.2, wage_growth: 2.8 },
  { industry: 'Construction', employed: '7.9M', growth: 3.1, wage_growth: 3.8 },
];

export const fetchLaborStats = async () => {
  const cacheKey = 'labor_stats';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const data = MOCK_LABOR_DATA.map(item => ({
    ...item,
    updated: new Date().toISOString()
  }));

  setCachedData(cacheKey, data, TTL);
  return data;
};