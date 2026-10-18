export const getMockNSEStocks = () => [
  { 
    symbol: 'RELIANCE', 
    company_name: 'Reliance Industries Ltd.', 
    current_price: 2950.50, 
    change_percent: 1.25, 
    week_52_high: 3024.90, 
    week_52_low: 2220.30, 
    market_cap: 1985000, 
    pe_ratio: 28.5 
  },
  { 
    symbol: 'TCS', 
    company_name: 'Tata Consultancy Services', 
    current_price: 3890.20, 
    change_percent: -0.45, 
    week_52_high: 4254.75, 
    week_52_low: 3070.25, 
    market_cap: 1420000, 
    pe_ratio: 31.2 
  },
  { 
    symbol: 'HDFCBANK', 
    company_name: 'HDFC Bank Ltd.', 
    current_price: 1445.80, 
    change_percent: 0.85, 
    week_52_high: 1757.50, 
    week_52_low: 1363.45, 
    market_cap: 1095000, 
    pe_ratio: 16.4 
  },
  { 
    symbol: 'INFY', 
    company_name: 'Infosys Ltd.', 
    current_price: 1485.60, 
    change_percent: 2.10, 
    week_52_high: 1733.00, 
    week_52_low: 1215.45, 
    market_cap: 616000, 
    pe_ratio: 24.8 
  },
  { 
    symbol: 'ICICIBANK', 
    company_name: 'ICICI Bank Ltd.', 
    current_price: 1085.40, 
    change_percent: -1.15, 
    week_52_high: 1169.30, 
    week_52_low: 899.00, 
    market_cap: 760000, 
    pe_ratio: 18.2 
  },
  { 
    symbol: 'SBIN', 
    company_name: 'State Bank of India', 
    current_price: 765.25, 
    change_percent: 3.40, 
    week_52_high: 777.50, 
    week_52_low: 501.55, 
    market_cap: 682000, 
    pe_ratio: 10.5 
  },
  { 
    symbol: 'BHARTIARTL', 
    company_name: 'Bharti Airtel Ltd.', 
    current_price: 1195.75, 
    change_percent: -0.20, 
    week_52_high: 1245.00, 
    week_52_low: 755.40, 
    market_cap: 698000, 
    pe_ratio: 52.3 
  },
  { 
    symbol: 'ITC', 
    company_name: 'ITC Ltd.', 
    current_price: 415.30, 
    change_percent: 0.15, 
    week_52_high: 499.70, 
    week_52_low: 399.30, 
    market_cap: 518000, 
    pe_ratio: 25.1 
  }
];

export const generateMockRecommendations = (stocks) => {
  return stocks.map(stock => {
    let rec = 'HOLD';
    let conf = Math.floor(Math.random() * 20) + 50; // 50-70
    
    if (stock.change_percent > 1.5) {
      rec = 'BUY';
      conf = Math.floor(Math.random() * 20) + 75; // 75-95
    } else if (stock.change_percent < -0.5) {
      rec = 'SELL';
      conf = Math.floor(Math.random() * 20) + 75; // 75-95
    } else if (stock.change_percent > 0.5) {
      rec = 'BUY';
      conf = Math.floor(Math.random() * 15) + 60; // 60-75
    }

    return {
      stock_id: stock.id,
      recommendation: rec,
      confidence_score: conf,
      analysis_summary: `AI analysis indicates a ${rec} signal based on recent price action, volume trends, and moving averages. The stock is currently ${stock.change_percent > 0 ? 'showing bullish momentum' : 'experiencing selling pressure'}.`,
      technical_score: Math.floor(Math.random() * 40) + 50,
      fundamental_score: Math.floor(Math.random() * 30) + 60,
      sentiment_score: Math.floor(Math.random() * 50) + 40
    };
  });
};