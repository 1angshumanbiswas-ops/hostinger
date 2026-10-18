import { getCachedData, setCachedData, TTL } from '@/lib/apiCache';

const MOCK_RATES = {
  EUR: 0.94,
  GBP: 0.82,
  JPY: 147.50,
  CAD: 1.36,
  AUD: 1.55,
};

export const fetchExchangeRates = async () => {
  const cacheKey = 'currency_rates';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // const apiKey = 'OPEN_EXCHANGE_RATES_APP_ID';
    // const url = `https://openexchangerates.org/api/latest.json?app_id=${apiKey}`;
    
    throw new Error('API Key missing');
  } catch (error) {
    const data = Object.entries(MOCK_RATES).map(([currency, rate]) => ({
      currency,
      rate,
      trend: Math.random() > 0.5 ? 0.01 : -0.01,
      updated: new Date().toISOString()
    }));
    
    setCachedData(cacheKey, data, TTL);
    return data;
  }
};