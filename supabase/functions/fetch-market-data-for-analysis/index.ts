import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Mocking consolidated market data from various sources due to API key restrictions
    const data = {
      stocks: [
        { symbol: "AAPL", price: 175.50, change_24h: 1.2, volume: 15000000 },
        { symbol: "TSLA", price: 195.20, change_24h: -2.1, volume: 22000000 }
      ],
      crypto: [
        { symbol: "BTC", price: 64000, change_24h: 3.5, volume: 45000000000 },
        { symbol: "ETH", price: 3400, change_24h: 2.1, volume: 15000000000 }
      ]
    };

    return new Response(JSON.stringify({ success: true, data }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});