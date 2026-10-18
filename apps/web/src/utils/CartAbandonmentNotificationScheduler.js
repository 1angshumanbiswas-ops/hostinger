import { supabase } from '@/lib/customSupabaseClient';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const processNotifications = async () => {
  try {
    // Get config
    const { data: config } = await supabase.from('cart_abandonment_config').select('*').single();
    if (!config || !config.notifications_enabled) return { processed: 0, disabled: true };

    const timeoutLimit = new Date(Date.now() - (config.timeout_minutes * 60000)).toISOString();

    // Fetch un-notified, abandoned carts
    const { data: cartsToNotify, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .is('notification_sent_at', null)
      .eq('recovered', false)
      .lt('abandoned_at', timeoutLimit)
      .limit(10);

    if (error) throw error;
    if (!cartsToNotify || cartsToNotify.length === 0) return { processed: 0 };

    let processedCount = 0;

    for (const cart of cartsToNotify) {
      let attempts = 0;
      let success = false;
      const maxRetries = config.max_retries || 3;
      const recoveryLink = `${window.location.origin}/recover-cart/${cart.recovery_token}`;

      while (attempts < maxRetries && !success) {
        attempts++;
        try {
          const { data, error: fnError } = await supabase.functions.invoke('send-cart-abandonment-email', {
            body: JSON.stringify({
              cartId: cart.id,
              customerName: cart.customer_name,
              customerEmail: cart.customer_email,
              cartItems: cart.items,
              cartTotal: cart.cart_value,
              recoveryLink,
              abandonedAt: cart.abandoned_at
            })
          });

          if (fnError || !data?.success) {
            throw new Error(fnError?.message || data?.error || 'Unknown edge function error');
          }

          // Mark as sent
          await supabase.from('abandoned_carts')
            .update({ notification_sent_at: new Date().toISOString() })
            .eq('id', cart.id);

          // Log success
          await supabase.from('debug_logs').insert({
            action: 'cart_abandonment_notification',
            status: 'success',
            platform: 'resend',
            details: { cartId: cart.id, attempts }
          });

          success = true;
          processedCount++;
        } catch (err) {
          console.error(`Attempt ${attempts} failed for cart ${cart.id}:`, err);
          if (attempts >= maxRetries) {
            await supabase.from('debug_logs').insert({
              action: 'cart_abandonment_notification',
              status: 'error',
              platform: 'resend',
              error_message: err.message,
              details: { cartId: cart.id }
            });
          } else {
            await sleep(Math.pow(2, attempts) * 1000); // Exponential backoff
          }
        }
      }
    }

    return { processed: processedCount };
  } catch (error) {
    console.error("Scheduler error:", error);
    return { error: error.message };
  }
};

// Expose a way to start/stop the poller if used globally
let pollerInterval = null;

export const startNotificationPoller = () => {
  if (pollerInterval) clearInterval(pollerInterval);
  // Run every 5 minutes
  pollerInterval = setInterval(processNotifications, 5 * 60 * 1000);
  console.log("Cart Abandonment Poller started.");
};

export const stopNotificationPoller = () => {
  if (pollerInterval) clearInterval(pollerInterval);
  console.log("Cart Abandonment Poller stopped.");
};