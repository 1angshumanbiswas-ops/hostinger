import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // In a real scenario, we would use Deno.env.get("OPENAI_API_KEY") etc.
    // and make actual API calls. For this mock, we simulate generation.
    
    const mockRecommendations = [
      {
        asset_name: "AAPL",
        type: "stock",
        reasoning: "Strong quarterly earnings and positive tech sector momentum indicate upward trend.",
        confidence_score: 85,
        risk_level: "medium",
        entry_price: 175.50,
        target_price: 190.00
      },
      {
        asset_name: "BTC/USD",
        type: "crypto",
        reasoning: "Recent halving and institutional adoption driving scarcity.",
        confidence_score: 72,
        risk_level: "high",
        entry_price: 64000,
        target_price: 70000
      }
    ];

    return new Response(JSON.stringify({ 
      success: true, 
      recommendations_generated: mockRecommendations.length,
      data: mockRecommendations
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});