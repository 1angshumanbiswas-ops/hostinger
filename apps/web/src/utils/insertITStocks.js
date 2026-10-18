import { supabase } from '@/lib/customSupabaseClient';

export async function insertITStocksViaEdgeFunction() {
  try {
    console.log('Calling insert-it-stocks edge function...');
    
    const { data, error } = await supabase.functions.invoke('insert-it-stocks', {
      body: JSON.stringify({})
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    console.log('IT stocks insertion response:', data);
    return data;
  } catch (err) {
    console.error('Failed to insert IT stocks:', err);
    throw err;
  }
}

export async function insertITStocksDirectly() {
  try {
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

    console.log('Step 1: Querying existing stocks in app_bse_stocks...');
    
    // Step 1: Get all existing stock symbols from the database
    const { data: existingStocks, error: queryError } = await supabase
      .from('app_bse_stocks')
      .select('symbol');

    if (queryError) {
      console.error('Error querying existing stocks:', queryError);
      throw queryError;
    }

    const existingSymbols = new Set((existingStocks || []).map(stock => stock.symbol));
    console.log('Existing stock symbols in database:', Array.from(existingSymbols));

    // Step 2: Filter out stocks that already exist
    const newStocksToInsert = itStocks.filter(stock => !existingSymbols.has(stock.symbol));
    const skippedStocks = itStocks.filter(stock => existingSymbols.has(stock.symbol));

    console.log(`Found ${newStocksToInsert.length} new stocks to insert`);
    console.log(`Skipping ${skippedStocks.length} stocks that already exist:`, skippedStocks.map(s => s.symbol));

    // Handle case where there are no new stocks to insert
    if (newStocksToInsert.length === 0) {
      console.log('No new IT stocks to insert - all stocks already exist in database');
      return {
        success: true,
        inserted: 0,
        skipped: skippedStocks.length,
        skippedSymbols: skippedStocks.map(s => s.symbol),
        errors: [],
        message: 'All IT stocks already exist in database'
      };
    }

    // Step 3: Insert only the new stocks (no UPSERT, no ON CONFLICT)
    console.log('Step 2: Inserting new stocks:', newStocksToInsert.map(s => s.symbol));
    
    const { data: insertedData, error: insertError } = await supabase
      .from('app_bse_stocks')
      .insert(newStocksToInsert)
      .select();

    if (insertError) {
      console.error('Supabase insertion error:', insertError);
      return {
        success: false,
        inserted: 0,
        skipped: skippedStocks.length,
        skippedSymbols: skippedStocks.map(s => s.symbol),
        errors: [insertError.message],
        message: `Failed to insert IT stocks: ${insertError.message}`
      };
    }

    console.log('Successfully inserted IT stocks:', insertedData);
    
    return {
      success: true,
      inserted: insertedData?.length || newStocksToInsert.length,
      skipped: skippedStocks.length,
      insertedSymbols: (insertedData || newStocksToInsert).map(s => s.symbol),
      skippedSymbols: skippedStocks.map(s => s.symbol),
      errors: [],
      data: insertedData,
      message: `Successfully inserted ${insertedData?.length || newStocksToInsert.length} new IT stocks. Skipped ${skippedStocks.length} existing stocks.`
    };

  } catch (err) {
    console.error('Failed to insert IT stocks directly:', err);
    return {
      success: false,
      inserted: 0,
      skipped: 0,
      errors: [err.message || err.toString()],
      message: `Unexpected error: ${err.message || err.toString()}`
    };
  }
}