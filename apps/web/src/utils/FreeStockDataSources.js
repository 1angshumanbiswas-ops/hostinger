import * as IndianAPI from './IndianStockMarketAPIService';
import * as YahooAPI from './YahooFinanceService';
import * as BSEAPI from './BSEIndiaService';
import * as NDAPAPI from './NDAPEconomicService';
import * as GoogleAPI from './GoogleFinanceService';

const STOCKS_DB = [
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank' },
  { symbol: 'INFY', name: 'Infosys' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
  { symbol: 'ITC', name: 'ITC Limited' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank' },
  { symbol: 'LT', name: 'Larsen & Toubro' },
];

export const fetchBSEStockPrice = async (symbol) => {
  try {
    return await IndianAPI.getStockQuote(symbol);
  } catch (err) {
    try {
      return await YahooAPI.getStockData(symbol);
    } catch (e) {
      return await GoogleAPI.getStockInfo(symbol);
    }
  }
};

export const fetchSENSEXData = async () => {
  return await BSEAPI.getSENSEXData();
};

export const fetchTopGainersLosers = async () => {
  return await BSEAPI.getTopMovers();
};

export const fetchSectorData = async () => {
  return await BSEAPI.getSectorPerformance();
};

export const searchBSEStocks = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (!query) return [];
  const lower = query.toLowerCase();
  return STOCKS_DB.filter(s => 
    s.symbol.toLowerCase().includes(lower) || 
    s.name.toLowerCase().includes(lower)
  );
};

export const fetchEconomicData = async () => {
  return {
    indicators: await NDAPAPI.getEconomicIndicators(),
    sentiment: await NDAPAPI.getMarketSentiment()
  };
};

export const fetchAllSourcesComparison = async (symbol) => {
  const [ind, yf, gf] = await Promise.all([
    IndianAPI.getStockQuote(symbol),
    YahooAPI.getStockData(symbol),
    GoogleAPI.getStockInfo(symbol)
  ]);
  return [ind, yf, gf];
};