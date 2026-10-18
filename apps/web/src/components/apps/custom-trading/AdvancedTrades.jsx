import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/customSupabaseClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdvancedTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrades = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrades(data || []);
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const closePosition = async (id) => {
    try {
      await supabase.from('custom_trades').update({ status: 'CLOSED' }).eq('id', id);
      fetchTrades();
    } catch (error) {
      console.error('Error closing trade:', error);
    }
  };

  const openTrades = trades.filter(t => t.status === 'OPEN');
  const closedTrades = trades.filter(t => t.status === 'CLOSED');

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading...</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Asset</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Size</th>
                    <th className="px-4 py-2">Entry Price</th>
                    <th className="px-4 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {openTrades.map(trade => (
                    <tr key={trade.id} className="border-b border-slate-100">
                      <td className="px-4 py-3 font-medium">{trade.asset}</td>
                      <td className="px-4 py-3">
                        <Badge className={trade.type === 'BUY' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}>
                          {trade.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{trade.size}</td>
                      <td className="px-4 py-3">{trade.entry_price}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm" onClick={() => closePosition(trade.id)}>Close</Button>
                      </td>
                    </tr>
                  ))}
                  {openTrades.length === 0 && (
                    <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">No open positions.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Closed History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Asset</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Size</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {closedTrades.map(trade => (
                    <tr key={trade.id} className="border-b border-slate-100 text-slate-500">
                      <td className="px-4 py-3 font-medium">{trade.asset}</td>
                      <td className="px-4 py-3">{trade.type}</td>
                      <td className="px-4 py-3">{trade.size}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">CLOSED</Badge>
                      </td>
                    </tr>
                  ))}
                  {closedTrades.length === 0 && (
                    <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-500">No closed trades.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedTrades;