import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, ShieldAlert, FileText, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }) {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Users Management', path: '/users', icon: Users },
    { name: 'Roles & Permissions', path: '/roles', icon: ShieldAlert },
    { name: 'Audit Logs', path: '/audit-logs', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground transition-transform duration-300 ease-in-out md:static md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-foreground/20">
          <span className="text-xl font-bold">ERP Admin</span>
          <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                <span className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive ? "bg-primary-foreground/20 font-medium" : "hover:bg-primary-foreground/10"
                )}>
                  <Icon className="h-5 w-5" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 sticky top-0 z-40">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex items-center gap-4 ml-auto">
            <div className="text-sm text-right">
              <p className="font-medium text-foreground">{currentUser?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">Superadmin</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}