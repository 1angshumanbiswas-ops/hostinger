import { corsHeaders } from "./cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Edge functions run in Deno, so we use Deno.env to access Supabase secrets safely
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const requestData = await req.json();
    const { email, password } = requestData;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // 1. Create user with admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'superadmin' }
    });

    if (authError) {
      throw authError;
    }

    const user = authData.user;

    // 2. Insert record into public.superadmins table
    const { error: dbError } = await supabaseAdmin
      .from('superadmins')
      .upsert({ 
        id: user.id, 
        email: user.email, 
        created_at: new Date().toISOString() 
      }, { onConflict: 'id' });

    if (dbError) {
      throw new Error(`User created but failed to add to superadmins table: ${dbError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Superadmin created",
      user_id: user.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error("Superadmin creation error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "An unknown error occurred" 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});