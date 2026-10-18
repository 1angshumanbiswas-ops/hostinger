import { corsHeaders } from "./cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('VITE_SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables (URL or SERVICE_ROLE_KEY).");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const targetEmail = "1angshuman.biswas@gmail.com";
    
    // 1. Find existing user
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;
    
    const existingUser = usersData.users.find(u => u.email === targetEmail);
    
    // 2. Delete if exists
    if (existingUser) {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      if (deleteError) throw new Error(`Failed to delete existing user: ${deleteError.message}`);
    }

    // 3. Create new user with confirmed email and metadata
    const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: targetEmail,
      password: "Superadmin@123",
      email_confirm: true,
      user_metadata: { role: "superadmin" }
    });

    if (createError) throw new Error(`Failed to create user: ${createError.message}`);

    // Optional: Ensure they are in the superadmins table
    if (newUserData?.user) {
      const { error: upsertError } = await supabaseAdmin
        .from('superadmins')
        .upsert({ email: targetEmail }, { onConflict: 'email' });
        
      if (upsertError) {
        console.warn("Failed to upsert to superadmins table:", upsertError);
      }
    }

    // 5. Return response
    return new Response(JSON.stringify({
      success: true,
      message: "Superadmin user created/updated successfully",
      user_id: newUserData.user.id,
      email: newUserData.user.email
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});