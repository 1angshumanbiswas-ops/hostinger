import { corsHeaders } from "./cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req) => {
  console.log("=== init-superadmin function invoked ===");
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    console.log(`Supabase URL configured: ${!!supabaseUrl}`);
    console.log(`Service Role Key configured: ${!!supabaseKey}`);

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, { 
      auth: { autoRefreshToken: false, persistSession: false } 
    });

    let requestData = {};
    try {
      requestData = await req.json();
      console.log("Request payload received successfully");
    } catch (e) {
      console.error("Failed to parse request JSON");
      throw new Error("Invalid request body");
    }

    const { email, password } = requestData;
    console.log(`Attempting to create superadmin: ${email}`);

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    console.log("Calling supabase.auth.admin.createUser()...");
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { role: 'superadmin' }
    });

    if (createError) {
      console.error("createUser error:", createError);
      throw createError;
    }

    const user = userData.user;
    console.log(`User created successfully with ID: ${user.id}`);

    console.log("Adding record to public.superadmins table...");
    const { error: dbError } = await supabaseAdmin
      .from('superadmins')
      .upsert({ 
        id: user.id, 
        email: user.email, 
        created_at: new Date().toISOString() 
      }, { onConflict: 'id' });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error(`User created but failed to add to superadmins table: ${dbError.message}`);
    }

    console.log("=== init-superadmin completed successfully ===");
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Superadmin user created", 
      user_id: user.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error("=== init-superadmin failed ===");
    console.error(error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred',
      details: error
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});