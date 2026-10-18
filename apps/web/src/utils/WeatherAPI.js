import { getCachedData, setCachedData, TTL } from '@/lib/apiCache';

const CITIES = {
  'New York': { lat: 40.7128, lon: -74.0060 },
  'Los Angeles': { lat: 34.0522, lon: -118.2437 },
  'Chicago': { lat: 41.8781, lon: -87.6298 },
  'Houston': { lat: 29.7604, lon: -95.3698 },
  'Phoenix': { lat: 33.4484, lon: -112.0740 },
};

const MOCK_WEATHER = {
  'New York': { temp: 72, humidity: 45, condition: 'Partly Cloudy', risk: 'Low' },
  'Los Angeles': { temp: 85, humidity: 30, condition: 'Sunny', risk: 'Low' },
  'Chicago': { temp: 65, humidity: 55, condition: 'Windy', risk: 'Moderate' },
  'Houston': { temp: 92, humidity: 80, condition: 'Storms', risk: 'High' },
  'Phoenix': { temp: 102, humidity: 15, condition: 'Clear', risk: 'Caution' },
};

export const fetchCityWeather = async (city) => {
  const cacheKey = `weather_${city.replace(' ', '_')}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // const apiKey = 'OPENWEATHER_API_KEY';
    // const { lat, lon } = CITIES[city];
    // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    
    throw new Error('API Key missing');
  } catch (error) {
    const mock = MOCK_WEATHER[city] || MOCK_WEATHER['New York'];
    const result = {
      ...mock,
      city,
      updated: new Date().toISOString()
    };
    setCachedData(cacheKey, result, TTL);
    return result;
  }
};

export const fetchAllWeather = async () => {
  return Promise.all(Object.keys(CITIES).map(city => fetchCityWeather(city)));
};