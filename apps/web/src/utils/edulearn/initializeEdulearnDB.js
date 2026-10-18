import { supabase } from '@/lib/customSupabaseClient';

/**
 * Initialize Edulearn database by calling the comprehensive initialization function
 * This function runs all steps: create tables, verify, populate data, setup RLS
 */
export async function initializeEdulearnDatabase() {
  console.log('🚀 Starting Edulearn Database Initialization...');

  try {
    // Call the database initialization function
    const { data, error } = await supabase.rpc('initialize_edulearn_database');

    if (error) {
      console.error('❌ Database initialization error:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }

    console.log('✅ Edulearn Database Initialized Successfully!');
    console.log('📊 Initialization Report:', data);

    return {
      success: true,
      data: data,
      message: 'Edulearn database initialized successfully'
    };

  } catch (error) {
    console.error('❌ Unexpected error during initialization:', error);
    return {
      success: false,
      error: error.message,
      details: error
    };
  }
}

/**
 * Verify database setup by calling the verification function
 */
export async function verifyEdulearnDatabase() {
  console.log('🔍 Verifying Edulearn Database Setup...');

  try {
    const { data, error } = await supabase.rpc('verify_edulearn_database');

    if (error) {
      console.error('❌ Verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    console.log('✅ Database Verification Complete');
    console.log('📋 Verification Report:', data);

    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('❌ Unexpected error during verification:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get detailed schema report for debugging
 */
export async function getSchemaReport() {
  try {
    // Check tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['resource_types', 'materials', 'download_logs', 'user_favorites']);

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
    }

    // Check resource types count
    const { count: resourceTypesCount } = await supabase
      .from('resource_types')
      .select('*', { count: 'exact', head: true });

    // Check materials count
    const { count: materialsCount } = await supabase
      .from('materials')
      .select('*', { count: 'exact', head: true });

    return {
      success: true,
      tables: tables || [],
      counts: {
        resource_types: resourceTypesCount || 0,
        materials: materialsCount || 0
      }
    };

  } catch (error) {
    console.error('Error getting schema report:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  initializeEdulearnDatabase,
  verifyEdulearnDatabase,
  getSchemaReport
};