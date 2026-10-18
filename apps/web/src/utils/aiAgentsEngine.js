import { supabase } from '@/lib/customSupabaseClient';

// Mocked AI generation for frontend demonstration
// In a full production app with edge functions, this would call HuggingFace/OpenAI
const generateMockAnalysis = (asset, type) => {
  const isPositive = Math.random() > 0.5;
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100
  
  const templates = {
    'Market Analyzer': {
      text: isPositive ? `Bullish breakout detected for ${asset}` : `Bearish divergence on ${asset}`,
      reasoning: `Volume analysis indicates strong ${isPositive ? 'accumulation' : 'distribution'} patterns over the last 4 hours. Support/resistance levels have been breached.`,
      action: isPositive ? 'BUY' : 'SELL',
      risk: isPositive ? 'Medium' : 'High'
    },
    'Risk Manager': {
      text: `Portfolio exposure to ${asset} is within limits`,
      reasoning: `Current VaR calculations suggest standard deviation is normal. Correlation with other major holdings remains below 0.6.`,
      action: 'HOLD',
      risk: 'Low'
    },
    'Portfolio Optimizer': {
      text: `Consider rebalancing ${asset} weight`,
      reasoning: `Sharpe ratio could be improved by adjusting the allocation. Recent volatility spikes suggest taking partial profits or increasing hedge.`,
      action: isPositive ? 'INCREASE' : 'REDUCE',
      risk: 'Medium'
    },
    'News Sentiment': {
      text: isPositive ? `Positive news sentiment for ${asset}` : `Negative macroeconomic headwinds for ${asset}`,
      reasoning: `NLP analysis of recent headlines shows a dominance of ${isPositive ? 'bullish' : 'bearish'} keywords related to sector earnings and policy shifts.`,
      action: isPositive ? 'BUY' : 'SELL',
      risk: 'High'
    },
    'Technical Analysis': {
      text: `RSI and MACD alignment on ${asset}`,
      reasoning: `MACD histogram is ${isPositive ? 'expanding positively' : 'contracting negatively'} while RSI is ${isPositive ? 'bouncing from oversold' : 'rejecting overbought'} levels.`,
      action: isPositive ? 'BUY' : 'SELL',
      risk: 'Medium'
    }
  };

  const template = templates[type] || templates['Market Analyzer'];

  return {
    agentType: type,
    asset,
    insightText: template.text,
    confidenceScore: confidence,
    reasoning: template.reasoning,
    recommendedAction: template.action,
    riskLevel: template.risk,
    timestamp: new Date().toISOString()
  };
};

export const runAIAgents = async (assets = ['EURUSD', 'BTCUSD', 'CR.OIL']) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) throw new Error("User not authenticated");

    const agents = ['Market Analyzer', 'Risk Manager', 'Portfolio Optimizer', 'News Sentiment', 'Technical Analysis'];
    const insights = [];
    const signals = [];

    for (const asset of assets) {
      for (const agent of agents) {
        const insight = generateMockAnalysis(asset, agent);
        insights.push({
          user_id: userId,
          agent_type: insight.agentType,
          asset: insight.asset,
          insight_text: insight.insightText,
          confidence_score: insight.confidenceScore,
          reasoning: insight.reasoning,
          recommended_action: insight.recommendedAction,
          risk_level: insight.riskLevel
        });

        if (insight.confidenceScore > 85 && (insight.recommendedAction === 'BUY' || insight.recommendedAction === 'SELL')) {
           signals.push({
             user_id: userId,
             asset: insight.asset,
             signal_type: insight.recommendedAction,
             entry_price: 100 + Math.random() * 50, // mock price
             target_price: insight.recommendedAction === 'BUY' ? 160 : 90,
             stop_loss: insight.recommendedAction === 'BUY' ? 90 : 160,
             confidence: insight.confidenceScore
           });
        }
      }
    }

    // Store in DB
    if (insights.length > 0) {
      await supabase.from('ai_insights').insert(insights);
    }
    if (signals.length > 0) {
      await supabase.from('ai_signals').insert(signals);
    }

    return { success: true, insightsCount: insights.length, signalsCount: signals.length };
  } catch (error) {
    console.error("AI Engine Error:", error);
    return { success: false, error: error.message };
  }
};