import React from 'react';
import { useTradeManagement } from '@/hooks/useTradeManagement';
import { usePortfolioMetrics } from '@/hooks/usePortfolioMetrics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Wallet, TrendingUp } from 'lucide-react';
import PortfolioCharts from './PortfolioCharts';
import PortfolioMetrics from './PortfolioMetrics';
import { format } from 'date-fns';

const PortfolioPage = () => {
  const { trades, loading, closeTrade } = useTradeManagement();
  const metrics = usePortfolioMetrics(trades);

  const openTrades = trades.filter(t => t.status === 'OPEN');
  const closedTrades = trades.filter(t => t.status === 'CLOSED');

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading portfolio data...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-[#FFF8E7] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-950 flex items-center gap-2">
          <PieChart className="w-8 h-8 text-orange-600" />
          Portfolio Overview
        </h1>
        <p className="text-orange-900/60 mt-1">Comprehensive analysis of your trading performance</p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-white border-none shadow-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Balance</p>
            <h2 className="text-3xl font-black text-slate-800">${metrics.balance.toFixed(2)}</h2>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-md overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <PieChart className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Equity</p>
            <h2 className="text-3xl font-black text-slate-800">${metrics.equity.toFixed(2)}</h2>
          </CardContent>
        </Card>

        <Card className={`border-none shadow-md overflow-hidden relative ${metrics.totalPnL >= 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/20 rounded-xl text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium">Total P&L</p>
            <h2 className="text-3xl font-black">${metrics.totalPnL >= 0 ? '+' : ''}{metrics.totalPnL.toFixed(2)}</h2>
          </CardContent>
        </Card>
      </div>

      <PortfolioMetrics metrics={metrics} />
      
      <div className="mt-8">
        <PortfolioCharts pieData={metrics.pieData} barData={metrics.barData} />
      </div>

      <div className="mt-8 space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Asset</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Entry/Current</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Margin Used</th>
                    <th className="px-4 py-3">Current P&L</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {openTrades.map(trade => {
                    const margin = ((Number(trade.entry_price) * Number(trade.size) * 100000) / Number(trade.leverage)).toFixed(2);
                    const pnlPercent = ((trade.pnl / margin) * 100).toFixed(2);
                    return (
                      <tr key={trade.id} className="border-b border-slate-50">
                        <td className="px-4 py-3 font-bold">{trade.asset}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={trade.type === 'BUY' ? 'text-emerald-600' : 'text-red-600'}>
                            {trade.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                           <div>{Number(trade.entry_price).toFixed(5)}</div>
                           <div className="text-xs text-slate-400">{Number(trade.current_price).toFixed(5)}</div>
                        </td>
                        <td className="px-4 py-3">{trade.size}</td>
                        <td className="px-4 py-3">${margin}</td>
                        <td className={`px-4 py-3 font-bold ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          ${trade.pnl >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(2)} ({pnlPercent}%)
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="outline" onClick={() => closeTrade(trade.id)} className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">Close Position</Button>
                        </td>
                      </tr>
                    );
                  })}
                  {openTrades.length === 0 && <tr><td colSpan="7" className="p-4 text-center text-slate-400">No open positions.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Closed Trades Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Asset</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Entry/Exit</th>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Close Date</th>
                    <th className="px-4 py-3 text-right">Final P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {closedTrades.slice(0, 5).map(trade => (
                    <tr key={trade.id} className="border-b border-slate-50">
                      <td className="px-4 py-3 font-bold">{trade.asset}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={trade.type === 'BUY' ? 'text-emerald-600' : 'text-red-600'}>
                          {trade.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                         <div>{Number(trade.entry_price).toFixed(5)}</div>
                         <div className="text-xs text-slate-400">{Number(trade.current_price).toFixed(5)}</div>
                      </td>
                      <td className="px-4 py-3">{trade.size}</td>
                      <td className="px-4 py-3 text-slate-500">{format(new Date(trade.updated_at), 'MMM dd, HH:mm')}</td>
                      <td className={`px-4 py-3 text-right font-bold ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        ${trade.pnl >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {closedTrades.length > 5 && (
                    <tr><td colSpan="6" className="p-3 text-center text-slate-500 text-xs bg-slate-50">Showing 5 most recent closed trades. View Order History for full list.</td></tr>
                  )}
                  {closedTrades.length === 0 && <tr><td colSpan="6" className="p-4 text-center text-slate-400">No closed trades yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default PortfolioPage;