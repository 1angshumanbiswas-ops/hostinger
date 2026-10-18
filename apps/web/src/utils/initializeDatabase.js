import { supabase } from '@/lib/customSupabaseClient';
import { SUPERADMIN_EMAIL } from '@/utils/superadminSetup';

/**
 * Initializes the database with required roles and permissions.
 * CRITICAL: This function does NOT create tables or RLS policies - those are managed by Supabase migrations.
 * It only ensures that ERP-related reference data exists.
 */
export const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');
    
    // 1. Ensure superadmin role exists in erp_roles
    const { data: roleData, error: roleCheckError } = await supabase
      .from('erp_roles')
      .select('id')
      .eq('name', 'superadmin')
      .maybeSingle();

    let roleId = roleData?.id;

    if (!roleId && !roleCheckError) {
      const { data: newRole, error: roleInsertError } = await supabase
        .from('erp_roles')
        .insert([{ name: 'superadmin', description: 'System Administrator with full access' }])
        .select('id')
        .single();
        
      if (!roleInsertError && newRole) {
        roleId = newRole.id;
        console.log('✅ Created superadmin role');
      } else if (roleInsertError) {
        console.error('Error creating superadmin role:', roleInsertError);
      }
    }

    // 2. Ensure 'all' permission exists in erp_permissions
    const { data: permData, error: permCheckError } = await supabase
      .from('erp_permissions')
      .select('id')
      .eq('name', 'all')
      .maybeSingle();

    let permId = permData?.id;

    if (!permId && !permCheckError) {
      const { data: newPerm, error: permInsertError } = await supabase
        .from('erp_permissions')
        .insert([{ name: 'all', description: 'Full system access' }])
        .select('id')
        .single();
        
      if (!permInsertError && newPerm) {
        permId = newPerm.id;
        console.log('✅ Created "all" permission');
      } else if (permInsertError) {
        console.error('Error creating "all" permission:', permInsertError);
      }
    }

    // 3. Link role and permission if both exist
    if (roleId && permId) {
      const { data: linkData, error: linkCheckError } = await supabase
        .from('erp_role_permissions')
        .select('*')
        .eq('role_id', roleId)
        .eq('permission_id', permId)
        .maybeSingle();
        
      if (!linkData && !linkCheckError) {
        const { error: linkInsertError } = await supabase
          .from('erp_role_permissions')
          .insert([{ role_id: roleId, permission_id: permId }]);
        
        if (linkInsertError) {
          console.error('Error linking role and permission:', linkInsertError);
        } else {
          console.log('✅ Linked superadmin role with "all" permission');
        }
      }
    }

    // 4. Verify Superadmin User Entry (Check if entry exists for the constant email)
    if (SUPERADMIN_EMAIL) {
      const { data: superadminExists } = await supabase
        .from('superadmins')
        .select('email')
        .ilike('email', SUPERADMIN_EMAIL.toLowerCase().trim())
        .maybeSingle();

      if (!superadminExists) {
        console.log(`ℹ️ Note: Superadmin entry for ${SUPERADMIN_EMAIL} not found in public.superadmins table. Ensure database migrations were run.`);
      } else {
        console.log('✅ Superadmin entry verified');
      }
    }

    console.log('✅ Database initialization check completed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return { success: false, error };
  }
};