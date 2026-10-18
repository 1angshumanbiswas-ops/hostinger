import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  TrendingUp, 
  Truck, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Sidebar = ({ activeTab, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    if (!onNavigate) {
      navigate('/erp/login');
    }
  };

  const userRole = user?.user_metadata?.role || user?.role || 'user';
  const isSuperadmin = userRole === 'superadmin';

  let navItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/erp/dashboard', icon: LayoutDashboard, exact: true },
  ];

  if (isSuperadmin || userRole === 'finance') {
    navItems.push({ id: 'finance', name: 'Finance', path: '/erp/finance', icon: Wallet });
  }
  if (isSuperadmin || userRole === 'hr') {
    navItems.push({ id: 'hr', name: 'HR Portal', path: '/erp/hr', icon: Users });
  }
  if (isSuperadmin || userRole === 'sales') {
    navItems.push({ id: 'sales', name: 'Sales & CRM', path: '/erp/sales', icon: TrendingUp });
  }
  if (isSuperadmin || userRole === 'supply_chain') {
    navItems.push({ id: 'supply_chain', name: 'Supply Chain', path: '/erp/supply-chain', icon: Truck });
  }

  const handleItemClick = (e, item) => {
    setIsOpen(false);
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item.id);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#163a24] text-white">
      <div className="h-16 flex items-center px-6 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/50">
            <span className="font-bold text-lg text-primary-foreground">H</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Horizons<span className="text-emerald-400">ERP</span></span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={(e) => handleItemClick(e, item)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
              (onNavigate ? activeTab === item.id : isActive)
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                : "text-slate-300 hover:text-white hover:bg-white/10"
            )}
            end={item.exact}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}

        {isSuperadmin && (
           <div className="mt-4 mx-3 p-3 bg-amber-900/30 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-wider">Superadmin</span>
              </div>
              <p className="text-[10px] text-amber-200/70">You have full system access.</p>
           </div>
        )}
      </nav>

      <div className="p-4 border-t border-primary/20 space-y-2">
        <NavLink
          to="/erp/settings"
          onClick={(e) => {
            setIsOpen(false);
            if (onNavigate) { e.preventDefault(); onNavigate('settings'); }
          }}
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
             (onNavigate ? activeTab === 'settings' : isActive) ? "bg-white/10 text-white" : "text-slate-300 hover:text-white hover:bg-white/10"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-40 bg-[#163a24] shadow-xl border-r border-primary/20">
        <SidebarContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white border-slate-200 shadow-sm hover:text-primary"
        >
          {isOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#163a24] z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;