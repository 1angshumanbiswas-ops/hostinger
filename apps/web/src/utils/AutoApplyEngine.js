import { supabase } from '@/lib/customSupabaseClient';

/**
 * Handles the automatic application process.
 */
export const autoApplyToJob = async (job, profile, matchAnalysis) => {
  try {
    // 1. Simulate Application Submission (or call Edge Function)
    const applicationPayload = {
      job_title: job.title,
      company: job.company,
      platform: job.source,
      job_description: job.description,
      match_score: matchAnalysis.score,
      status: 'Applied',
      applied_at: new Date().toISOString(),
      resume_version_url: profile.resumeUrl || 'portfolio_default',
      ai_reasoning: matchAnalysis.reasoning,
      match_details: {
        skills: matchAnalysis.matchedSkills,
        confidence: matchAnalysis.confidence
      }
    };

    // 2. Store in Database
    const { data, error } = await supabase
      .from('app_seo_job_matches')
      .insert(applicationPayload)
      .select()
      .single();

    if (error) throw error;

    // 3. Trigger Email Notification (Non-blocking)
    supabase.functions.invoke('send-job-email', {
      body: {
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        aiReasoning: matchAnalysis.reasoning
      }
    });

    return { success: true, record: data };
  } catch (error) {
    console.error("Auto-Apply Failed:", error);
    return { success: false, error: error.message };
  }
};