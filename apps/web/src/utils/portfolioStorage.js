import { supabase } from '@/lib/customSupabaseClient';
import { isValidUUID } from '@/utils/uuidValidator';

const PORTFOLIO_BUCKET = 'portfolio';

/**
 * Upload a CV file to the portfolio bucket
 * Stores metadata in cv_uploads database table instead of storage metadata
 */
export const uploadCVFile = async (file, userId) => {
  try {
    if (!file || !userId) {
      throw new Error('File and userId are required');
    }

    // Validate UUID format before proceeding
    if (!isValidUUID(userId)) {
      throw new Error('Invalid user ID format. Cannot upload CV.');
    }

    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `cv-${userId}-${timestamp}.${fileExt}`;
    const filePath = `cvs/${userId}/${fileName}`;

    // Upload file to storage WITHOUT metadata to avoid RLS conflicts
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      // Check if error is related to missing bucket
      if (uploadError.message?.includes('bucket') || uploadError.statusCode === 404) {
        throw new Error('Storage bucket not available. Please contact support.');
      }
      
      throw uploadError;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(PORTFOLIO_BUCKET)
      .getPublicUrl(filePath);

    // Insert metadata into cv_uploads table (this is where all metadata is stored)
    const { data: dbData, error: dbError } = await supabase
      .from('cv_uploads')
      .insert({
        user_id: userId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        public_url: publicUrlData.publicUrl,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage.from(PORTFOLIO_BUCKET).remove([filePath]);
      throw dbError;
    }

    return {
      success: true,
      data: dbData,
      publicUrl: publicUrlData.publicUrl
    };
  } catch (error) {
    console.error('❌ Error uploading CV:', error);
    return {
      success: false,
      error: error.message || error || 'Failed to upload CV'
    };
  }
};

/**
 * Download a CV file from storage
 */
export const downloadCVFile = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error('File path is required');
    }

    const { data, error } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .download(filePath);

    if (error) {
      // Check if error is related to missing bucket
      if (error.message?.includes('bucket') || error.statusCode === 404) {
        throw new Error('Storage bucket not available. Please contact support.');
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('❌ Error downloading CV:', error);
    return {
      success: false,
      error: error.message || 'Failed to download CV'
    };
  }
};

/**
 * Delete a CV file from both storage and database
 */
export const deleteCVFile = async (cvId, filePath) => {
  try {
    if (!cvId || !filePath) {
      throw new Error('CV ID and file path are required');
    }

    // Delete from storage first
    const { error: storageError } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .remove([filePath]);

    if (storageError) {
      // Check if error is related to missing bucket
      if (storageError.message?.includes('bucket') || storageError.statusCode === 404) {
        console.warn('Warning: Storage bucket not available, skipping file deletion');
      } else {
        console.warn('Warning: Storage deletion failed:', storageError);
      }
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('cv_uploads')
      .delete()
      .eq('id', cvId);

    if (dbError) throw dbError;

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting CV:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete CV'
    };
  }
};

/**
 * Fetch user's CV uploads
 * @param {string} userId - The user ID to fetch CVs for
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const fetchUserCVs = async (userId) => {
  try {
    if (!userId) {
      console.warn('⚠️ fetchUserCVs: User ID is missing');
      return { success: true, data: [] };
    }

    // Validate UUID format before querying database
    if (!isValidUUID(userId)) {
      console.warn('⚠️ fetchUserCVs: Invalid user ID format, skipping database query:', userId);
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from('cv_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('❌ Error fetching CVs:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch CVs',
      data: []
    };
  }
};

/**
 * Fetch the latest CV for a specific user
 * @param {string} userId - The user ID to fetch CV for
 * @returns {Promise<{success: boolean, data?: Object|null, error?: string}>}
 */
export const fetchLatestCV = async (userId) => {
  try {
    // Critical validation: Check if userId exists
    if (!userId) {
      console.warn('⚠️ fetchLatestCV: No user ID provided, skipping database query');
      return {
        success: true,
        data: null
      };
    }

    // Critical validation: Check if userId is a valid UUID format
    if (!isValidUUID(userId)) {
      console.warn('⚠️ fetchLatestCV: Invalid user ID format, skipping database query:', userId);
      return {
        success: true,
        data: null
      };
    }

    // Only proceed with database query if userId is valid
    const { data, error } = await supabase
      .from('cv_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    return {
      success: true,
      data: data && data.length > 0 ? data[0] : null
    };
  } catch (error) {
    console.error('❌ Error fetching latest CV:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch latest CV',
      data: null
    };
  }
};