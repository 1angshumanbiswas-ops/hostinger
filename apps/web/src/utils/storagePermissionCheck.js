import { supabase } from '@/lib/customSupabaseClient';

const PORTFOLIO_BUCKET = 'portfolio';

/**
 * Check if the user has write permissions to the portfolio bucket
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<{allowed: boolean, error?: string}>}
 */
export const checkStoragePermissions = async (userId) => {
  try {
    if (!userId) {
      return { 
        allowed: false, 
        error: 'User not authenticated. Please log in to upload files.' 
      };
    }

    // Attempt to check bucket existence and permissions
    // We'll do this by trying to list files in the user's folder
    const testPath = `cvs/${userId}/`;
    
    const { data, error } = await supabase.storage
      .from(PORTFOLIO_BUCKET)
      .list(testPath, {
        limit: 1
      });

    if (error) {
      // Check for RLS policy violations
      if (
        error.message?.toLowerCase().includes('row-level security') ||
        error.message?.toLowerCase().includes('policy') ||
        error.message?.toLowerCase().includes('permission denied') ||
        error.statusCode === 401 ||
        error.statusCode === 403
      ) {
        return {
          allowed: false,
          error: 'Storage permissions not configured. Please contact support to enable CV uploads.'
        };
      }

      // Check for bucket not found
      if (error.statusCode === 404 || error.message?.toLowerCase().includes('bucket')) {
        return {
          allowed: false,
          error: 'Storage bucket not available. Please contact support.'
        };
      }

      // Other errors
      return {
        allowed: false,
        error: 'Unable to verify storage permissions. Please try again later.'
      };
    }

    // If we can list files (even if empty), permissions are likely OK
    return { allowed: true };
  } catch (error) {
    console.error('❌ Error checking storage permissions:', error);
    return {
      allowed: false,
      error: 'Unable to verify storage permissions. Please try again later.'
    };
  }
};

/**
 * Get user-friendly error message based on error type
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getStorageErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  const errorMessage = error.message || error.toString();

  // RLS policy violations
  if (
    errorMessage.toLowerCase().includes('row-level security') ||
    errorMessage.toLowerCase().includes('policy') ||
    errorMessage.toLowerCase().includes('permission denied')
  ) {
    return 'Storage permissions not configured. Please contact support to enable CV uploads.';
  }

  // Authentication errors
  if (error.statusCode === 401 || error.statusCode === 403) {
    return 'Authentication required. Please log in to upload files.';
  }

  // Bucket not found
  if (error.statusCode === 404 || errorMessage.toLowerCase().includes('bucket')) {
    return 'Storage bucket not available. Please contact support.';
  }

  // Network errors
  if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  // File size/type errors
  if (errorMessage.toLowerCase().includes('size') || errorMessage.toLowerCase().includes('type')) {
    return errorMessage;
  }

  // Generic fallback
  return 'Failed to upload file. Please try again or contact support if the issue persists.';
};