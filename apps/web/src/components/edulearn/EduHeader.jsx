import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Home, BookOpen, Search, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useEduAuth } from '@/contexts/EduAuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function EduHeader() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, currentUser, logout } = useEduAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/edulearn/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/edulearn')}>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg text-[hsl(var(--edulearn-heading))] leading-none">Edulearn</h1>
            <p className="text-xs text-muted-foreground">NCERT & CBSE Resources</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/edulearn')}
            className="font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/edulearn/classes')}
            className="font-medium"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Classes
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/edulearn/library')}
            className="font-medium"
          >
            <Search className="w-4 h-4 mr-2" />
            Library
          </Button>
          {isAdmin && (
            <Button
              variant="ghost"
              onClick={() => navigate('/edulearn/admin')}
              className="font-medium"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentUser?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{currentUser?.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {isAdmin ? 'Administrator' : 'Student'}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/edulearn/login')}>
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}