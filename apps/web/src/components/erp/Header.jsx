import React, { useState, useEffect } from 'react';
import { Bell, LogOut, User, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRefresh } from '@/contexts/RefreshContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import AISearchBar from './AISearchBar';

const Header = () => {
  const { user, signOut } = useAuth();
  const { refreshAllData, isRefreshing, lastRefreshTime } = useRefresh();
  const [_, setTick] = useState(0); 
  
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const roleColors = {
    finance: 'bg-emerald-100 text-emerald-700',
    hr: 'bg-purple-100 text-purple-700',
    sales: 'bg-blue-100 text-blue-700',
    supply_chain: 'bg-orange-100 text-orange-700',
    superadmin: 'bg-amber-100 text-amber-700 border border-amber-200'
  };

  const userRole = user?.user_metadata?.role || user?.role || 'user';
  const roleBadgeClass = roleColors[userRole] || 'bg-slate-100 text-slate-700';

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-sm fixed top-0 right-0 left-0 z-30 lg:left-64 flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex-1 max-w-xl">
        <AISearchBar />
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        {userRole === 'superadmin' && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
            <Shield className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">Superadmin Mode</span>
          </div>
        )}

        <div className="flex flex-col items-end">
           <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshAllData} 
              disabled={isRefreshing}
              className="text-slate-500 hover:text-[hsl(var(--dark-green))] gap-2 h-9"
           >
             <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[hsl(var(--dark-green))]' : ''}`} />
             <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
           </Button>
           <span className="text-[10px] text-slate-400 mr-2 hidden sm:block">
              Updated {formatDistanceToNow(lastRefreshTime)} ago
           </span>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-[hsl(var(--dark-green))] hidden sm:flex">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 hover:bg-slate-50 rounded-full h-10">
              <Avatar className="w-8 h-8 border border-slate-200">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className={`${userRole === 'superadmin' ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'} font-medium`}>
                  {getInitials(user?.user_metadata?.full_name || user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-slate-900 leading-none mb-1">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <Badge variant="secondary" className={`text-[10px] h-4 px-1.5 font-normal capitalize ${roleBadgeClass}`}>
                  {userRole.replace('_', ' ')}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;