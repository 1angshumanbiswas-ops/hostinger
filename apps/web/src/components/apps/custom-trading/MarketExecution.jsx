import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const MarketExecution = ({ selectedAsset }) => {
  const [size, setSize] = useState('1.0');
  const [leverage, setLeverage] = useState([100]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTrade = async (type) => {
    if (!selectedAsset) return;
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const tradeData = {
        user_id: userData?.user?.id || null, 
        asset: selectedAsset.symbol,
        type: type,
        size: parseFloat(size),
        leverage: leverage[0],
        entry_price: selectedAsset.price,
        status: 'OPEN'
      };

      const { error } = await supabase.from('custom_trades').insert([tradeData]);

      if (error) throw error;

      toast({
        title: "Trade Executed",
        description: `Successfully opened ${type} position for ${size} lots of ${selectedAsset.symbol}.`,
      });
    } catch (error) {
      toast({
        title: "Trade Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedAsset) {
    return (
      <Card className="h-full bg-white flex items-center justify-center">
        <p className="text-slate-500">Select an asset from the list to trade.</p>
      </Card>
    );
  }

  const spread = 1.2;
  const price = selectedAsset.price || 100; // Fallback
  const bidPrice = (price - (spread * 0.0001)).toFixed(5);
  const askPrice = (price + (spread * 0.0001)).toFixed(5);
  const requiredMargin = ((price * parseFloat(size) * 100000) / leverage[0]).toFixed(2);

  return (
    <Card className="h-full bg-white flex flex-col shadow-sm border-slate-200">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-xl font-bold text-slate-800">
          {selectedAsset.symbol} <span className="text-sm font-normal text-slate-500 ml-2">{selectedAsset.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-6 space-y-6">
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Volume (Lots)</label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.01">0.01</SelectItem>
              <SelectItem value="0.1">0.10</SelectItem>
              <SelectItem value="1.0">1.00</SelectItem>
              <SelectItem value="10.0">10.00</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-700">Leverage</label>
            <span className="text-sm font-bold text-indigo-600">1:{leverage[0]}</span>
          </div>
          <Slider 
            defaultValue={[100]} 
            max={500} 
            min={1} 
            step={1}
            value={leverage}
            onValueChange={setLeverage}
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>1:1</span>
            <span>1:500</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm border border-slate-100">
          <div className="flex justify-between">
            <span className="text-slate-500">Point Value</span>
            <span className="font-medium">$10.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Required Margin</span>
            <span className="font-medium">${requiredMargin}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Current Price</span>
            <span className="font-medium">${price.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 grid grid-cols-2 gap-4">
          <Button 
            onClick={() => handleTrade('SELL')} 
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white h-16 flex flex-col items-center justify-center"
          >
            <span className="text-xs uppercase tracking-wider mb-1">Sell by Market</span>
            <span className="text-lg font-bold tabular-nums">{bidPrice}</span>
          </Button>
          <Button 
            onClick={() => handleTrade('BUY')} 
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white h-16 flex flex-col items-center justify-center"
          >
            <span className="text-xs uppercase tracking-wider mb-1">Buy by Market</span>
            <span className="text-lg font-bold tabular-nums">{askPrice}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketExecution;