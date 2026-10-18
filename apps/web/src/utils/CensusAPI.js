import { getCachedData, setCachedData, TTL } from '@/lib/apiCache';

const MOCK_CENSUS_DATA = {
  demographics: [
    { region: 'Northeast', pop: '57M', income: '$78,000', growth: 0.4 },
    { region: 'Midwest', pop: '68M', income: '$69,000', growth: 0.2 },
    { region: 'South', pop: '126M', income: '$65,000', growth: 1.1 },
    { region: 'West', pop: '78M', income: '$74,000', growth: 0.9 },
  ],
  marketSize: {
    total: '$23.5T',
    target_segment: '$4.2T',
    yoy_growth: 3.2
  }
};

export const fetchCensusData = async () => {
  const cacheKey = 'census_data';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = {
    ...MOCK_CENSUS_DATA,
    updated: new Date().toISOString()
  };

  setCachedData(cacheKey, data, TTL);
  return data;
};