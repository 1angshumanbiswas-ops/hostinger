import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    // 1. Fetch Market Data & News (Simulating local orchestration)
    // Normally we'd use fetch() to call the other edge functions or shared logic
    
    // 2. Analyze with Hugging Face (Simulated output)
    const mockRecs = [
      {
        asset_type: "stock",
        recommendation: "NVDA showing strong support at current levels.",
        confidence: 90,
        risk_level: "medium",
        entry_price: 850.00,
        target_price: 950.00
      }
    ];

    // 3. Store in trading_ai_recommendations
    const res = await fetch(`${supabaseUrl}/rest/v1/trading_ai_recommendations`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(mockRecs)
    });

    if (!res.ok) throw new Error("Failed to insert recommendations");

    return new Response(JSON.stringify({ success: true, message: "Analysis completed" }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error("Hourly Analysis Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});