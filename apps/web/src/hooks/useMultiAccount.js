import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { getAccounts, addAccount as addAccountApi, removeAccount as removeAccountApi, setPrimaryAccount as setPrimaryAccountApi } from '@/utils/accountManager';
import { useToast } from '@/components/ui/use-toast';

export const useMultiAccount = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    if (!user) {
        setAccounts([]);
        setCurrentAccount(null);
        setLoading(false);
        return;
    }

    try {
      setLoading(true);
      const data = await getAccounts(user.id);
      setAccounts(data);
      
      // If we have accounts but no current one selected, select primary or first
      if (data.length > 0 && !currentAccount) {
        const primary = data.find(acc => acc.is_primary) || data[0];
        setCurrentAccount(primary);
      } else if (data.length > 0 && currentAccount) {
        // Verify current account still exists in updated list
        const exists = data.find(acc => acc.id === currentAccount.id);
        if (exists) {
            setCurrentAccount(exists); // Update to get latest fields
        } else {
            setCurrentAccount(data[0]); // Fallback
        }
      } else if (data.length === 0) {
        setCurrentAccount(null);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Error",
        description: "Failed to load accounts.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, currentAccount, toast]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const switchAccount = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setCurrentAccount(account);
      toast({
        title: "Account Switched",
        description: `Now managing ${account.account_email}`,
        duration: 2000
      });
    }
  };

  const addAccount = async (email, accessToken, refreshToken, name) => {
    if (!user) return;
    try {
      setLoading(true);
      await addAccountApi(user.id, email, accessToken, refreshToken, name);
      await fetchAccounts();
      toast({
        title: "Account Added",
        description: `Successfully connected ${email}`,
        className: "bg-green-50 border-green-200 text-green-900"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add account.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeAccount = async (accountId) => {
    if (!user) return;
    try {
      setLoading(true);
      await removeAccountApi(user.id, accountId);
      
      // If removing current account, state update will be handled by fetchAccounts logic
      if (currentAccount?.id === accountId) {
         setCurrentAccount(null); // Clear momentarily
      }
      
      await fetchAccounts();
      toast({
        title: "Account Removed",
        description: "Account disconnected successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove account.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setPrimaryAccount = async (accountId) => {
    if (!user) return;
    try {
      setLoading(true);
      await setPrimaryAccountApi(user.id, accountId);
      await fetchAccounts();
      toast({
        title: "Primary Account Updated",
        description: "This account is now the default.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set primary account.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    currentAccount,
    accounts,
    loading,
    switchAccount,
    addAccount,
    removeAccount,
    setPrimaryAccount
  };
};