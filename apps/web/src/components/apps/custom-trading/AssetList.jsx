import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

const MOCK_ASSETS = [
  { symbol: 'EURUSD', price: 1.0845, change: 0.12, high: 1.0890, low: 1.0810, type: 'Currencies' },
  { symbol: 'GBPUSD', price: 1.2630, change: -0.05, high: 1.2680, low: 1.2600, type: 'Currencies' },
  { symbol: 'NZDUSD', price: 0.6120, change: 0.25, high: 0.6150, low: 0.6100, type: 'Currencies' },
  { symbol: 'USDJPY', price: 150.40, change: 0.15, high: 150.80, low: 149.90, type: 'Currencies' },
  { symbol: 'USDCAD', price: 1.3520, change: -0.10, high: 1.3560, low: 1.3500, type: 'Currencies' },
  { symbol: 'EURGBP', price: 0.8580, change: 0.18, high: 0.8600, low: 0.8550, type: 'Currencies' },
  { symbol: 'CR.OIL', price: 78.50, change: 1.20, high: 79.10, low: 77.20, type: 'Commodities' },
  { symbol: 'BTCUSD', price: 64200, change: 2.50, high: 65000, low: 62000, type: 'Crypto' },
];

const AssetList = ({ onSelectAsset, selectedAsset }) => {
  const [activeTab, setActiveTab] = useState('Currencies');
  const [favorites, setFavorites] = useState([]);
  const tabs = ['Favourites', 'Currencies', 'Commodities', 'Crypto'];

  const toggleFavorite = (symbol, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const displayedAssets = activeTab === 'Favourites' 
    ? MOCK_ASSETS.filter(a => favorites.includes(a.symbol))
    : MOCK_ASSETS.filter(a => a.type === activeTab);

  return (
    <Card className="h-full bg-white border-slate-200 overflow-hidden flex flex-col">
      <div className="flex border-b border-slate-100 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 sticky top-0">
            <tr>
              <th className="px-4 py-2 font-medium">Asset</th>
              <th className="px-4 py-2 font-medium text-right">Price</th>
              <th className="px-4 py-2 font-medium text-right">24h</th>
            </tr>
          </thead>
          <tbody>
            {displayedAssets.map((asset) => (
              <tr 
                key={asset.symbol} 
                onClick={() => onSelectAsset(asset)}
                className={`border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedAsset?.symbol === asset.symbol ? 'bg-indigo-50/50' : ''}`}
              >
                <td className="px-4 py-3 font-medium flex items-center gap-2">
                  <button onClick={(e) => toggleFavorite(asset.symbol, e)} className="text-slate-300 hover:text-yellow-400 focus:outline-none">
                    <Star className={`w-4 h-4 ${favorites.includes(asset.symbol) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </button>
                  {asset.symbol}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">{asset.price}</td>
                <td className={`px-4 py-3 text-right tabular-nums font-medium ${asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(asset.change)}%
                  </div>
                </td>
              </tr>
            ))}
            {displayedAssets.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-slate-500">No assets found in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AssetList;