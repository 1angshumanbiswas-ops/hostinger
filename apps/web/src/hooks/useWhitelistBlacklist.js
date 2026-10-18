import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  getWhitelist, 
  getBlacklist, 
  addToWhitelist as addToWhitelistApi, 
  removeFromWhitelist as removeFromWhitelistApi,
  addToBlacklist as addToBlacklistApi,
  removeFromBlacklist as removeFromBlacklistApi,
  isWhitelisted as checkWhitelist,
  isBlacklisted as checkBlacklist
} from '@/utils/whitelistBlacklistManager';
import { useToast } from '@/components/ui/use-toast';

export const useWhitelistBlacklist = (currentAccount) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [whitelist, setWhitelist] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user || !currentAccount) {
        setWhitelist([]);
        setBlacklist([]);
        return;
    }

    try {
      setLoading(true);
      const [wData, bData] = await Promise.all([
        getWhitelist(user.id, currentAccount.id),
        getBlacklist(user.id, currentAccount.id)
      ]);
      setWhitelist(wData);
      setBlacklist(bData);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  }, [user, currentAccount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addToWhitelist = async (email, name, reason) => {
    if (!user || !currentAccount) return;
    try {
      setLoading(true);
      await addToWhitelistApi(user.id, currentAccount.id, email, name, reason);
      await fetchData();
      toast({ title: "Added to Whitelist", description: `${email} is now safe.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update whitelist.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWhitelist = async (email) => {
    if (!user || !currentAccount) return;
    try {
      setLoading(true);
      await removeFromWhitelistApi(user.id, currentAccount.id, email);
      await fetchData();
      toast({ title: "Removed from Whitelist", description: `${email} removed.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove from whitelist.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addToBlacklist = async (email, name, reason) => {
    if (!user || !currentAccount) return;
    try {
      setLoading(true);
      await addToBlacklistApi(user.id, currentAccount.id, email, name, reason);
      await fetchData();
      toast({ title: "Added to Blacklist", description: `${email} will be blocked.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update blacklist.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const removeFromBlacklist = async (email) => {
    if (!user || !currentAccount) return;
    try {
      setLoading(true);
      await removeFromBlacklistApi(user.id, currentAccount.id, email);
      await fetchData();
      toast({ title: "Removed from Blacklist", description: `${email} removed.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to remove from blacklist.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return {
    whitelist,
    blacklist,
    loading,
    addToWhitelist,
    removeFromWhitelist,
    addToBlacklist,
    removeFromBlacklist,
    isWhitelisted: (email) => checkWhitelist(email, whitelist),
    isBlacklisted: (email) => checkBlacklist(email, blacklist)
  };
};