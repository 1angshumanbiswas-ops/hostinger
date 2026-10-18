import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Mocking financial news to avoid actual API rate limits and key requirements
    const news = [
      { title: "Tech Stocks Surge on AI Hopes", description: "Major tech companies see record gains...", sentiment: "positive", source: "Financial Times" },
      { title: "Crypto Markets Stabilize After Halving", description: "Bitcoin remains steady...", sentiment: "neutral", source: "CoinDesk" }
    ];

    return new Response(JSON.stringify({ success: true, news }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});