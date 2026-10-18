import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, PieChart, Settings, LogOut, TrendingUp, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const TradingSidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/trading-dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Commodities', path: '/trading/commodities', icon: Box },
    { name: 'Order History', path: '/trading/order-history', icon: History },
    { name: 'Portfolio', path: '/trading/portfolio', icon: PieChart },
    { name: 'Settings', path: '/trading/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('trading_auth_token');
    window.location.href = '/trading-login';
  };

  return (
    <div className="w-64 bg-[#FFF8E7] border-r border-orange-200/50 flex flex-col h-full shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-orange-200/50">
        <TrendingUp className="w-6 h-6 text-orange-600 mr-2" />
        <span className="font-bold text-xl text-orange-950">ProTrade</span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
              isActive 
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" 
                : "text-orange-900/60 hover:text-orange-900 hover:bg-orange-100/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-orange-200/50">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full flex justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default TradingSidebar;