import { corsHeaders } from "./cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email = "1angshuman.biswas@gmail.com" } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
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

    // Create user in auth.users via Admin API without password
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: { role: 'superadmin' }
    });

    if (authError) {
      if (authError.message.includes("already been registered") || authError.message.includes("already exists")) {
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === email);
        
        if (existingUser) {
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            email_confirm: true,
            user_metadata: { role: 'superadmin' }
          });
          
          if (updateError) throw updateError;

          // Ensure in superadmins table
          await supabaseAdmin.from('superadmins').upsert([{ email }], { onConflict: 'email' });

          return new Response(
            JSON.stringify({ 
              success: true, 
              user_id: existingUser.id, 
              message: "User already existed and was updated for passwordless auth." 
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        }
      }
      throw authError;
    }

    // Insert into superadmins table
    const { error: dbError } = await supabaseAdmin
      .from('superadmins')
      .upsert([{ email }], { onConflict: 'email' });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: authData?.user?.id, 
        email_confirmed: true,
        message: "Superadmin passwordless user successfully created." 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || "An unexpected error occurred." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});