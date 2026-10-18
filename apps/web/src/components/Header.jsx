import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Home as HomeIcon, Grid3x3, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'All Apps', path: '/apps-hub', icon: Grid3x3 },
    { label: 'Portfolio', path: '/portfolio', icon: User },
    { label: 'Education', path: '/edulearn', icon: BookOpen }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => handleNavigation('/')}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 duration-300">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-dark-green leading-none mb-1 group-hover:opacity-80 transition-opacity text-base">
              Angshuman Biswas
            </h1>
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              AI Generalist No Code Developer
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className={`font-semibold transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-dark-green' 
                    : 'text-dark-green hover:text-dark-green hover:bg-primary/5'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-dark-green" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <SheetHeader>
              <SheetTitle className="text-dark-green text-left">Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? 'secondary' : 'ghost'}
                    onClick={() => handleNavigation(item.path)}
                    className={`justify-start font-semibold transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-primary/10 text-dark-green' 
                        : 'text-dark-green hover:text-dark-green hover:bg-primary/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;