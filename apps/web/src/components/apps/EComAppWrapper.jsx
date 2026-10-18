import React, { useState } from 'react';
import Sidebar from '@/components/erp/Sidebar'; 
import { 
  LayoutDashboard,
  ShoppingCart, 
  Settings, 
  PackageSearch, 
  BarChart3, 
  MessageSquare,
  Users,
  Database,
  Sparkles,
  Workflow,
  ActivitySquare,
  Menu,
  X
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ecomNavigation = [
  { name: 'Command Center', href: '/ecom/dashboard', icon: LayoutDashboard },
  { name: 'Cart Recovery', href: '/cart-recovery', icon: ShoppingCart },
  { name: 'Workflow Studio', href: '/ecom/workflow-studio', icon: Workflow },
  { name: 'Workflow Analytics', href: '/ecom/workflow-analytics', icon: ActivitySquare },
  { name: 'Inventory Intel', href: '/inventory-intelligence', icon: PackageSearch },
  { name: 'Customer LTV', href: '/ecom/customers', icon: Users },
  { name: 'AI Messages', href: '/ecom/ai-messages', icon: Sparkles },
  { name: 'Benchmarks', href: '/ecom/benchmarks', icon: BarChart3 },
  { name: 'Integrations API', href: '/ecom/settings', icon: Database },
  { name: 'Message Queue', href: '/message-queue', icon: MessageSquare },
];

export default function EComAppWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950 border-b border-slate-800">
          <span className="text-xl font-bold tracking-tight">ECom<span className="text-blue-500">Rev</span></span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {ecomNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500 hover:text-slate-700">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center text-sm text-slate-500 ml-4">
             <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> APIs Connected
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
               AD
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}