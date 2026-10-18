export const getMockSENSEXData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        currentValue: 79845.20,
        change: 145.60,
        changePercent: 0.18,
        status: 'Open',
        timestamp: new Date().toISOString(),
        _source: 'Mock Data'
      });
    }, 500);
  });
};

export const getMockTopStocks = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { symbol: 'RELIANCE', name: 'RELIANCE', price: 2950.40, change: 15.2, changePercent: 0.52, volume: 5400000, sector: 'Energy' },
        { symbol: 'TCS', name: 'TCS', price: 3920.10, change: -12.5, changePercent: -0.32, volume: 2100000, sector: 'IT' },
        { symbol: 'HDFCBANK', name: 'HDFCBANK', price: 1450.75, change: 8.4, changePercent: 0.58, volume: 8900000, sector: 'Banking' },
        { symbol: 'INFY', name: 'INFY', price: 1610.20, change: 22.1, changePercent: 1.39, volume: 3400000, sector: 'IT' },
        { symbol: 'ICICIBANK', name: 'ICICIBANK', price: 1055.30, change: 5.5, changePercent: 0.52, volume: 6700000, sector: 'Banking' },
        { symbol: 'WIPRO', name: 'WIPRO', price: 465.90, change: 3.2, changePercent: 0.69, volume: 1800000, sector: 'IT' },
        { symbol: 'HCLTECH', name: 'HCLTECH', price: 1580.30, change: 18.5, changePercent: 1.18, volume: 1600000, sector: 'IT' },
        { symbol: 'TECHM', name: 'TECHM', price: 1320.60, change: 12.8, changePercent: 0.98, volume: 1200000, sector: 'IT' }
      ]);
    }, 500);
  });
};

export const getMockSectorPerformance = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { sectorName: 'Banking', changePercent: 0.55, status: 'positive' },
        { sectorName: 'IT', changePercent: 1.12, status: 'positive' },
        { sectorName: 'Energy', changePercent: 0.52, status: 'positive' },
        { sectorName: 'Automobile', changePercent: 2.1, status: 'positive' },
        { sectorName: 'Pharma', changePercent: -0.2, status: 'negative' },
        { sectorName: 'FMCG', changePercent: 0.8, status: 'positive' },
        { sectorName: 'Metals', changePercent: -0.5, status: 'negative' },
        { sectorName: 'Realty', changePercent: 1.5, status: 'positive' },
        { sectorName: 'Telecom', changePercent: 0.3, status: 'positive' },
        { sectorName: 'Utilities', changePercent: 0.1, status: 'neutral' },
        { sectorName: 'Cement', changePercent: 0.6, status: 'positive' },
        { sectorName: 'Chemicals', changePercent: 0.4, status: 'positive' },
        { sectorName: 'Textiles', changePercent: 0, status: 'neutral' }
      ]);
    }, 500);
  });
};

export const getMockMarketSentiment = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bullishRatio: 65,
        neutralRatio: 20,
        bearishRatio: 15
      });
    }, 500);
  });
};