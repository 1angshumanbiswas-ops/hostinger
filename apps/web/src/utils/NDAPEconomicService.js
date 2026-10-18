export const getEconomicIndicators = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    { name: 'GDP Growth', value: '7.2%', trend: 'up' },
    { name: 'CPI Inflation', value: '5.1%', trend: 'down' },
    { name: 'Repo Rate', value: '6.5%', trend: 'neutral' },
    { name: 'Unemployment', value: '6.8%', trend: 'down' }
  ];
};

export const getMarketSentiment = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    score: 68,
    label: 'Bullish',
    indicators: {
      retailParticipation: 'High',
      fiiFlows: 'Positive',
      diiFlows: 'Positive'
    }
  };
};