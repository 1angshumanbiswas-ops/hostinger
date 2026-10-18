import React from 'react';
import { Outlet } from 'react-router-dom';
import TradingSidebar from './TradingSidebar';

const TradingLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <TradingSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default TradingLayout;