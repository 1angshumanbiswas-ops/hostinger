import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();

  // Validate UUID format
  const isValidUUID = (uuid) => {
    if (!uuid) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    // Only fetch wishlist if user is authenticated AND has a valid user ID
    if (isAuthenticated && currentUser?.id && isValidUUID(currentUser.id)) {
      fetchWishlist();
    } else {
      // Load guest wishlist from localStorage
      loadGuestWishlist();
    }
  }, [isAuthenticated, currentUser?.id]);

  const loadGuestWishlist = () => {
    try {
      const guestWishlist = localStorage.getItem('guest_wishlist');
      setWishlistItems(guestWishlist ? JSON.parse(guestWishlist) : []);
    } catch (error) {
      console.error('Error loading guest wishlist:', error);
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWishlist = async () => {
    // Extra validation before making database query
    if (!isAuthenticated || !currentUser?.id || !isValidUUID(currentUser.id)) {
      console.warn('Cannot fetch wishlist: User not authenticated or invalid user ID');
      setWishlistItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('wishlists')
        .select('*, product:products(*)')
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Wishlist fetch error:', error);
        throw error;
      }
      
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Fallback to guest wishlist on error
      loadGuestWishlist();
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!product || !product.id) {
      toast({ 
        title: 'Error', 
        description: 'Invalid product', 
        variant: 'destructive' 
      });
      return;
    }

    // Guest user - use localStorage
    if (!isAuthenticated || !currentUser?.id || !isValidUUID(currentUser.id)) {
      try {
        const guestWishlist = [...wishlistItems];
        if (!guestWishlist.find(item => item.product_id === product.id)) {
          guestWishlist.push({ product_id: product.id, product });
          setWishlistItems(guestWishlist);
          localStorage.setItem('guest_wishlist', JSON.stringify(guestWishlist));
          toast({ 
            title: 'Added to wishlist', 
            description: `${product.name} added to your wishlist` 
          });
        } else {
          toast({ 
            title: 'Already in wishlist', 
            description: `${product.name} is already in your wishlist` 
          });
        }
      } catch (error) {
        console.error('Error adding to guest wishlist:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to add to wishlist', 
          variant: 'destructive' 
        });
      }
      return;
    }

    // Authenticated user - use database
    try {
      setIsLoading(true);
      
      // Check if item already exists
      const { data: existingItem, error: checkError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('product_id', product.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingItem) {
        toast({ 
          title: 'Already in wishlist', 
          description: `${product.name} is already in your wishlist` 
        });
        return;
      }

      const { error } = await supabase
        .from('wishlists')
        .insert({ 
          user_id: currentUser.id, 
          product_id: product.id 
        });

      if (error) throw error;
      
      await fetchWishlist();
      toast({ 
        title: 'Added to wishlist', 
        description: `${product.name} added to your wishlist` 
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to add to wishlist', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) {
      toast({ 
        title: 'Error', 
        description: 'Invalid product ID', 
        variant: 'destructive' 
      });
      return;
    }

    // Guest user - use localStorage
    if (!isAuthenticated || !currentUser?.id || !isValidUUID(currentUser.id)) {
      try {
        const guestWishlist = wishlistItems.filter(item => item.product_id !== productId);
        setWishlistItems(guestWishlist);
        localStorage.setItem('guest_wishlist', JSON.stringify(guestWishlist));
        toast({ title: 'Removed from wishlist' });
      } catch (error) {
        console.error('Error removing from guest wishlist:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to remove from wishlist', 
          variant: 'destructive' 
        });
      }
      return;
    }

    // Authenticated user - use database
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('product_id', productId);

      if (error) throw error;
      
      await fetchWishlist();
      toast({ title: 'Removed from wishlist' });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to remove from wishlist', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some(item => item.product_id === productId);
  };

  const clearWishlist = async () => {
    // Guest user - use localStorage
    if (!isAuthenticated || !currentUser?.id || !isValidUUID(currentUser.id)) {
      try {
        setWishlistItems([]);
        localStorage.removeItem('guest_wishlist');
        toast({ title: 'Wishlist cleared' });
      } catch (error) {
        console.error('Error clearing guest wishlist:', error);
      }
      return;
    }

    // Authenticated user - use database
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', currentUser.id);

      if (error) throw error;
      
      setWishlistItems([]);
      toast({ title: 'Wishlist cleared' });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to clear wishlist', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
    isAuthenticated
  };
};