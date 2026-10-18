import { supabase } from '@/lib/customSupabaseClient';

/**
 * Comprehensive database verification for Edulearn
 */
export async function verifyDatabaseSetup() {
  console.log('🔍 Starting Edulearn Database Verification...');

  try {
    // Call the verification function
    const { data, error } = await supabase.rpc('verify_edulearn_database');

    if (error) {
      console.error('❌ Verification function error:', error);
      return {
        isReady: false,
        message: `Verification error: ${error.message}`,
        error: error.message
      };
    }

    console.log('📊 Verification Results:', data);

    // Check if all tables exist
    const allTablesExist = 
      data.tables?.resource_types &&
      data.tables?.materials &&
      data.tables?.download_logs &&
      data.tables?.user_favorites &&
      data.tables?.classes &&
      data.tables?.subjects;

    // Check if all columns exist
    const allColumnsExist =
      data.columns?.classes_class_number &&
      data.columns?.classes_description &&
      data.columns?.subjects_description;

    // Check if RLS is enabled on all tables
    const allRLSEnabled =
      data.rls?.resource_types &&
      data.rls?.materials &&
      data.rls?.download_logs &&
      data.rls?.user_favorites;

    // Check if data is populated
    const dataPopulated =
      data.data_counts?.resource_types >= 8 &&
      data.data_counts?.classes >= 7;

    const isReady = allTablesExist && allColumnsExist && allRLSEnabled && dataPopulated;

    return {
      isReady,
      tables: data.tables || {},
      columns: data.columns || {},
      rls: data.rls || {},
      dataCounts: data.data_counts || {},
      message: isReady 
        ? '✅ All Edulearn database components are ready' 
        : '⚠️ Some database components are missing or incomplete',
      details: data
    };

  } catch (error) {
    console.error('❌ Verification error:', error);
    return {
      isReady: false,
      message: `Verification error: ${error.message}`,
      error: error.message
    };
  }
}

/**
 * Quick health check for database readiness
 */
export async function quickHealthCheck() {
  try {
    // Test basic table access
    const { error: resourceTypesError } = await supabase
      .from('resource_types')
      .select('id')
      .limit(1);

    const { error: materialsError } = await supabase
      .from('materials')
      .select('id')
      .limit(1);

    const errors = [];
    if (resourceTypesError) errors.push(`resource_types: ${resourceTypesError.message}`);
    if (materialsError) errors.push(`materials: ${materialsError.message}`);

    return {
      healthy: errors.length === 0,
      timestamp: new Date().toISOString(),
      errors
    };
  } catch (err) {
    return {
      healthy: false,
      timestamp: new Date().toISOString(),
      errors: [err.message]
    };
  }
}

/**
 * Get data counts from all tables
 */
export async function getDataCounts() {
  try {
    const [
      { count: resourceTypesCount },
      { count: materialsCount },
      { count: classesCount },
      { count: subjectsCount }
    ] = await Promise.all([
      supabase.from('resource_types').select('*', { count: 'exact', head: true }),
      supabase.from('materials').select('*', { count: 'exact', head: true }),
      supabase.from('classes').select('*', { count: 'exact', head: true }),
      supabase.from('subjects').select('*', { count: 'exact', head: true })
    ]);

    return {
      success: true,
      counts: {
        resource_types: resourceTypesCount || 0,
        materials: materialsCount || 0,
        classes: classesCount || 0,
        subjects: subjectsCount || 0
      }
    };
  } catch (error) {
    console.error('Error getting data counts:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  verifyDatabaseSetup,
  quickHealthCheck,
  getDataCounts
};