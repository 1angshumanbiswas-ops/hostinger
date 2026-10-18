import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { generateSchedule, checkAndPostScheduled } from '@/utils/schedulePostingService';
import { useToast } from '@/components/ui/use-toast';

export const useScheduling = () => {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [postingHistory, setPostingHistory] = useState([]);
  const [config, setConfig] = useState({});
  const [nextPostCountdown, setNextPostCountdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchScheduledPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('status', 'scheduled')
      .order('scheduled_time', { ascending: true });
    
    if (!error && data) {
      setScheduledPosts(data);
      updateCountdown(data);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from('posting_history')
      .select('*')
      .order('posted_at', { ascending: false });
      
    if (!error && data) setPostingHistory(data);
  }, []);

  const fetchConfig = useCallback(async () => {
    const { data, error } = await supabase.from('scheduling_config').select('*');
    if (!error && data) {
        // Transform array to object for easier access
        const configObj = data.reduce((acc, curr) => ({ ...acc, [curr.platform]: curr }), {});
        setConfig(configObj);
    }
  }, []);

  const updateCountdown = (posts) => {
    if (posts && posts.length > 0) {
      const nextPost = posts[0];
      const now = new Date();
      const scheduled = new Date(nextPost.scheduled_time);
      const diff = scheduled - now;
      setNextPostCountdown(diff > 0 ? diff : 0);
    } else {
      setNextPostCountdown(null);
    }
  };

  const initializeSchedule = async () => {
    setLoading(true);
    // Check if we have scheduled posts
    const { count } = await supabase
        .from('scheduled_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled');

    if (count === 0) {
        console.log("Generating initial schedule...");
        const newSchedule = await generateSchedule();
        const { error } = await supabase.from('scheduled_posts').insert(newSchedule);
        if (error) console.error("Failed to save schedule:", error);
        else toast({ title: "Schedule Generated", description: "Created 30-day posting schedule." });
    }
    
    await Promise.all([fetchScheduledPosts(), fetchHistory(), fetchConfig()]);
    setLoading(false);
  };

  const manualCheck = async () => {
    const posted = await checkAndPostScheduled();
    if (posted.length > 0) {
        toast({ 
            title: "Posts Published", 
            description: `Successfully published ${posted.length} scheduled posts.` 
        });
        await Promise.all([fetchScheduledPosts(), fetchHistory()]);
    } else {
        toast({
            title: "Check Complete",
            description: "No pending posts found for this hour."
        });
    }
  };

  // Timer for countdown and periodic checking
  useEffect(() => {
    const timer = setInterval(() => {
        if (nextPostCountdown > 0) {
            setNextPostCountdown(prev => Math.max(0, prev - 1000));
        }
    }, 1000);

    // Hourly check (simulated here with a shorter interval for demo if needed, but strict 1hr is standard)
    // For a real app, this should be a backend cron job or edge function. 
    // Here we rely on the client being open.
    const hourlyCheck = setInterval(() => {
       manualCheck();
    }, 60 * 60 * 1000); 

    return () => {
        clearInterval(timer);
        clearInterval(hourlyCheck);
    };
  }, [nextPostCountdown]);

  return {
    scheduledPosts,
    postingHistory,
    config,
    nextPostCountdown,
    loading,
    initializeSchedule,
    fetchScheduledPosts,
    fetchHistory,
    manualCheck,
    updateConfiguration: fetchConfig // Expose refresh
  };
};