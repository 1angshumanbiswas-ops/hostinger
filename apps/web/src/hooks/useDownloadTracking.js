import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useDownloadTracking() {
  const [isLogging, setIsLogging] = useState(false);

  const logDownload = async (materialId) => {
    try {
      setIsLogging(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      // Log the download
      const { error: logError } = await supabase
        .from('download_logs')
        .insert({
          user_id: user?.id || null,
          material_id: materialId,
          downloaded_at: new Date().toISOString()
        });

      if (logError) throw logError;

      // Increment download count
      const { error: updateError } = await supabase.rpc('increment_downloads', {
        material_id: materialId
      });

      // If RPC doesn't exist, do manual increment
      if (updateError) {
        const { data: material } = await supabase
          .from('materials')
          .select('downloads_count')
          .eq('id', materialId)
          .single();

        if (material) {
          await supabase
            .from('materials')
            .update({ downloads_count: (material.downloads_count || 0) + 1 })
            .eq('id', materialId);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Download tracking error:', error);
      return { success: false, error };
    } finally {
      setIsLogging(false);
    }
  };

  return { logDownload, isLogging };
}