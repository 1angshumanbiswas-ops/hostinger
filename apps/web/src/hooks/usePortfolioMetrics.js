import { useMemo } from 'react';

export const usePortfolioMetrics = (trades) => {
  return useMemo(() => {
    const initialBalance = 10000; // Mock initial balance
    let realizedPnL = 0;
    let unrealizedPnL = 0;
    let wins = 0;
    let losses = 0;
    let maxWin = 0;
    let maxLoss = 0;
    let totalWinAmt = 0;
    let totalLossAmt = 0;
    let marginUsed = 0;
    let maxLeverage = 0;

    trades.forEach(t => {
      const pnl = Number(t.pnl) || 0;
      
      if (t.status === 'CLOSED') {
        realizedPnL += pnl;
        if (pnl > 0) {
          wins++;
          totalWinAmt += pnl;
          maxWin = Math.max(maxWin, pnl);
        } else if (pnl < 0) {
          losses++;
          totalLossAmt += Math.abs(pnl);
          maxLoss = Math.min(maxLoss, pnl);
        }
      } else if (t.status === 'OPEN') {
        unrealizedPnL += pnl;
        const margin = ((Number(t.entry_price) * Number(t.size) * 100000) / Number(t.leverage));
        marginUsed += margin;
        maxLeverage = Math.max(maxLeverage, Number(t.leverage));
      }
    });

    const totalPnL = realizedPnL + unrealizedPnL;
    const balance = initialBalance + realizedPnL;
    const equity = balance + unrealizedPnL;
    const availableMargin = equity - marginUsed;
    const marginUtilization = equity > 0 ? (marginUsed / equity) * 100 : 0;
    const totalTrades = wins + losses;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const avgWin = wins > 0 ? totalWinAmt / wins : 0;
    const avgLoss = losses > 0 ? totalLossAmt / losses : 0;
    const profitFactor = totalLossAmt > 0 ? totalWinAmt / totalLossAmt : (totalWinAmt > 0 ? 999 : 0);

    // Asset allocation (based on active margin)
    const assetAllocation = trades.filter(t => t.status === 'OPEN').reduce((acc, t) => {
      acc[t.asset] = (acc[t.asset] || 0) + ((Number(t.entry_price) * Number(t.size) * 100000) / Number(t.leverage));
      return acc;
    }, {});

    const pieData = Object.keys(assetAllocation).map(key => ({
      name: key,
      value: assetAllocation[key]
    }));

    // Asset PnL
    const assetPnL = trades.reduce((acc, t) => {
      acc[t.asset] = (acc[t.asset] || 0) + Number(t.pnl || 0);
      return acc;
    }, {});
    
    const barData = Object.keys(assetPnL).map(key => ({
      name: key,
      pnl: assetPnL[key]
    }));

    return {
      balance,
      equity,
      totalPnL,
      realizedPnL,
      unrealizedPnL,
      winRate,
      totalTrades,
      bestTrade: maxWin,
      worstTrade: maxLoss,
      avgWin,
      avgLoss,
      profitFactor,
      marginUsed,
      availableMargin,
      marginUtilization,
      maxLeverage,
      drawdown: 0, // Mocked for simplicity
      pieData,
      barData
    };
  }, [trades]);
};