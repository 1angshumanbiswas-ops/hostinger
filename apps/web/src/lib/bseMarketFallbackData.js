export const getFallbackSENSEX = () => {
  const time = new Date().toISOString();
  const baseValue = 74300;
  return {
    indexName: 'S&P BSE SENSEX',
    currentValue: baseValue + 150.45,
    change: 150.45,
    changePercent: (150.45 / baseValue) * 100,
    history: Array.from({ length: 20 }).map((_, i) => ({
      time: `${9 + Math.floor(i / 3)}:${(i % 3) * 20 || '00'}`,
      value: baseValue + (Math.random() - 0.5) * 300
    })),
    timestamp: time,
    source: 'Fallback Market Data',
    marketStatus: 'Open'
  };
};

export const getFallbackStocks = () => {
  const time = new Date().toISOString();
  return [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.50, change: 15.20, changePercent: 0.52, volume: 4500000, timestamp: time },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3980.00, change: -12.40, changePercent: -0.31, volume: 2100000, timestamp: time },
    { symbol: 'INFY', name: 'Infosys', price: 1620.25, change: 5.75, changePercent: 0.36, volume: 3200000, timestamp: time },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1530.80, change: 22.10, changePercent: 1.46, volume: 8500000, timestamp: time },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1120.40, change: 8.90, changePercent: 0.80, volume: 6400000, timestamp: time },
    { symbol: 'LT', name: 'Larsen & Toubro', price: 3640.10, change: 45.60, changePercent: 1.27, volume: 1800000, timestamp: time },
    { symbol: 'WIPRO', name: 'Wipro', price: 510.30, change: -2.10, changePercent: -0.41, volume: 2900000, timestamp: time },
    { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 12450.00, change: -150.00, changePercent: -1.19, volume: 450000, timestamp: time },
  ];
};