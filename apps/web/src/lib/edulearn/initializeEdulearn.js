import { supabase } from '@/lib/customSupabaseClient';

/**
 * Initialize and verify Edulearn database setup - simplified version
 */
export async function initializeEdulearn() {
  console.log('🚀 Initializing Edulearn database...');

  try {
    // Check if classes table is accessible
    const { error: classesError } = await supabase
      .from('classes')
      .select('id')
      .limit(1);

    if (classesError) {
      console.error('❌ Classes table check failed:', classesError.message);
      return {
        success: false,
        message: `Database error: ${classesError.message}`,
        step: 'error'
      };
    }

    // Check if subjects table is accessible
    const { error: subjectsError } = await supabase
      .from('subjects')
      .select('id')
      .limit(1);

    if (subjectsError) {
      console.error('❌ Subjects table check failed:', subjectsError.message);
      return {
        success: false,
        message: `Database error: ${subjectsError.message}`,
        step: 'error'
      };
    }

    // Check if resource_types table is accessible
    const { error: resourceTypesError } = await supabase
      .from('resource_types')
      .select('id')
      .limit(1);

    if (resourceTypesError) {
      console.error('❌ Resource types table check failed:', resourceTypesError.message);
      return {
        success: false,
        message: `Database error: ${resourceTypesError.message}`,
        step: 'error'
      };
    }

    // Check if materials table is accessible
    const { error: materialsError } = await supabase
      .from('materials')
      .select('id')
      .limit(1);

    if (materialsError) {
      console.error('❌ Materials table check failed:', materialsError.message);
      return {
        success: false,
        message: `Database error: ${materialsError.message}`,
        step: 'error'
      };
    }

    console.log('✅ Edulearn database initialized successfully!');
    return {
      success: true,
      message: 'Edulearn database is ready',
      step: 'ready'
    };

  } catch (error) {
    console.error('❌ Error initializing Edulearn:', error);
    return {
      success: false,
      message: `Initialization error: ${error.message}`,
      step: 'error'
    };
  }
}

export default initializeEdulearn;