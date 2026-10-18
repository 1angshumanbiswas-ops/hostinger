import React from 'react';
import { LayoutDashboard, Users, CreditCard, BarChart3, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/hr-portal' },
    { name: 'Employees', icon: Users, path: '/hr-portal/employees' },
    { name: 'Payroll', icon: CreditCard, path: '/hr-portal/payroll' },
    { name: 'Analytics', icon: BarChart3, path: '/hr-portal/analytics' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-[calc(100vh-4rem)] flex flex-col sticky top-16 shadow-sm">
      <div className="p-6 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#1f5233]" />
          <span className="font-bold text-sm tracking-tight text-foreground uppercase">Angshuman AI Corp ERP</span>
        </div>
      </div>
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || (currentPath === '/hr-portal/' && item.path === '/hr-portal');
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-[#1f5233] text-white shadow-sm" 
                  : "text-muted-foreground hover:bg-[#1f5233]/10 hover:text-[#1f5233]"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          &copy; 2026 Angshuman AI Corp ERP
        </div>
      </div>
    </aside>
  );
}