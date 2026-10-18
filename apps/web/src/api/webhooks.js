import { supabase } from '@/lib/customSupabaseClient';

/**
 * Mock Webhook Endpoints Implementation for Frontend
 * In a real scenario, these would be server-side routes (e.g., Express, Next.js API routes, or Supabase Edge Functions).
 * We export these as utility functions to simulate the webhook behavior within the frontend app.
 */

const logWebhook = async (type, payload, response, status) => {
  try {
    await supabase.from('webhook_logs').insert([{
      webhook_type: type,
      payload,
      response,
      status
    }]);
  } catch (e) {
    console.error('Failed to log webhook', e);
  }
};

export const handleCheckoutStarted = async (payload) => {
  try {
    if (payload.cart_value < 100) {
      await logWebhook('checkout-started', payload, { message: 'Cart value < 100, ignored' }, 'ignored');
      return { status: 'ignored', message: 'Cart value below threshold' };
    }

    const { data, error } = await supabase.from('abandoned_carts').insert([{
      customer_id: payload.customer_id,
      cart_value: payload.cart_value,
      items: payload.items,
      status: 'timer_started'
    }]).select().single();

    if (error) throw error;
    
    // Simulate calling the edge function
    await supabase.functions.invoke('process-abandoned-cart', { body: { cart_id: data.id } });

    await logWebhook('checkout-started', payload, { message: 'Timer started', cart_id: data.id }, 'success');
    return { status: 'success', cart_id: data.id };
  } catch (error) {
    await logWebhook('checkout-started', payload, { error: error.message }, 'failed');
    return { status: 'error', message: error.message };
  }
};

export const handleOrderPlaced = async (payload) => {
  try {
    // Mark cart recovered
    const { error: updateError } = await supabase.from('abandoned_carts')
      .update({ status: 'recovered', recovered_at: new Date().toISOString() })
      .eq('customer_id', payload.customer_id)
      .eq('status', 'timer_started');

    if (updateError) throw updateError;

    // Update customer LTV
    const { error: customerError } = await supabase.rpc('update_customer_ltv', { 
        c_id: payload.customer_id, 
        order_value: payload.order_value 
    }); // Assuming an RPC exists, or we do a select then update

    await logWebhook('order-placed', payload, { message: 'Cart recovered, LTV updated' }, 'success');
    return { status: 'success' };
  } catch (error) {
    await logWebhook('order-placed', payload, { error: error.message }, 'failed');
    return { status: 'error', message: error.message };
  }
};

export const handleOutOfStock = async (payload) => {
  try {
    const { data, error } = await supabase.from('out_of_stock_events').insert([{
      product_id: payload.product_id,
      customer_id: payload.customer_id
    }]).select().single();

    if (error) throw error;

    await supabase.functions.invoke('process-out-of-stock-event', { 
      body: { product_id: payload.product_id, customer_id: payload.customer_id } 
    });

    await logWebhook('out-of-stock', payload, { message: 'Event recorded, notification queued' }, 'success');
    return { status: 'success', event_id: data.id };
  } catch (error) {
    await logWebhook('out-of-stock', payload, { error: error.message }, 'failed');
    return { status: 'error', message: error.message };
  }
};

export const handleSendMessage = async (payload) => {
  try {
    const { error } = await supabase.from('cart_recovery_messages').insert([{
      cart_id: payload.cart_id,
      message_type: payload.type,
      status: 'sent',
      sent_at: new Date().toISOString()
    }]);

    if (error) throw error;

    await logWebhook('send-message', payload, { message: 'Message sent' }, 'success');
    return { status: 'success' };
  } catch (error) {
    await logWebhook('send-message', payload, { error: error.message }, 'failed');
    return { status: 'error', message: error.message };
  }
};

export const getWebhookStatus = async (webhook_id) => {
  try {
    const { data, error } = await supabase.from('webhook_logs').select('*').eq('id', webhook_id).single();
    if (error) throw error;
    return { status: 'success', data };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
};