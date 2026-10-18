import { supabase } from '@/lib/customSupabaseClient';

export const generateRecoveryToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const detectAbandonedCarts = async () => {
  try {
    // In a real app, this would query active session/cart data that hasn't converted.
    // Here we'll simulate fetching from a raw sessions table or equivalent.
    console.log("Detecting abandoned carts... (mock implementation)");
    return [];
  } catch (error) {
    console.error("Error detecting abandoned carts:", error);
    return [];
  }
};

export const markCartAbandoned = async (cartData) => {
  try {
    const token = generateRecoveryToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days default

    const { data, error } = await supabase.from('abandoned_carts').insert({
      customer_id: cartData.customer_id || null,
      customer_name: cartData.customer_name || 'Guest',
      customer_email: cartData.customer_email || null,
      cart_value: cartData.cart_total,
      items: cartData.cart_items,
      abandoned_at: new Date().toISOString(),
      recovery_token: token,
      token_expires_at: expiresAt.toISOString(),
      status: 'pending',
      recovered: false
    }).select().single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error marking cart abandoned:", error);
    return null;
  }
};

export const validateRecoveryToken = async (token) => {
  try {
    const { data, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('recovery_token', token)
      .single();

    if (error) throw error;
    if (!data) return { valid: false, reason: 'Token not found' };

    if (data.recovered) return { valid: false, reason: 'Cart already recovered' };
    
    if (new Date(data.token_expires_at) < new Date()) {
      return { valid: false, reason: 'Token expired' };
    }

    return { valid: true, cart: data };
  } catch (error) {
    console.error("Error validating token:", error);
    return { valid: false, reason: 'Database error' };
  }
};

export const markCartRecovered = async (cartId) => {
  try {
    const { error } = await supabase
      .from('abandoned_carts')
      .update({
        recovered: true,
        recovered_at: new Date().toISOString(),
        status: 'recovered'
      })
      .eq('id', cartId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking cart recovered:", error);
    return false;
  }
};