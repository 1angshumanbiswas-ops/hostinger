import React, { useState } from 'react';
import { useTradeManagement } from '@/hooks/useTradeManagement';
import { usePortfolioMetrics } from '@/hooks/usePortfolioMetrics';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Search, History, Activity, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const OrderHistoryPage = () => {
  const { trades, loading } = useTradeManagement();
  const metrics = usePortfolioMetrics(trades);
  
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState('10');

  const filteredTrades = trades.filter(t => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (searchTerm && !t.asset.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredTrades.length / Number(perPage));
  const paginatedTrades = filteredTrades.slice((page - 1) * Number(perPage), page * Number(perPage));

  const exportCSV = () => {
    const headers = ['Order ID', 'Asset', 'Type', 'Entry Price', 'Exit Price', 'Size', 'Status', 'P&L', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredTrades.map(t => [
        t.id, t.asset, t.type, t.entry_price, t.current_price, t.size, t.status, t.pnl, t.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `order_history_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-[#FFF8E7] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-orange-950 flex items-center gap-2">
            <History className="w-8 h-8 text-orange-600" />
            Order History
          </h1>
          <p className="text-orange-900/60 mt-1">View and export your complete trading history</p>
        </div>
        <Button onClick={exportCSV} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border-orange-100">
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
            <div><p className="text-xs text-slate-500">Total Trades</p><p className="font-bold">{metrics.totalTrades}</p></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-orange-100">
          <CardContent className="p-4 flex items-center gap-3">
            <Target className="w-8 h-8 text-emerald-500 bg-emerald-50 p-1.5 rounded-lg" />
            <div><p className="text-xs text-slate-500">Win Rate</p><p className="font-bold">{metrics.winRate.toFixed(1)}%</p></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-orange-100">
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-500 bg-indigo-50 p-1.5 rounded-lg" />
            <div><p className="text-xs text-slate-500">Total P&L</p><p className={`font-bold ${metrics.totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>${metrics.totalPnL.toFixed(2)}</p></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-orange-100">
          <CardContent className="p-4 flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-500 bg-purple-50 p-1.5 rounded-lg" />
            <div><p className="text-xs text-slate-500">Avg Win/Loss</p><p className="font-bold">${metrics.avgWin.toFixed(0)} / ${metrics.avgLoss.toFixed(0)}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-orange-100">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center bg-white/50">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search asset..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-9 bg-white"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-orange-100">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Asset</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Entry Price</th>
                  <th className="px-4 py-3 font-medium">Exit Price</th>
                  <th className="px-4 py-3 font-medium">P&L</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" className="text-center py-8">Loading...</td></tr>
                ) : paginatedTrades.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-8 text-slate-400">No trades found.</td></tr>
                ) : paginatedTrades.map(trade => (
                  <tr key={trade.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-500">{format(new Date(trade.created_at), 'MMM dd, HH:mm')}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">{trade.id.split('-')[0]}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{trade.asset}</td>
                    <td className="px-4 py-3">
                      <span className={trade.type === 'BUY' ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{trade.size}</td>
                    <td className="px-4 py-3">{Number(trade.entry_price).toFixed(5)}</td>
                    <td className="px-4 py-3">{trade.status === 'CLOSED' ? Number(trade.current_price).toFixed(5) : '-'}</td>
                    <td className={`px-4 py-3 font-bold ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      ${trade.pnl >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={trade.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                        {trade.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between p-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Show</span>
              <Select value={perPage} onValueChange={setPerPage}>
                <SelectTrigger className="w-16 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-x-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <span className="text-sm text-slate-500 mx-2">Page {page} of {totalPages || 1}</span>
              <Button size="sm" variant="outline" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistoryPage;