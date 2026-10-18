import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Bell, Star } from 'lucide-react';
import { useCommodityFavorites } from '@/hooks/CommodityFavoritesManager';
import { useToast } from '@/components/ui/use-toast';

const CommodityDetailPanel = ({ commodity, onTrade }) => {
  const { favorites, toggleFavorite } = useCommodityFavorites();
  const { toast } = useToast();

  if (!commodity) {
    return (
      <Card className="h-full bg-white flex items-center justify-center border-orange-200/50">
        <p className="text-slate-500">Select a commodity to view details.</p>
      </Card>
    );
  }

  const isFavorite = favorites.includes(commodity.symbol);

  return (
    <Card className="h-full bg-white flex flex-col shadow-sm border-orange-200/50">
      <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-2xl font-bold text-slate-800">{commodity.name}</CardTitle>
          <p className="text-sm text-slate-500">{commodity.symbol} &bull; {commodity.category}</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="icon" onClick={() => toggleFavorite(commodity.symbol)}>
             <Star className={`w-4 h-4 ${isFavorite ? 'fill-orange-500 text-orange-500' : ''}`} />
           </Button>
           <Button variant="outline" size="icon" onClick={() => toast({title: "Alert Settings", description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"})}>
             <Bell className="w-4 h-4" />
           </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-6 space-y-6">
        
        <div className="flex justify-between items-end">
          <div>
            <div className="text-sm text-slate-500 mb-1">Current Price (USD)</div>
            <div className="text-4xl font-bold tabular-nums tracking-tight text-slate-900">
              ${commodity.price.toFixed(2)}
            </div>
          </div>
          <div className={`flex flex-col items-end ${commodity.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <div className="flex items-center gap-1 font-bold text-lg">
              {commodity.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)}
            </div>
            <div className="text-sm font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full mt-1">
               {Math.abs(commodity.changePercent).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div>
            <div className="text-xs text-slate-500">24h High</div>
            <div className="font-medium tabular-nums">${commodity.high.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">24h Low</div>
            <div className="font-medium tabular-nums">${commodity.low.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Volume</div>
            <div className="font-medium tabular-nums">{commodity.volume.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Contract Unit</div>
            <div className="font-medium">{commodity.unit}</div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <Button 
            onClick={() => onTrade(commodity)} 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg font-bold shadow-md shadow-orange-500/20"
          >
            Trade {commodity.symbol}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommodityDetailPanel;