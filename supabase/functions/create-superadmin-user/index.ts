import { corsHeaders } from "./cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password, metadata = {} } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Email and password are required" }),
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

    // Create user in auth.users via Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { ...metadata, role: 'superadmin' }
    });

    if (authError) {
      // Handle case where user might already exist
      if (authError.message.includes("already been registered") || authError.message.includes("already exists")) {
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers?.users?.find(u => u.email === email);
        
        if (existingUser) {
          // Update the user to ensure it's confirmed and password is set correctly
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: password,
            email_confirm: true,
            user_metadata: { ...metadata, role: 'superadmin' }
          });
          
          if (updateError) {
            throw updateError;
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              user_id: existingUser.id, 
              message: "User already existed and was updated successfully." 
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
          );
        }
      }
      throw authError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user_id: authData?.user?.id, 
        message: "Superadmin user successfully created." 
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