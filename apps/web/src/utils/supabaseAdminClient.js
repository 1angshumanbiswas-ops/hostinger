/**
 * ⚠️ WARNING: This file is for Edge Functions ONLY. Do NOT import this in browser code. 
 * Use import.meta.env for browser-safe environment variables.
 * 
 * Exposing the SERVICE_ROLE_KEY in the browser gives full database access, bypassing Row Level Security (RLS).
 */

import { createClient } from '@supabase/supabase-js';

const getAdminClient = () => {
  // Using import.meta.env as requested. Note: Exposing VITE_SUPABASE_SERVICE_ROLE_KEY 
  // is extremely dangerous for frontend applications as it gets bundled into the client build.
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Missing Supabase URL or Service Role Key for admin client.");
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const supabaseAdmin = getAdminClient();

/**
 * Helper function to create a superadmin user.
 * Must be executed server-side.
 */
export const createSuperadminUser = async (email, password) => {
  if (!supabaseAdmin) throw new Error("Admin client not initialized");

  // 1. Create the user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'superadmin' }
  });

  if (authError) throw authError;

  const user = authData.user;

  // 2. Insert into public.superadmins
  const { error: dbError } = await supabaseAdmin
    .from('superadmins')
    .upsert({ 
      id: user.id, 
      email: user.email, 
      created_at: new Date().toISOString() 
    }, { onConflict: 'id' });

  if (dbError) throw dbError;

  return user;
};