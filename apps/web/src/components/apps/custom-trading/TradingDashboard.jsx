import React, { useState } from 'react';
import AssetList from './AssetList';
import MarketExecution from './MarketExecution';
import TradingChart from './TradingChart';
import AdvancedTrades from './AdvancedTrades';
import StopLossTakeProfitPanel from './StopLossTakeProfitPanel';
import PriceAlertManager from './PriceAlertManager';
import FavoritesPanel from './FavoritesPanel';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { useAllCryptocurrenciesData } from '@/hooks/useAllCryptocurrenciesData';
import { useAllIndicesData } from '@/hooks/useAllIndicesData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TickerItem = ({ symbol, price, changePercent }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100 min-w-[160px]">
    <span className="font-bold text-slate-800 text-sm">{symbol}</span>
    <div className="flex flex-col items-end ml-auto">
      <span className="text-sm font-medium tabular-nums">${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}</span>
      <span className={`text-xs flex items-center font-bold ${changePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
        {changePercent >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {Math.abs(changePercent || 0).toFixed(2)}%
      </span>
    </div>
  </div>
);

const TradingDashboard = () => {
  const [selectedAsset, setSelectedAsset] = useState({ symbol: 'EURUSD', price: 1.0845 });
  const [activeTab, setActiveTab] = useState('execution');
  const navigate = useNavigate();

  const { data: cryptoData } = useAllCryptocurrenciesData();
  const { data: indicesData } = useAllIndicesData();
  const topCryptos = cryptoData.slice(0, 5);
  const topIndices = indicesData.slice(0, 5);
  
  // Real time fake polling
  const updates = useRealTimeUpdates([...topCryptos.map(c=>c.symbol), ...topIndices.map(i=>i.symbol)]);

  return (
    <div className="min-h-screen bg-[#FFF8E7] p-4 lg:p-6 text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Real-Time Ticker */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-3">
            {topCryptos.map(c => (
              <TickerItem 
                key={c.id} 
                symbol={c.symbol} 
                price={c.price + (updates[c.symbol]?.priceTick || 0)} 
                changePercent={c.changePercent24h} 
              />
            ))}
            <div className="w-px bg-slate-300 mx-2" />
            {topIndices.map(i => (
              <TickerItem 
                key={i.symbol} 
                symbol={i.symbol} 
                price={i.price + (updates[i.symbol]?.priceTick || 0)} 
                changePercent={i.changePercent} 
              />
            ))}
            <Button variant="outline" size="sm" className="ml-auto whitespace-nowrap" onClick={() => navigate('/custom-trading/commodities')}>
              View All Markets
            </Button>
          </div>
        </div>

        {/* Header Tabs */}
        <div className="flex gap-4 border-b border-slate-300 pb-2">
          <button 
            className={`text-lg font-bold pb-2 border-b-2 ${activeTab === 'execution' ? 'border-orange-600 text-orange-950' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('execution')}
          >
            Market Execution
          </button>
          <button 
            className={`text-lg font-bold pb-2 border-b-2 ${activeTab === 'advanced' ? 'border-orange-600 text-orange-950' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('advanced')}
          >
            Position Management
          </button>
          <button 
            className={`text-lg font-bold pb-2 border-b-2 ${activeTab === 'dashboard' ? 'border-orange-600 text-orange-950' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Overview & Alerts
          </button>
        </div>

        {activeTab === 'execution' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-180px)] min-h-[600px]">
            <div className="lg:col-span-3 h-full hidden lg:block">
              <AssetList selectedAsset={selectedAsset} onSelectAsset={setSelectedAsset} />
            </div>
            <div className="lg:col-span-3 h-full">
              <MarketExecution selectedAsset={selectedAsset} />
            </div>
            <div className="lg:col-span-6 h-full">
              <TradingChart selectedAsset={selectedAsset} />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="pt-4 space-y-6">
            <StopLossTakeProfitPanel />
            <AdvancedTrades />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <FavoritesPanel onSelectAsset={(asset) => {
              setSelectedAsset(asset);
              setActiveTab('execution');
            }} />
            <PriceAlertManager />
          </div>
        )}

      </div>
    </div>
  );
};

export default TradingDashboard;