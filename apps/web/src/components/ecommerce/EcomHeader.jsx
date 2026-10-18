import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';

const EcomHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/ecom');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/ecom')}
          >
            <ShoppingCart className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Mystore.com</span>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 border-gray-300 focus-visible:ring-primary"
              />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Wishlist"
            >
              <Heart className={`w-6 h-6 ${isActive('/wishlist') ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {wishlistCount}
                </Badge>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className={`w-6 h-6 ${isActive('/cart') ? 'text-primary' : 'text-gray-700'}`} />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-white text-xs">
                  {cartCount}
                </Badge>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">My Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{currentUser?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="w-4 h-4 mr-2" />
                    My Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/ecom/login')} variant="default">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 pb-4">
          <Button
            variant={isActive('/ecom') ? 'default' : 'ghost'}
            onClick={() => navigate('/ecom')}
          >
            Home
          </Button>
          <Button
            variant={isActive('/products') ? 'default' : 'ghost'}
            onClick={() => navigate('/products')}
          >
            All Products
          </Button>
          <Button
            variant={isActive('/categories') ? 'default' : 'ghost'}
            onClick={() => navigate('/categories')}
          >
            Categories
          </Button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4"
              />
            </form>

            {/* Mobile Navigation */}
            <div className="flex flex-col gap-2">
              <Button
                variant={isActive('/ecom') ? 'default' : 'ghost'}
                onClick={() => {
                  navigate('/ecom');
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                Home
              </Button>
              <Button
                variant={isActive('/products') ? 'default' : 'ghost'}
                onClick={() => {
                  navigate('/products');
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                All Products
              </Button>
              <Button
                variant={isActive('/categories') ? 'default' : 'ghost'}
                onClick={() => {
                  navigate('/categories');
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                Categories
              </Button>
              <Button
                variant={isActive('/wishlist') ? 'default' : 'ghost'}
                onClick={() => {
                  navigate('/wishlist');
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <Heart className="w-4 h-4 mr-2" />
                Wishlist ({wishlistCount})
              </Button>
              <Button
                variant={isActive('/cart') ? 'default' : 'ghost'}
                onClick={() => {
                  navigate('/cart');
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({cartCount})
              </Button>
            </div>

            {/* Mobile User Actions */}
            <div className="border-t pt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 px-2">{currentUser?.email}</p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate('/orders');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    My Orders
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    navigate('/ecom/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login / Register
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default EcomHeader;