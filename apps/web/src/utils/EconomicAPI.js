import { getCachedData, setCachedData, TTL } from '@/lib/apiCache';

const MOCK_ECONOMICS = {
  UNRATE: { title: 'Unemployment Rate', value: 3.8, unit: '%', trend: -0.1, updated: new Date().toISOString() },
  CPIAUCSL: { title: 'Inflation (CPI)', value: 3.2, unit: '%', trend: 0.1, updated: new Date().toISOString() },
  GDP: { title: 'GDP Growth', value: 2.1, unit: '%', trend: 0.4, updated: new Date().toISOString() },
  DFF: { title: 'Fed Interest Rate', value: 5.33, unit: '%', trend: 0.0, updated: new Date().toISOString() },
};

export const fetchEconomicIndicator = async (seriesId) => {
  const cacheKey = `econ_${seriesId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const API_KEY = 'DEMO_KEY'; // Placeholder
    // const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json`;
    
    throw new Error('API Key missing'); 

  } catch (error) {
    let mockKey = seriesId;
    if (seriesId === 'A191RL1Q225SBEA') mockKey = 'GDP';
    
    const data = MOCK_ECONOMICS[mockKey] || MOCK_ECONOMICS.UNRATE;
    setCachedData(cacheKey, data, TTL);
    return data;
  }
};

export const fetchAllEconomics = async () => {
  const indicators = [
    'UNRATE', 
    'CPIAUCSL', 
    'A191RL1Q225SBEA', // GDP
    'DFF' // Fed Funds Rate
  ];
  
  const results = await Promise.all(indicators.map(id => fetchEconomicIndicator(id)));
  return results;
};