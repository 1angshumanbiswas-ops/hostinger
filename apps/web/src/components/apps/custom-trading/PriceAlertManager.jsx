import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Bell, Trash2, Loader2 } from 'lucide-react';

const PriceAlertManager = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [alertType, setAlertType] = useState('above');
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;
      
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSave = async () => {
    if (!symbol || !targetPrice) {
      toast({ title: "Error", description: "Symbol and Target Price are required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error("Please log in to set alerts");

      const { error } = await supabase.from('price_alerts').insert([{
        user_id: user.user.id,
        symbol: symbol.toUpperCase(),
        target_price: parseFloat(targetPrice),
        alert_type: alertType
      }]);

      if (error) throw error;

      toast({ title: "Alert Saved", description: `Alert set for ${symbol.toUpperCase()} ${alertType} $${targetPrice}` });
      setSymbol('');
      setTargetPrice('');
      fetchAlerts();
    } catch (err) {
      toast({ title: "Failed to save alert", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('price_alerts').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Alert Deleted" });
      fetchAlerts();
    } catch (err) {
      toast({ title: "Failed to delete", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-500" /> Price Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Asset Symbol</label>
            <Input 
              placeholder="e.g. BTC, AAPL" 
              value={symbol} 
              onChange={(e) => setSymbol(e.target.value)} 
              className="uppercase"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Condition</label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Crosses Above</SelectItem>
                <SelectItem value="below">Crosses Below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500">Target Price ($)</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={targetPrice} 
              onChange={(e) => setTargetPrice(e.target.value)} 
            />
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set Alert"}
          </Button>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Active Alerts</h4>
          {alerts.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              No active alerts. Create one above!
            </p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-auto">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${alert.alert_type === 'above' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-medium text-slate-800">{alert.symbol}</span>
                    <span className="text-sm text-slate-500">
                      {alert.alert_type === 'above' ? '>' : '<'} ${alert.target_price.toLocaleString()}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(alert.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceAlertManager;