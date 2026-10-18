import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, ShieldAlert, X } from 'lucide-react';
import { useTradeManagement } from '@/hooks/useTradeManagement';

const StopLossTakeProfitPanel = () => {
  const { trades, closeTrade, updateTradeLevels } = useTradeManagement();
  const [editingId, setEditingId] = useState(null);
  const [editSL, setEditSL] = useState('');
  const [editTP, setEditTP] = useState('');

  const openTrades = trades.filter(t => t.status === 'OPEN');

  const startEdit = (trade) => {
    setEditingId(trade.id);
    setEditSL(trade.stop_loss || '');
    setEditTP(trade.take_profit || '');
  };

  const saveEdit = (trade) => {
    updateTradeLevels(trade.id, trade.level_id, editSL ? Number(editSL) : null, editTP ? Number(editTP) : null);
    setEditingId(null);
  };

  return (
    <Card className="bg-white border-orange-100 shadow-sm">
      <CardHeader className="border-b border-slate-50 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          Active Trade Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Asset</th>
                <th className="px-4 py-3 font-medium">Type/Size</th>
                <th className="px-4 py-3 font-medium">Entry/Current</th>
                <th className="px-4 py-3 font-medium">P&L</th>
                <th className="px-4 py-3 font-medium">Stop Loss</th>
                <th className="px-4 py-3 font-medium">Take Profit</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {openTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-slate-50 hover:bg-slate-50/30">
                  <td className="px-4 py-3 font-bold text-slate-700">{trade.asset}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={trade.type === 'BUY' ? 'text-emerald-600 border-emerald-200' : 'text-red-600 border-red-200'}>
                      {trade.type} {trade.size}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>En: {Number(trade.entry_price).toFixed(5)}</div>
                    <div className="text-xs">Cr: {Number(trade.current_price).toFixed(5)}</div>
                  </td>
                  <td className={`px-4 py-3 font-bold ${trade.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    ${trade.pnl >= 0 ? '+' : ''}{(trade.pnl || 0).toFixed(2)}
                  </td>
                  
                  {editingId === trade.id ? (
                    <>
                      <td className="px-4 py-2">
                        <Input type="number" step="0.00001" value={editSL} onChange={(e) => setEditSL(e.target.value)} className="w-24 h-8 text-xs" placeholder="None" />
                      </td>
                      <td className="px-4 py-2">
                        <Input type="number" step="0.00001" value={editTP} onChange={(e) => setEditTP(e.target.value)} className="w-24 h-8 text-xs" placeholder="None" />
                      </td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="h-8">Cancel</Button>
                        <Button size="sm" onClick={() => saveEdit(trade)} className="h-8 bg-orange-500 hover:bg-orange-600 text-white">Save</Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-slate-600">{trade.stop_loss ? Number(trade.stop_loss).toFixed(5) : '-'}</td>
                      <td className="px-4 py-3 text-slate-600">{trade.take_profit ? Number(trade.take_profit).toFixed(5) : '-'}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(trade)} className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">Edit Levels</Button>
                        <Button size="sm" variant="ghost" onClick={() => closeTrade(trade.id)} className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50">Close</Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {openTrades.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-400 flex flex-col items-center">
                    <ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
                    No active positions to manage
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StopLossTakeProfitPanel;