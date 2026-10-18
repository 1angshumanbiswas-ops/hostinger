import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { postToAllPlatforms, postToPlatform, getPostingHistory, retryFailedPost, deletePost as deletePostApi } from '@/utils/postingManager';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export const usePosting = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [postingState, setPostingState] = useState({}); 
  const [postingHistory, setPostingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [errorState, setErrorState] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!user) {
        console.log("[usePosting] No user found, skipping history fetch");
        return;
    }
    setLoading(true);
    try {
      console.log("[usePosting] Fetching history for user:", user.id);
      const { data } = await getPostingHistory(user.id);
      setPostingHistory(data || []);
    } catch (err) {
      console.error("[usePosting] History fetch error:", err);
      setErrorMessage("Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
    
    if (!user) return;

    const subscription = supabase
      .channel('ad_posts_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ad_posts', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          console.log("[usePosting] Real-time update received:", payload);
          fetchHistory(); 
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };

  }, [fetchHistory, user]);

  const postToAll = async (adId, adContent, platforms) => {
    if (!user) {
        toast({ title: "Authentication Required", description: "Please log in to post.", variant: "destructive" });
        return;
    }
    
    console.log("[usePosting] postToAll initiated", { platforms, adId });
    
    const initialStates = {};
    platforms.forEach(p => initialStates[p] = 'posting');
    setPostingState(prev => ({ ...prev, ...initialStates }));
    setErrorState({});

    try {
        const results = await postToAllPlatforms(user.id, adId, adContent, platforms);
        console.log("[usePosting] postToAll results:", results);
        
        const failures = results.filter(r => !r.success);
        if (failures.length > 0) {
             toast({ 
                 title: "Completed with Errors", 
                 description: `${failures.length} platforms failed. Check status.`,
                 variant: "warning" 
             });
        } else {
             toast({ title: "Multi-post Complete", description: "Successfully posted to all platforms." });
        }
        
        await fetchHistory();
    } catch (err) {
        console.error("[usePosting] postToAll system error:", err);
        setErrorMessage(err.message);
        toast({ title: "System Error", description: err.message, variant: "destructive" });
    } finally {
        // Clear posting states after delay
        setTimeout(() => setPostingState({}), 3000);
    }
  };

  const postSingle = async (adId, platform, adContent) => {
    if (!user) {
        toast({ title: "Authentication Required", description: "Please log in to post.", variant: "destructive" });
        return;
    }

    console.log(`[usePosting] postSingle initiated for ${platform}`);
    setPostingState(prev => ({ ...prev, [platform]: 'posting' }));
    setErrorState(prev => ({ ...prev, [platform]: null }));

    try {
        const result = await postToPlatform(user.id, adId, platform, adContent);
        console.log(`[usePosting] Result for ${platform}:`, result);
        
        if (result.success) {
            setPostingState(prev => ({ ...prev, [platform]: 'success' }));
            toast({ title: "Posted Successfully", description: `Published to ${platform}.`, className: "bg-green-50 border-green-200 text-green-900" });
        } else {
            setPostingState(prev => ({ ...prev, [platform]: 'error' }));
            setErrorState(prev => ({ ...prev, [platform]: result.error }));
            
            toast({ 
                title: "Posting Failed", 
                description: result.error || "Unknown error", 
                variant: "destructive" 
            });
        }
        await fetchHistory();
    } catch (err) {
        console.error(`[usePosting] Exception for ${platform}:`, err);
        setPostingState(prev => ({ ...prev, [platform]: 'error' }));
        setErrorState(prev => ({ ...prev, [platform]: err.message }));
        toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const retryPost = async (postId) => {
      console.log(`[usePosting] Retrying post ${postId}`);
      toast({ title: "Retrying..." });
      const res = await retryFailedPost(postId);
      
      if (res.success) {
          toast({ title: "Retry Initiated", description: "New attempt created." });
          await fetchHistory();
      } else {
          toast({ title: "Retry Failed", description: res.error, variant: "destructive" });
      }
  };

  const deletePost = async (postId) => {
      const success = await deletePostApi(postId);
      if (success) {
          toast({ title: "Deleted", description: "Post record removed." });
          setPostingHistory(prev => prev.filter(p => p.id !== postId));
      } else {
          toast({ title: "Error", description: "Could not delete record.", variant: "destructive" });
      }
  };

  return {
    postingState,
    postToAll,
    postToPlatform: postSingle,
    postingHistory,
    loading,
    errorState,
    errorMessage,
    retryPost,
    deletePost
  };
};