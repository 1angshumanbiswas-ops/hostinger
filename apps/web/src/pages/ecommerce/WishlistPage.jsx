import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EcomHeader from '@/components/ecommerce/EcomHeader';
import EcomFooter from '@/components/ecommerce/EcomFooter';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/utils/productUtils';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { wishlistItems, isLoading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
    }
  };

  // Show loading state while checking authentication
  if (authLoading || isLoading) {
    return (
      <>
        <Helmet>
          <title>My Wishlist - Mystore.com</title>
          <meta name="description" content="View and manage your saved products wishlist" />
        </Helmet>
        <div className="min-h-screen bg-gray-50">
          <EcomHeader />
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your wishlist...</p>
            </div>
          </div>
          <EcomFooter />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist - Mystore.com</title>
        <meta name="description" content="View and manage your saved products wishlist" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <EcomHeader />

        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                  <p className="text-gray-600 mt-1">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                  </p>
                </div>
              </div>

              {wishlistItems.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearAll}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Authentication Notice for Guest Users */}
          {!isAuthenticated && wishlistItems.length > 0 && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <LogIn className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">Save Your Wishlist</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Sign in or create an account to save your wishlist across devices and never lose your favorite items.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => navigate('/ecom/login')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Sign In / Register
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start adding products to your wishlist to save them for later. Click the heart icon on any product to add it here.
              </p>
              <Button
                onClick={() => navigate('/products')}
                className="bg-primary hover:bg-primary/90"
              >
                Browse Products
              </Button>
            </motion.div>
          ) : (
            /* Wishlist Items */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => {
                const product = item.product || item;
                return (
                  <motion.div
                    key={item.id || item.product_id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        />
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemove(product.id)}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>

                        {/* Discount Badge */}
                        {product.discount > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>

                      <CardContent className="p-4 flex flex-col flex-grow">
                        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                        
                        <h3 
                          className="font-semibold text-gray-900 line-clamp-2 mb-3 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => navigate(`/product/${product.slug}`)}
                        >
                          {product.name}
                        </h3>

                        <div className="flex items-baseline gap-2 mb-4 mt-auto">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <EcomFooter />
      </div>
    </>
  );
};

export default WishlistPage;