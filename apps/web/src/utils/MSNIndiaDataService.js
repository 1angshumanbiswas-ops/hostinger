import { fetchSENSEXData, fetchTopBSEStocks } from './FreeFinancialDataSourcesIntegration';

// Backward compatibility wrappers
export const fetchSENSEXFromMSN = async (forceRefresh = false) => {
  return await fetchSENSEXData(forceRefresh);
};

export const fetchTopStocksFromMSN = async (forceRefresh = false) => {
  return await fetchTopBSEStocks(forceRefresh);
};

export const calculateMarketSentiment = (stocks, sensex) => {
  if (!stocks || stocks.length === 0) {
    return { score: 50, label: 'Neutral', confidence: 0, gainers: 0, losers: 0 };
  }

  const gainers = stocks.filter(s => s.change >= 0).length;
  const losers = stocks.length - gainers;
  
  const advanceDeclineRatio = gainers / stocks.length; // 0 to 1
  const sensexMomentum = sensex ? (sensex.changePercent / 2) : 0; 
  
  let rawScore = (advanceDeclineRatio * 100) + (sensexMomentum * 20);
  let finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  
  let label = 'Neutral';
  if (finalScore >= 80) label = 'Strongly Bullish';
  else if (finalScore >= 60) label = 'Bullish';
  else if (finalScore <= 20) label = 'Strongly Bearish';
  else if (finalScore <= 40) label = 'Bearish';

  const confidence = Math.min(100, Math.round(70 + (stocks.length * 2)));

  return {
    score: finalScore,
    label,
    confidence,
    gainers,
    losers,
    timestamp: new Date().toISOString()
  };
};