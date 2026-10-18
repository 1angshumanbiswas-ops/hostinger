import React, { useState } from 'react';
import { useAllCommoditiesData } from '@/hooks/useAllCommoditiesData';
import CommodityCategoryTabs from './CommodityCategoryTabs';
import CommoditiesTable from './CommoditiesTable';
import CommodityDetailPanel from './CommodityDetailPanel';
import CryptocurrenciesTable from './CryptocurrenciesTable';
import IndicesTable from './IndicesTable';
import MarketExecution from './MarketExecution';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CommoditiesPage = () => {
  const { data: commData, loading: commLoading, error: commError } = useAllCommoditiesData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showTradingPanel, setShowTradingPanel] = useState(false);

  const handleTradeClick = (asset) => {
    setSelectedAsset(asset);
    setShowTradingPanel(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8E7] p-4 lg:p-6 text-slate-800">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Markets Explorer</h1>
          <p className="text-slate-600 mb-6">Trade global commodities, crypto, indices, and metals.</p>
        </div>

        <Tabs defaultValue="commodities" className="w-full">
          <TabsList className="mb-6 bg-slate-200">
            <TabsTrigger value="commodities" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Commodities</TabsTrigger>
            <TabsTrigger value="crypto" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Cryptocurrencies</TabsTrigger>
            <TabsTrigger value="indices" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Indices & ETFs</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)] min-h-[600px]">
            <div className="lg:col-span-8 h-full flex flex-col space-y-4">
              
              <TabsContent value="commodities" className="h-full m-0 data-[state=inactive]:hidden">
                <div className="mb-4">
                  <CommodityCategoryTabs activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
                </div>
                {commLoading && !commData.length ? (
                  <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
                ) : commError ? (
                  <div className="p-8 text-red-500 bg-red-50 rounded-xl border border-red-200">{commError}</div>
                ) : (
                  <CommoditiesTable 
                    data={commData} 
                    category={activeCategory} 
                    onSelectCommodity={handleTradeClick} 
                  />
                )}
              </TabsContent>

              <TabsContent value="crypto" className="h-full m-0 data-[state=inactive]:hidden">
                <CryptocurrenciesTable onSelectAsset={handleTradeClick} />
              </TabsContent>

              <TabsContent value="indices" className="h-full m-0 data-[state=inactive]:hidden">
                <IndicesTable onSelectAsset={handleTradeClick} />
              </TabsContent>
            </div>

            <div className="lg:col-span-4 h-full">
              {showTradingPanel && selectedAsset ? (
                <div className="h-full flex flex-col space-y-4">
                  <button 
                    onClick={() => setShowTradingPanel(false)}
                    className="text-sm text-slate-600 hover:text-slate-800 font-medium text-left bg-white p-3 rounded-lg border border-slate-200"
                  >
                    &larr; Back to View
                  </button>
                  <MarketExecution selectedAsset={selectedAsset} />
                </div>
              ) : (
                <div className="h-full">
                  {/* Default fallback view if no asset is selected for trading */}
                  <CommodityDetailPanel commodity={commData[0]} onTrade={handleTradeClick} />
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CommoditiesPage;