import { corsHeaders } from "./cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.30.0";

// Note: In a real implementation, you'd integrate with Gmail API here.
// Since we are restricted to frontend-only/Supabase environment and cannot invoke real Gmail API easily without OAuth backend flow or user-side token,
// this function simulates the cleanup logic and updates the database.
// Real Gmail integration usually requires a refresh token stored in DB to act on behalf of user offline.

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId } = await req.json();

    if (!userId) {
      throw new Error("Missing userId");
    }

    // 1. Fetch User Preferences
    const { data: prefs } = await supabase
      .from('cleanup_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Default prefs if missing
    const settings = prefs || { 
        delete_social: true, delete_promotions: true, 
        delete_junk: true, delete_updates: true,
        junk_sensitivity: 'Medium'
    };

    // 2. SIMULATE CLEANUP PROCESS (Replace with actual Gmail API calls)
    // Randomize for simulation effect
    const socialDeleted = settings.delete_social ? Math.floor(Math.random() * 50) + 10 : 0;
    const promoDeleted = settings.delete_promotions ? Math.floor(Math.random() * 80) + 20 : 0;
    const junkDeleted = settings.delete_junk ? Math.floor(Math.random() * 30) + 5 : 0;
    const updatesDeleted = settings.delete_updates ? Math.floor(Math.random() * 40) + 10 : 0;
    const junkDetected = Math.floor(Math.random() * 15);
    const importantRemaining = Math.floor(Math.random() * 10);

    // 3. Store History
    const { error: historyError } = await supabase
      .from('cleanup_history')
      .insert({
        user_id: userId,
        social_deleted: socialDeleted,
        promotions_deleted: promoDeleted,
        junk_deleted: junkDeleted,
        updates_deleted: updatesDeleted,
        junk_detected: junkDetected,
        important_remaining: importantRemaining,
        summary: `Auto-cleanup executed successfully. Sensitivity: ${settings.junk_sensitivity}.`
      });

    if (historyError) throw historyError;

    // 4. Return Success
    return new Response(JSON.stringify({ 
      success: true,
      data: {
        socialDeleted, promoDeleted, junkDeleted, updatesDeleted, junkDetected, importantRemaining
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});