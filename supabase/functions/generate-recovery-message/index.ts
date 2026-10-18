import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const { customer_id, ltv, is_new_customer } = await req.json();
    let message = "Hi! Looks like you left something behind.";
    let discount = 0;
    
    if (ltv > 500) {
      message = "Hi VIP! Come back and get 10% off your cart.";
      discount = 10;
    } else if (is_new_customer) {
      message = "Welcome! Complete your first order with Free Shipping.";
      discount = 0;
    }
    
    return new Response(JSON.stringify({ success: true, message, discount }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 
    });
  }
});