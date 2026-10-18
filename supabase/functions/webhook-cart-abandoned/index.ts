import { corsHeaders } from "./cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    const { customer_id, cart_id, cart_value, cart_items, customer_email, customer_phone, customer_ltv } = payload;

    const workflow_id = `wf_${Date.now()}`;

    // 1. Log to workflow_logs
    await supabase.from('workflow_logs').insert({
      workflow_id,
      step_name: 'webhook_trigger',
      status: 'success',
      input: payload,
    });

    // 2. Store event
    await supabase.from('cart_abandonment_events_v2').insert({
      customer_id: customer_id || null,
      cart_id,
      cart_value,
      cart_items,
      trigger_timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, workflow_id, message: "Cart abandonment event received and logged." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});