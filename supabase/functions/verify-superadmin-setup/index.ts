import { corsHeaders } from "./cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      throw new Error("Email is required for verification");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 1. Check if user exists in auth.users
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    const user = usersData.users.find(u => u.email === email);

    if (!user) {
      return new Response(
        JSON.stringify({ 
          exists: false, 
          verified: false,
          error: "User not found in auth.users" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const isEmailConfirmed = !!user.email_confirmed_at;

    // 2. Ensure record exists in superadmins table
    const { data: superadminData, error: superadminError } = await supabaseAdmin
      .from('superadmins')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!superadminData) {
      await supabaseAdmin.from('superadmins').insert([{ email }]);
    }

    return new Response(
      JSON.stringify({ 
        exists: true, 
        verified: isEmailConfirmed, 
        user_id: user.id,
        email_confirmed_at: user.email_confirmed_at,
        in_superadmins_table: true
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ exists: false, verified: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});