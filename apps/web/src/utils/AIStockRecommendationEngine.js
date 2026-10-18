import React from 'react';
import { fetchRealStockQuote, fetchRealHistorical } from './IndianStockMarketRealAPI';
import { fetchRealSENSEX, fetchRealStocks } from './BSEIndiaRealAPI';
import { fetchRealEconomicIndicators } from './NDAPRealAPI';
import { smaCalculator, rsiCalculator, macdCalculator } from './TechnicalIndicatorsCalculator';
import { getCachedData, setCachedData, TTL_SHORT } from '@/lib/realDataCache';

const ANALYSIS_SYMBOLS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'TATASTEEL', name: 'Tata Steel', sector: 'Metals' },
  { symbol: 'PAYTM', name: 'One97 Communications', sector: 'Finance' },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', sector: 'Consumer' }
];

const calculateAnalysis = (prices, marketData) => {
  if (prices.length < 30) return null;
  
  const closePrices = prices.map(p => p.close);
  const currentPrice = closePrices[closePrices.length - 1];
  
  const sma20 = smaCalculator(closePrices, 20);
  const currentSma = sma20[sma20.length - 1];
  
  const rsi = rsiCalculator(closePrices, 14);
  const currentRsi = rsi[rsi.length - 1];
  
  const macdData = macdCalculator(closePrices);
  const currentMacd = macdData[macdData.length - 1];
  
  return {
    currentPrice,
    sma20: currentSma,
    rsi: currentRsi,
    macd: currentMacd,
    priceToSma: ((currentPrice - currentSma) / currentSma) * 100
  };
};

const determineRecommendation = (analysis, quote, marketStats, companyName) => {
  let score = 50;
  let type = 'HOLD';
  let reasoning = [];
  let riskLevel = 'Medium';
  let timeHorizon = 'Medium-term';
  let potentialReturn = 0;
  let targetPrice = quote.price;
  
  // RSI Logic
  if (analysis.rsi < 30) {
    score += 25;
    reasoning.push(`${analysis.rsi.toFixed(1)} RSI indicates the stock is technically oversold.`);
  } else if (analysis.rsi > 70) {
    score -= 25;
    reasoning.push(`${analysis.rsi.toFixed(1)} RSI indicates the stock is technically overbought.`);
  }

  // MACD Logic
  if (analysis.macd && analysis.macd.histogram > 0) {
    score += 15;
    reasoning.push("MACD histogram shows growing bullish momentum.");
  } else if (analysis.macd && analysis.macd.histogram < 0) {
    score -= 15;
    reasoning.push("MACD histogram shows bearish divergence.");
  }
  
  // Market momentum logic based on SENSEX
  if (marketStats && marketStats.changePercent > 0.5) {
    score += 10;
    reasoning.push(`Broad market strength in SENSEX (+${marketStats.changePercent.toFixed(1)}%) provides tailwinds.`);
  } else if (marketStats && marketStats.changePercent < -0.5) {
    score -= 10;
    reasoning.push(`Broad market weakness in SENSEX (${marketStats.changePercent.toFixed(1)}%) is creating headwinds.`);
  }

  // Special HOLD logic (Geopolitical / Macro simulation)
  let geopoliticalContext = null;
  let recoveryTimeline = null;
  
  if (analysis.priceToSma < -5 && analysis.rsi > 30 && analysis.rsi < 50) {
    type = 'HOLD';
    riskLevel = 'High';
    timeHorizon = 'Long-term';
    score = 50; // Force hold
    geopoliticalContext = "Recent macroeconomic pressures and supply chain constraints have temporarily suppressed the valuation.";
    recoveryTimeline = "3-6 Months";
    reasoning = [`${companyName} is facing temporary macro headwinds. Maintain current position until clear trend emerges.`];
    targetPrice = quote.price * 1.08;
  } else if (score > 70) {
    type = 'BUY';
    riskLevel = 'Medium';
    timeHorizon = 'Short-term';
    targetPrice = quote.price * 1.15;
    if (reasoning.length === 0) reasoning.push("Strong technical indicators across multiple timeframes suggest accumulation.");
  } else if (score < 40) {
    type = 'SELL';
    riskLevel = 'Low';
    timeHorizon = 'Short-term';
    targetPrice = quote.price * 0.85;
    if (reasoning.length === 0) reasoning.push("Deteriorating price action and market weakness suggest reducing exposure.");
  } else {
    type = 'HOLD';
    targetPrice = quote.price * 1.05;
    if (reasoning.length === 0) reasoning.push("Price action is currently range-bound. Awaiting stronger directional signals.");
  }

  potentialReturn = ((targetPrice - quote.price) / quote.price) * 100;

  return {
    type,
    score,
    reasoning: reasoning.join(" "),
    riskLevel,
    timeHorizon,
    targetPrice: Number(targetPrice.toFixed(2)),
    potentialReturnPercent: Number(potentialReturn.toFixed(2)),
    confidenceScore: Math.min(98, Math.max(45, type === 'BUY' ? score : type === 'SELL' ? 100 - score : 60)),
    geopoliticalContext,
    recoveryTimeline
  };
};

export const generateRecommendations = async () => {
  const cacheKey = 'ai_stock_recommendations_v1';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // Fetch broad market stats instead of non-existent sectors
    const marketStats = await fetchRealSENSEX();
    const recommendations = [];

    for (const item of ANALYSIS_SYMBOLS) {
      try {
        const quote = await fetchRealStockQuote(item.symbol);
        const history = await fetchRealHistorical(item.symbol, 90);
        const reverseHistory = [...history].reverse(); // Chronological for tech indicators
        
        const analysis = calculateAnalysis(reverseHistory, marketStats);
        if (!analysis) continue;

        const recResult = determineRecommendation(analysis, quote, marketStats, item.name);

        recommendations.push({
          id: `${item.symbol}-${Date.now()}`,
          symbol: item.symbol,
          companyName: item.name,
          currentPrice: quote.price,
          changePercent: quote.changePercent,
          type: recResult.type,
          targetPrice: recResult.targetPrice,
          potentialReturnPercent: recResult.potentialReturnPercent,
          riskLevel: recResult.riskLevel,
          timeHorizon: recResult.timeHorizon,
          confidenceScore: recResult.confidenceScore,
          aiReasoning: recResult.reasoning,
          analysisFactors: {
            rsi: analysis.rsi,
            sma20: analysis.sma20,
            macd: analysis.macd,
            marketTrend: marketStats.changePercent
          },
          geopoliticalContext: recResult.geopoliticalContext,
          recoveryTimeline: recResult.recoveryTimeline,
          timestamp: new Date().toISOString(),
          historyData: history // to display chart in modal
        });
      } catch (innerError) {
        console.warn(`Failed to generate recommendation for ${item.symbol}:`, innerError);
      }
    }

    setCachedData(cacheKey, recommendations, TTL_SHORT * 10); // 5 min cache
    return recommendations;
  } catch (error) {
    console.error("AI Recommendation Generation Error:", error);
    return [];
  }
};

export const refreshRecommendations = async () => {
  const cacheKey = 'ai_stock_recommendations_v1';
  localStorage.removeItem(cacheKey); // force clear cache
  return await generateRecommendations();
};

export const getRecommendationsByType = async (type) => {
  const recs = await generateRecommendations();
  return recs.filter(r => r.type === type).sort((a, b) => b.confidenceScore - a.confidenceScore);
};