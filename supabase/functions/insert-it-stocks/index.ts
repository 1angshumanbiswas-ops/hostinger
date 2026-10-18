import { corsHeaders } from "./cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const currentTimestamp = new Date().toISOString();

    const itStocks = [
      {
        symbol: 'TCS',
        company_name: 'Tata Consultancy Services',
        sector: 'IT',
        current_price: 3500,
        change_percent: 2.5,
        week_52_high: 3850,
        week_52_low: 2950,
        market_cap: 14500000000000,
        pe_ratio: 28,
        volume: 2500000,
        last_updated: currentTimestamp
      },
      {
        symbol: 'INFY',
        company_name: 'Infosys',
        sector: 'IT',
        current_price: 1800,
        change_percent: -1.2,
        week_52_high: 2100,
        week_52_low: 1550,
        market_cap: 7500000000000,
        pe_ratio: 32,
        volume: 3200000,
        last_updated: currentTimestamp
      },
      {
        symbol: 'WIPRO',
        company_name: 'Wipro',
        sector: 'IT',
        current_price: 600,
        change_percent: 0.8,
        week_52_high: 750,
        week_52_low: 480,
        market_cap: 3200000000000,
        pe_ratio: 25,
        volume: 4100000,
        last_updated: currentTimestamp
      },
      {
        symbol: 'HCLTECH',
        company_name: 'HCL Technologies',
        sector: 'IT',
        current_price: 1200,
        change_percent: 1.5,
        week_52_high: 1450,
        week_52_low: 950,
        market_cap: 3800000000000,
        pe_ratio: 30,
        volume: 2800000,
        last_updated: currentTimestamp
      },
      {
        symbol: 'TECHM',
        company_name: 'Tech Mahindra',
        sector: 'IT',
        current_price: 1100,
        change_percent: -0.5,
        week_52_high: 1350,
        week_52_low: 850,
        market_cap: 2900000000000,
        pe_ratio: 26,
        volume: 2200000,
        last_updated: currentTimestamp
      }
    ];

    console.log('Attempting to insert IT stocks:', itStocks);

    const { data, error } = await supabase
      .from('app_bse_stocks')
      .upsert(itStocks, { onConflict: 'symbol' })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Successfully inserted/updated IT stocks:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '5 IT sector stocks inserted successfully',
        inserted_count: data?.length || 5,
        stocks: data
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in insert-it-stocks function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});