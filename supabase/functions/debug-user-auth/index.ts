import { corsHeaders } from "./cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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

    const targetEmail = "1angshuman.biswas@gmail.com";
    const targetPassword = "Superadmin@123";

    let user_exists = false;
    let user_id = null;
    let email_confirmed = false;
    let password_set = false;
    let superadmin_created = false;
    let error_message = null;

    // 1. Query auth.users table
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      throw new Error(`Failed to list users: ${usersError.message}`);
    }

    let user = usersData.users.find(u => u.email === targetEmail);

    if (user) {
      // User exists, log status
      user_exists = true;
      user_id = user.id;
      email_confirmed = !!user.email_confirmed_at;
      password_set = !!user.encrypted_password; // In some Supabase versions this isn't exposed, but we check truthiness
      
      // Update user just to be sure password is correct and email is confirmed
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: targetPassword,
        email_confirm: true,
        user_metadata: { role: 'superadmin' }
      });
      
      if (updateError) {
        error_message = `Failed to update existing user: ${updateError.message}`;
      } else {
        email_confirmed = true;
        password_set = true;
      }
    } else {
      // 3. Create user
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: targetEmail,
        password: targetPassword,
        email_confirm: true,
        user_metadata: { role: 'superadmin' }
      });

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      user_exists = true;
      user_id = createData.user.id;
      email_confirmed = true;
      password_set = true;
    }

    // 4. Insert into public.superadmins
    if (user_id) {
      const { error: dbError } = await supabaseAdmin
        .from('superadmins')
        .upsert([{ email: targetEmail }], { onConflict: 'email' });

      if (dbError) {
        error_message = (error_message ? error_message + " | " : "") + `Failed to insert superadmin record: ${dbError.message}`;
      } else {
        superadmin_created = true;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: !error_message,
        user_exists,
        user_id,
        email_confirmed,
        password_set,
        superadmin_created,
        error_message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error_message: error.message || "Unknown error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});