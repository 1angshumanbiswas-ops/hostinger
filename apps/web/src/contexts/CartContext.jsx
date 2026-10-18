import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();

  // Fetch cart items from database for authenticated users
  const fetchCartItems = async () => {
    if (!isAuthenticated || !currentUser?.id) {
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', currentUser.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to load cart items', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart from localStorage for guest users
  const loadGuestCart = () => {
    try {
      const guestCart = localStorage.getItem('guest_cart');
      setCartItems(guestCart ? JSON.parse(guestCart) : []);
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setCartItems([]);
    }
  };

  // Migrate guest cart to database when user logs in
  const migrateGuestCart = async () => {
    if (!isAuthenticated || !currentUser?.id) return;

    try {
      const guestCart = localStorage.getItem('guest_cart');
      if (!guestCart) return;

      const guestItems = JSON.parse(guestCart);
      if (guestItems.length === 0) return;

      // Insert guest cart items into database
      for (const item of guestItems) {
        await supabase.from('cart_items').upsert({
          user_id: currentUser.id,
          product_id: item.product_id,
          quantity: item.quantity
        }, { onConflict: 'user_id,product_id' });
      }

      // Clear guest cart after migration
      localStorage.removeItem('guest_cart');
      
      // Fetch updated cart from database
      await fetchCartItems();
      
      toast({ 
        title: 'Cart synced', 
        description: 'Your cart has been synced with your account' 
      });
    } catch (error) {
      console.error('Error migrating guest cart:', error);
    }
  };

  // Effect to load cart based on authentication status
  useEffect(() => {
    if (isAuthenticated && currentUser?.id) {
      // Check if we need to migrate guest cart
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        migrateGuestCart();
      } else {
        fetchCartItems();
      }
    } else {
      // Load guest cart from localStorage
      loadGuestCart();
    }
  }, [isAuthenticated, currentUser?.id]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!product || !product.id) {
      toast({ 
        title: 'Error', 
        description: 'Invalid product', 
        variant: 'destructive' 
      });
      return;
    }

    // Guest user - use localStorage
    if (!isAuthenticated || !currentUser?.id) {
      try {
        const guestCart = [...cartItems];
        const existingIndex = guestCart.findIndex(item => item.product_id === product.id);
        
        if (existingIndex >= 0) {
          guestCart[existingIndex].quantity += quantity;
        } else {
          guestCart.push({ 
            product_id: product.id, 
            quantity, 
            product 
          });
        }
        
        setCartItems(guestCart);
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        toast({ 
          title: 'Added to cart', 
          description: `${product.name} added successfully` 
        });
      } catch (error) {
        console.error('Error adding to guest cart:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to add to cart', 
          variant: 'destructive' 
        });
      }
      return;
    }

    // Authenticated user - use database
    try {
      setIsLoading(true);
      
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('product_id', product.id)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: currentUser.id,
            product_id: product.id,
            quantity: quantity
          });
        
        if (error) throw error;
      }

      await fetchCartItems();
      toast({ 
        title: 'Added to cart', 
        description: `${product.name} added successfully` 
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to add to cart', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    // Guest user - use localStorage
    if (!isAuthenticated || !currentUser?.id) {
      try {
        const guestCart = cartItems.map(item =>
          item.product_id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(guestCart);
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      } catch (error) {
        console.error('Error updating guest cart:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to update quantity', 
          variant: 'destructive' 
        });
      }
      return;
    }

    // Authenticated user - use database
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update quantity', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    // Guest user - use localStorage
    if (!isAuthenticated || !currentUser?.id) {
      try {
        const guestCart = cartItems.filter(item => item.product_id !== itemId);
        setCartItems(guestCart);
        localStorage.setItem('guest_cart', JSON.stringify(guestCart));
        toast({ title: 'Removed from cart' });
      } catch (error) {
        console.error('Error removing from guest cart:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to remove item', 
          variant: 'destructive' 
        });
      }
      return;
    }

    // Authenticated user - use database
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', currentUser.id);

      if (error) throw error;
      await fetchCartItems();
      toast({ title: 'Removed from cart' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to remove item', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    // Guest user - use localStorage
    if (!isAuthenticated || !currentUser?.id) {
      try {
        setCartItems([]);
        localStorage.removeItem('guest_cart');
        toast({ title: 'Cart cleared' });
      } catch (error) {
        console.error('Error clearing guest cart:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to clear cart', 
          variant: 'destructive' 
        });
      }
      return;
    }

    // Authenticated user - use database
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUser.id);

      if (error) throw error;
      setCartItems([]);
      toast({ title: 'Cart cleared' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to clear cart', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate cart totals
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  const cartTotal = cartItems.reduce((sum, item) => {
    const product = item.product || item;
    const price = product?.price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      isAuthenticated
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};