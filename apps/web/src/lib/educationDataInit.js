import { initializeEdulearnDatabase } from '@/utils/edulearn/initializeEdulearnDB';

/**
 * Initialize Edulearn database - calls comprehensive initialization function
 * CRITICAL: This only initializes education-related data, NOT cv_uploads or portfolio tables
 */
export const initializeEducationData = async () => {
  console.log("🚀 Starting Edulearn Database Initialization...");

  try {
    // Call the comprehensive initialization function
    const result = await initializeEdulearnDatabase();

    if (!result.success) {
      console.error("❌ Edulearn initialization failed:", result.error);
      return {
        success: false,
        error: result.error,
        details: result.details
      };
    }

    console.log("✅ Edulearn Database is ready!");
    console.log("📊 Summary:", result.data?.summary);
    
    return {
      success: true,
      message: 'Edulearn database initialized successfully',
      data: result.data
    };

  } catch (error) {
    console.error("❌ Error during Edulearn initialization:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default initializeEducationData;