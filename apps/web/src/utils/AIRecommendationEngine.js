export function analyzeStockAndGenerateRecommendation(stockData, marketSentiment = 50) {
  // 1. Calculate Technical Score (0-100)
  // Based on current price position relative to 52-week high/low
  const range = stockData.week_52_high - stockData.week_52_low;
  const position = range > 0 ? (stockData.current_price - stockData.week_52_low) / range : 0.5;
  let technical_score = Math.round(position * 100);
  
  // Add momentum bonus/penalty based on recent change
  if (stockData.change_percent > 2) technical_score = Math.min(100, technical_score + 10);
  if (stockData.change_percent < -2) technical_score = Math.max(0, technical_score - 10);

  // 2. Calculate Fundamental Score (0-100)
  // Assume industry average P/E is 25. Lower is better (value), but negative is bad.
  let fundamental_score = 50;
  if (stockData.pe_ratio > 0 && stockData.pe_ratio < 15) fundamental_score = 90;
  else if (stockData.pe_ratio >= 15 && stockData.pe_ratio <= 25) fundamental_score = 70;
  else if (stockData.pe_ratio > 25 && stockData.pe_ratio <= 40) fundamental_score = 40;
  else if (stockData.pe_ratio > 40) fundamental_score = 20;

  // Add large cap safety bonus
  if (stockData.market_cap > 500000) fundamental_score = Math.min(100, fundamental_score + 10);

  // 3. Calculate Sentiment Score (0-100)
  const sentiment_score = marketSentiment;

  // 4. Overall Confidence Score
  const confidence_score = Math.round(
    (technical_score * 0.4) + 
    (fundamental_score * 0.35) + 
    (sentiment_score * 0.25)
  );

  // 5. Determine Recommendation
  let recommendation = 'Hold';
  if (confidence_score >= 70) recommendation = 'Buy';
  else if (confidence_score <= 40) recommendation = 'Sell';

  // 6. Generate Summary
  const analysis_summary = `AI Analysis indicates a ${recommendation.toUpperCase()} signal with ${confidence_score}% confidence. ` +
    `Technicals are ${technical_score > 60 ? 'strong' : technical_score < 40 ? 'weak' : 'neutral'} (${technical_score}/100) ` +
    `given the stock's position relative to its 52-week range. ` +
    `Fundamentals score ${fundamental_score}/100 driven by a P/E ratio of ${stockData.pe_ratio}. ` +
    `Overall market sentiment contributes a ${sentiment_score}/100 score.`;

  return {
    recommendation,
    confidence_score,
    technical_score,
    fundamental_score,
    sentiment_score,
    analysis_summary
  };
}