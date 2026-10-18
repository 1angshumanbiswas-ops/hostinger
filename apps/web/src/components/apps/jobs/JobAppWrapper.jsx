import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Briefcase, User, LogOut, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function JobAppWrapper({ children }) {
  const { isAuthenticated, user, isSuperAdmin, signOut, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/jobs');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/jobs" className="flex items-center gap-2 text-emerald-600 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
            <Briefcase className="w-6 h-6" />
            <span>TechJobFinder</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/jobs/search" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Find Jobs</Link>
            {isAuthenticated && (
              <Link to="/jobs/dashboard" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Dashboard</Link>
            )}
            {isSuperAdmin && (
              <Link to="/jobs/admin" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors">
                <ShieldAlert className="w-4 h-4" /> Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-slate-200">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-900">{user?.email}</p>
                      <p className="text-xs leading-none text-slate-500">{isSuperAdmin ? 'Superadmin' : 'Job Seeker'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/jobs/dashboard')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Dashboard</span>
                  </DropdownMenuItem>
                  {isSuperAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/jobs/admin')} className="cursor-pointer text-amber-600 focus:text-amber-600">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="text-slate-600 hover:text-emerald-600" onClick={() => navigate('/jobs/login')}>Log in</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => navigate('/jobs/login')}>Sign up</Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="flex items-center gap-2 text-white font-bold text-xl tracking-tight mb-4">
              <Briefcase className="w-6 h-6 text-emerald-500" />
              <span>TechJobFinder</span>
            </span>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Connecting talented tech professionals with innovative companies worldwide. Find your next great opportunity or your next great hire.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-4">For Seekers</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs/search" className="hover:text-emerald-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/jobs/login" className="hover:text-emerald-400 transition-colors">Create Profile</Link></li>
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Career Advice</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-4">For Employers</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs/admin" className="hover:text-emerald-400 transition-colors">Post a Job</Link></li>
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
              <li><Link to="#" className="hover:text-emerald-400 transition-colors">Resources</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} TechJobFinder. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}