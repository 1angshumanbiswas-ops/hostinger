import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

// ERP Components
import Sidebar from '@/components/erp/Sidebar';
import Header from '@/components/erp/Header';
import FinanceDashboard from '@/components/erp/FinanceDashboard';
import HRDashboard from '@/components/erp/HRDashboard';
import SalesDashboard from '@/components/erp/SalesDashboard';
import SupplyChainDashboard from '@/components/erp/SupplyChainDashboard';
import LoginPage from '@/components/erp/LoginPage';

const ERPDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsInitializing(false);
    }
  }, [loading]);

  const handleBackToApps = () => {
    navigate('/');
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  const renderDashboard = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'finance':
        return <FinanceDashboard />;
      case 'hr':
        return <HRDashboard />;
      case 'sales':
        return <SalesDashboard />;
      case 'supply_chain':
        return <SupplyChainDashboard />;
      default:
        return <FinanceDashboard />;
    }
  };

  if (loading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative">
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 z-50 text-slate-500 hover:text-slate-900"
          onClick={handleBackToApps}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Apps
        </Button>
        <LoginPage onLoginSuccess={() => setActiveTab('dashboard')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} onNavigate={handleNavigate} />
      
      <div className="flex-1 lg:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 pt-20 px-6 pb-12 relative">
          <div className="mb-6 flex justify-between items-center">
             <div className="text-sm breadcrumbs text-slate-400">
                Horizons ERP <span className="mx-2">/</span> <span className="capitalize text-slate-900 font-medium">{activeTab.replace('_', ' ')}</span>
             </div>
             <Button 
                variant="outline" 
                size="sm"
                onClick={handleBackToApps}
                className="hidden sm:flex"
              >
                Close App
             </Button>
          </div>
          
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default ERPDashboard;