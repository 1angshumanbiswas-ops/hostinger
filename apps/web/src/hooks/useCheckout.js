import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { generateOrderNumber, calculateTax, calculateShipping, calculateTotal } from '@/utils/productUtils';

export const useCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { currentUser } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();

  const processCheckout = async (checkoutData) => {
    try {
      setIsProcessing(true);

      const subtotal = cartTotal;
      const tax = calculateTax(subtotal);
      const shipping = calculateShipping(subtotal);
      const discount = checkoutData.couponDiscount || 0;
      const total = calculateTotal(subtotal, tax, shipping, discount);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: currentUser?.id,
          order_number: generateOrderNumber(),
          status: 'pending',
          subtotal,
          tax,
          shipping_cost: shipping,
          discount,
          total,
          shipping_address: checkoutData.shippingAddress,
          billing_address: checkoutData.billingAddress || checkoutData.shippingAddress,
          payment_method: checkoutData.paymentMethod,
          shipping_method: checkoutData.shippingMethod,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_image: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order
      await clearCart();

      toast({
        title: 'Order placed successfully!',
        description: `Order number: ${order.order_number}`
      });

      return { success: true, order };
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout failed',
        description: 'Please try again',
        variant: 'destructive'
      });
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processCheckout
  };
};