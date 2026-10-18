import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  postToPlatform as apiPostToPlatform, 
  postToAllPlatforms as apiPostToAll, 
  getPlatformStatus 
} from '@/utils/triggerPostingManager';
import { useToast } from '@/components/ui/use-toast';
import { logPlatformAction } from '@/utils/debugLogManager';

export const useTriggerPosting = () => {
  const { user, isAuthenticated, loading: authLoading, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  
  const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'snapchat', 'whatsapp'];
  
  const [platformStatuses, setPlatformStatuses] = useState({});
  const [loading, setLoading] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState({});

  // Debug logging for hook state
  useEffect(() => {
    console.log('[useTriggerPosting] Hook state updated:', { 
      isAuthenticated, 
      isSuperAdmin, 
      user: user?.id 
    });
  }, [isAuthenticated, isSuperAdmin, user]);

  const fetchStatuses = useCallback(async () => {
    if (authLoading) return;
    
    // Allow fetch if super admin, even if no user
    if ((!isAuthenticated || !user) && !isSuperAdmin) {
        return;
    }
    
    const targetUserId = user?.id; 
    
    // If no user ID but is Super Admin, we might skip status fetch or attempt with null
    if (!targetUserId && !isSuperAdmin) return;
    
    const statuses = {};
    const errors = {};
    
    if (targetUserId) {
      await Promise.all(platforms.map(async (platform) => {
        const data = await getPlatformStatus(targetUserId, platform);
        if (data) {
          statuses[platform] = {
              status: data.status,
              lastPosted: data.lastPost?.created_at || null,
              connected: data.connected
          };
          if (data.status === 'failed') {
              errors[platform] = data.lastPost?.error_message;
          }
        }
      }));
    }
    
    setPlatformStatuses(statuses);
    setErrorDetails(errors);
  }, [user, isAuthenticated, authLoading, isSuperAdmin]);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const postToPlatform = async (platform, content) => {
    console.log(`[useTriggerPosting] postToPlatform: ${platform}. SuperAdmin: ${isSuperAdmin}`);
    
    // Log intent to DB if possible
    try {
      if (user?.id) {
        await logPlatformAction(user.id, platform, 'HOOK_POST_INTENT', { isSuperAdmin, content });
      }
    } catch (e) {
      console.warn('Logging failed', e);
    }

    setLoading(prev => ({ ...prev, [platform]: true }));
    setErrorDetails(prev => ({ ...prev, [platform]: null }));
    
    try {
      const userIdToPass = user?.id || null;
      // Bypassing all client-side auth checks here. Manager will handle "null" user ID if super admin.
      const result = await apiPostToPlatform(userIdToPass, platform, content);

      if (result.success) {
        setPlatformStatuses(prev => ({
          ...prev,
          [platform]: { ...prev[platform], status: 'posted', lastPosted: new Date().toISOString() }
        }));
        toast({ title: "Success", description: `✓ Posted to ${platform}`, className: "bg-green-50 border-green-200 text-green-900" });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Post failed for ${platform}:`, error);
      const msg = error.message || "Unknown error";
      toast({ title: `Error posting to ${platform}`, description: msg, variant: "destructive" });
      
      setPlatformStatuses(prev => ({
          ...prev,
          [platform]: { ...prev[platform], status: 'error' }
      }));
      setErrorDetails(prev => ({ ...prev, [platform]: msg }));
      
      return false;
    } finally {
      setLoading(prev => ({ ...prev, [platform]: false }));
    }
  };

  const postToAllPlatforms = async (content) => {
    console.log(`[useTriggerPosting] postToAllPlatforms. SuperAdmin: ${isSuperAdmin}`);
    
    setGlobalLoading(true);
    const loadingState = {};
    platforms.forEach(p => loadingState[p] = true);
    setLoading(loadingState);

    try {
      const userIdToPass = user?.id || null;
      // Bypassing auth checks
      const result = await apiPostToAll(userIdToPass, content, platforms);
      
      if (result.success) {
        toast({ title: "Success", description: "✓ Posted to all platforms", className: "bg-green-50 border-green-200 text-green-900" });
      } else {
        toast({ 
            title: "Partial Success", 
            description: `${result.summary?.failed || 0} platforms failed. Check details.`, 
            variant: "warning" 
        });
      }
      
      await fetchStatuses();
      return result.success;
    } catch (error) {
      toast({ title: "System Error", description: error.message, variant: "destructive" });
      return false;
    } finally {
      setGlobalLoading(false);
      setLoading({});
    }
  };

  return {
    postToPlatform,
    postToAllPlatforms,
    platformStatuses,
    loading,
    globalLoading,
    errorDetails,
    refreshStatuses: fetchStatuses
  };
};