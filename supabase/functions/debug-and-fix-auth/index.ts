import { corsHeaders } from "./cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    let requestData = {};
    try {
      requestData = await req.json();
    } catch (e) {
      // Ignore if no JSON body
    }

    const email = requestData.email || '1angshuman.biswas@gmail.com';
    const password = requestData.password || 'Superadmin@123';

    // Check if user exists using admin list API
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    let user = users.find(u => u.email === email);
    let message = '';

    if (user) {
      // Update existing user
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: password,
        email_confirm: true,
        user_metadata: { role: 'superadmin' }
      });
      if (error) throw error;
      user = data.user;
      message = 'User found and updated successfully (password reset & email confirmed)';
    } else {
      // Create new user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { role: 'superadmin' }
      });
      if (error) throw error;
      user = data.user;
      message = 'New user created successfully and email confirmed';
    }

    // Insert/upsert into public.superadmins
    const { error: dbError } = await supabaseAdmin
      .from('superadmins')
      .upsert({ 
        id: user.id, 
        email: user.email, 
        created_at: new Date().toISOString() 
      }, { onConflict: 'id' });

    if (dbError) {
      // Fallback if the unique constraint is on email instead of id, or table doesn't have unique constraint
      console.error("Upsert by ID failed, trying by email or insert...", dbError.message);
      const { error: insertError } = await supabaseAdmin
        .from('superadmins')
        .insert({ id: user.id, email: user.email, created_at: new Date().toISOString() });
      
      if (insertError && !insertError.message.includes('duplicate')) {
         throw insertError;
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message, 
      user_id: user.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error' 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});