import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { appCategories } from '@/data/appsData';
import { 
  Menu, X, LogOut, LayoutDashboard, ChevronDown, 
  Search, Bell, User, LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been securely signed out.",
      });
      navigate('/login', { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "An issue occurred while logging out.",
      });
    }
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-primary text-primary-foreground flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 shadow-xl md:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-primary-foreground/20 shrink-0">
          <LayoutGrid className="w-6 h-6 mr-3" />
          <span className="font-bold text-lg tracking-tight">ERP Suite</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden ml-auto text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10",
                isActive('/dashboard') && "bg-primary-foreground/20 text-primary-foreground font-semibold"
              )}
              onClick={() => {
                navigate('/dashboard');
                setSidebarOpen(false);
              }}
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              All Applications
            </Button>

            <div className="pt-4 pb-2 px-3">
              <p className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wider">
                Categories
              </p>
            </div>

            {appCategories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 pl-9"
                onClick={() => {
                  navigate('/dashboard');
                  setSidebarOpen(false);
                }}
              >
                {category}
              </Button>
            ))}
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t border-primary-foreground/20 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary-foreground/10">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary-foreground truncate">
                {currentUser?.user_metadata?.full_name || 'Authorized User'}
              </p>
              <p className="text-xs text-primary-foreground/70 truncate">
                {currentUser?.email || 'user@system.local'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="relative hidden sm:flex items-center w-64 md:w-80">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <Input 
                placeholder="Search globally..." 
                className="pl-9 bg-muted/50 border-none focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 hover:bg-muted">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => toast({ title: "Profile settings coming soon!" })}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => toast({ title: "System preferences coming soon!" })}>
                  System Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/20 p-4 sm:p-6 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}