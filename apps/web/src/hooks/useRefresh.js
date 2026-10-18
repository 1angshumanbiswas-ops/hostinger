import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { refreshAllPlatforms, refreshPlatform, getRefreshHistory, getLastRefreshTime } from '@/utils/refreshManager';
import { useToast } from '@/components/ui/use-toast';

export const useRefresh = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [refreshState, setRefreshState] = useState({}); // { [platform]: 'idle' | 'refreshing' | 'success' | 'error' }
  const [refreshHistory, setRefreshHistory] = useState([]);
  const [lastRefreshTimes, setLastRefreshTimes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const history = await getRefreshHistory(user.id);
      setRefreshHistory(history);

      // Fetch last times for known platforms
      const platforms = ['linkedin', 'facebook', 'instagram', 'twitter', 'whatsapp', 'snapchat', 'youtube'];
      const times = {};
      await Promise.all(platforms.map(async (p) => {
          const t = await getLastRefreshTime(user.id, p);
          if (t) times[p] = t;
      }));
      setLastRefreshTimes(times);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefreshAll = async () => {
    if (!user) return;
    setRefreshState(prev => ({ ...prev, all: 'refreshing' }));
    
    try {
        await refreshAllPlatforms(user.id);
        toast({ title: "Refresh Complete", description: "All platforms synced." });
        await fetchData();
        setRefreshState(prev => ({ ...prev, all: 'success' }));
    } catch (err) {
        setRefreshState(prev => ({ ...prev, all: 'error' }));
        toast({ title: "Refresh Failed", description: err.message, variant: "destructive" });
    } finally {
        setTimeout(() => setRefreshState(prev => ({ ...prev, all: 'idle' })), 2000);
    }
  };

  const handleRefreshSingle = async (platform) => {
    if (!user) return;
    setRefreshState(prev => ({ ...prev, [platform]: 'refreshing' }));

    try {
        const res = await refreshPlatform(user.id, platform);
        if (res.success) {
            setRefreshState(prev => ({ ...prev, [platform]: 'success' }));
            toast({ title: "Refreshed", description: `${platform} data updated.` });
            // Optimistic update of timestamp
            setLastRefreshTimes(prev => ({ ...prev, [platform]: new Date().toISOString() }));
            await fetchData(); // Full sync
        } else {
             setRefreshState(prev => ({ ...prev, [platform]: 'error' }));
             toast({ title: "Error", description: "Failed to refresh.", variant: "destructive" });
        }
    } catch (err) {
        setRefreshState(prev => ({ ...prev, [platform]: 'error' }));
    } finally {
        setTimeout(() => setRefreshState(prev => ({ ...prev, [platform]: 'idle' })), 2000);
    }
  };

  return {
    refreshState,
    refreshAll: handleRefreshAll,
    refreshPlatform: handleRefreshSingle,
    refreshHistory,
    loading,
    error,
    lastRefreshTimes
  };
};