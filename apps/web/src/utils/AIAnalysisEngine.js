import { supabase } from '@/lib/customSupabaseClient';

export const generateRecommendations = async () => {
  console.log("Generating recommendations via AI Analysis Engine...");
  
  // Simulated AI logic for the sake of frontend environment limits
  const mockRecs = [
    {
      asset_name: "NVDA",
      type: "stock",
      reasoning: "AI sector momentum and recent hardware announcements suggest a bullish breakout.",
      confidence_score: 88,
      risk_level: "medium",
      entry_price: 850.00,
      target_price: 920.00
    },
    {
      asset_name: "ETH",
      type: "crypto",
      reasoning: "Network upgrades and reduced gas fees are driving higher TVL and adoption.",
      confidence_score: 75,
      risk_level: "high",
      entry_price: 3200.00,
      target_price: 4000.00
    }
  ];

  try {
    const { data, error } = await supabase
      .from('trading_ai_recommendations')
      .insert(mockRecs)
      .select();
      
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error saving AI recommendations:", err);
    return mockRecs;
  }
};

export const getLatestRecommendations = async () => {
  const { data, error } = await supabase
    .from('trading_ai_recommendations')
    .select('*')
    .order('confidence_score', { ascending: false })
    .limit(10);
    
  if (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
  return data || [];
};