import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const { product_id, price_bracket = 0.2 } = await req.json();
    // Mock alternative products
    const alternatives = [
      { id: "alt-1", name: "Alternative 1", price: 99.99, relevance_score: 0.95 },
      { id: "alt-2", name: "Alternative 2", price: 89.99, relevance_score: 0.88 },
      { id: "alt-3", name: "Alternative 3", price: 105.00, relevance_score: 0.82 }
    ];
    return new Response(JSON.stringify({ success: true, product_id, alternatives }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 
    });
  }
});