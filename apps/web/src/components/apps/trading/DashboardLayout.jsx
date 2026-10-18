import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BrainCircuit, BellRing, History, TrendingUp, Settings } from 'lucide-react';
import { fetchAllMarketData } from '@/utils/MarketDataService';

const DashboardLayout = () => {
  const location = useLocation();
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    const fetchTicker = async () => {
      const data = await fetchAllMarketData();
      setTickerData(data.slice(0, 5));
    };
    fetchTicker();
    const interval = setInterval(fetchTicker, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/trading', icon: LayoutDashboard, exact: true },
    { name: 'Recommendations', path: '/trading/recommendations', icon: BrainCircuit },
    { name: 'Alerts', path: '/trading/alerts', icon: BellRing },
    { name: 'History', path: '/trading/history', icon: History },
    { name: 'Settings', path: '/trading/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Real-time Ticker */}
      <div className="bg-slate-900 text-white py-2 overflow-hidden border-b border-slate-800">
        <div className="flex animate-pulse whitespace-nowrap">
          {tickerData.map((asset, i) => (
            <div key={i} className="inline-flex items-center mx-8 space-x-2 text-sm font-medium">
              <span>{asset.asset_name}</span>
              <span className={asset.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                ${asset.price} ({asset.change_24h}%)
              </span>
            </div>
          ))}
          {tickerData.length === 0 && <span className="mx-8 text-sm text-slate-400">Loading market data...</span>}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:block">
          <div className="p-6">
            <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
              <TrendingUp className="w-6 h-6" />
              Intl Trading
            </h1>
          </div>
          <nav className="space-y-1 px-4">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path);
                
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;