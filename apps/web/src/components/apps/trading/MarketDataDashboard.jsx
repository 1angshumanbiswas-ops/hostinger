import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { fetchAllMarketData } from '@/utils/MarketDataService';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketDataDashboard = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAllMarketData();
    setMarketData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Live Market Data</h2>
        <button onClick={loadData} className="text-slate-500 hover:text-slate-800">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketData.map((asset, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{asset.asset_name}</span>
                  <span className="text-xs uppercase bg-slate-100 px-2 py-1 rounded text-slate-600">{asset.type}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-semibold">${asset.price}</span>
                  <span className={`flex items-center text-sm ${asset.change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {asset.change_24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                    {asset.change_24h}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 border-t pt-2">
                  <span>Bid: ${asset.bid}</span>
                  <span>Ask: ${asset.ask}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MarketDataDashboard;