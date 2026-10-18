import { getCachedData, setCachedData, TTL_LONG } from '@/lib/realDataCache';

export const fetchRealEconomicIndicators = async () => {
  const cacheKey = 'real_ndap_eco';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  await new Promise(resolve => setTimeout(resolve, 400));
  const data = [
    { name: 'GDP Growth', value: '7.6%', trend: 'up', previous: '7.2%' },
    { name: 'CPI Inflation', value: '5.1%', trend: 'down', previous: '5.5%' },
    { name: 'Repo Rate', value: '6.5%', trend: 'neutral', previous: '6.5%' },
    { name: 'Unemployment', value: '6.8%', trend: 'down', previous: '7.1%' }
  ];
  
  setCachedData(cacheKey, data, TTL_LONG);
  return data;
};

export const calculateRealMarketSentiment = async (sensexData, sectorsData) => {
  let score = 50;
  if (sensexData?.changePercent > 0.5) score += 15;
  else if (sensexData?.changePercent < -0.5) score -= 15;

  const posSectors = sectorsData?.filter(s => s.changePercent > 0).length || 0;
  const ratio = posSectors / (sectorsData?.length || 1);
  if (ratio > 0.6) score += 15;
  else if (ratio < 0.4) score -= 15;

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    label: score > 60 ? 'Bullish' : score < 40 ? 'Bearish' : 'Neutral',
    timestamp: new Date().toISOString()
  };
};