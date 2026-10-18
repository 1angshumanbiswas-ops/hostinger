export const smaCalculator = (prices, period) => {
  if (!prices || prices.length < period) return [];
  const sma = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += prices[i - j];
    }
    sma.push(Number((sum / period).toFixed(2)));
  }
  return sma;
};

export const rsiCalculator = (prices, period = 14) => {
  if (!prices || prices.length <= period) return [];
  const rsi = [];
  let gains = 0;
  let losses = 0;

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      rsi.push(null);
      continue;
    }
    
    const diff = prices[i] - prices[i - 1];
    if (i <= period) {
      if (diff > 0) gains += diff;
      else losses -= diff;
      
      if (i === period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push(Number((100 - (100 / (1 + rs))).toFixed(2)));
      } else {
        rsi.push(null);
      }
    } else {
      const avgGain = (gains * (period - 1) + (diff > 0 ? diff : 0)) / period;
      const avgLoss = (losses * (period - 1) + (diff < 0 ? -diff : 0)) / period;
      
      gains = avgGain;
      losses = avgLoss;
      
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(Number((100 - (100 / (1 + rs))).toFixed(2)));
    }
  }
  return rsi;
};

export const macdCalculator = (prices, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
  if (!prices || prices.length < longPeriod + signalPeriod) return [];
  
  const emaCalculator = (data, period) => {
    const k = 2 / (period + 1);
    const ema = [];
    let prevEma = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ema.push(null);
      } else if (i === period - 1) {
        ema.push(prevEma);
      } else {
        prevEma = (data[i] * k) + (prevEma * (1 - k));
        ema.push(prevEma);
      }
    }
    return ema;
  };

  const shortEma = emaCalculator(prices, shortPeriod);
  const longEma = emaCalculator(prices, longPeriod);
  
  const macdLine = [];
  const validMacdValues = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (shortEma[i] === null || longEma[i] === null) {
      macdLine.push(null);
    } else {
      const val = shortEma[i] - longEma[i];
      macdLine.push(val);
      validMacdValues.push(val);
    }
  }
  
  const signalEma = emaCalculator(validMacdValues, signalPeriod);
  
  const result = [];
  let signalIndex = 0;
  
  for (let i = 0; i < prices.length; i++) {
    if (macdLine[i] === null) {
      result.push({ macd: null, signal: null, histogram: null });
    } else {
      const signal = signalEma[signalIndex] !== null ? Number(signalEma[signalIndex].toFixed(3)) : null;
      const macd = Number(macdLine[i].toFixed(3));
      const histogram = signal !== null ? Number((macd - signal).toFixed(3)) : null;
      
      result.push({ macd, signal, histogram });
      signalIndex++;
    }
  }
  
  return result;
};