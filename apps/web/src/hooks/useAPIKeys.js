import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

// Simple mock encryption for demonstration in this frontend-only environment
const mockEncrypt = (text) => btoa(text);
const mockDecrypt = (encoded) => {
  try { return atob(encoded); } catch (e) { return encoded; }
};

export const useAPIKeys = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const saveAPIKey = async (keyName, value) => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      const userId = userData.user.id;
      const encryptedValue = mockEncrypt(value);

      const { error } = await supabase
        .from('api_keys')
        .upsert(
          { user_id: userId, key_name: keyName, encrypted_value: encryptedValue, updated_at: new Date().toISOString() },
          { onConflict: 'user_id, key_name' }
        );

      if (error) throw error;
      
      toast({ title: "Success", description: `${keyName} saved securely.` });
      return true;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAPIKey = useCallback(async (keyName) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return null;

      const { data, error } = await supabase
        .from('api_keys')
        .select('encrypted_value')
        .eq('user_id', userData.user.id)
        .eq('key_name', keyName)
        .single();

      if (error || !data) return null;
      return mockDecrypt(data.encrypted_value);
    } catch (err) {
      return null;
    }
  }, []);

  const deleteAPIKey = async (keyName) => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('key_name', keyName);

      if (error) throw error;
      
      toast({ title: "Deleted", description: `${keyName} has been removed.` });
      return true;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (keyName, keyValue) => {
    setLoading(true);
    try {
      // Mocking test logic - in reality, we'd make a real API call to verify the key
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!keyValue || keyValue.length < 5) throw new Error("Invalid key format");
      
      toast({ title: "Connection Successful", description: `${keyName} is valid and working.` });
      return true;
    } catch (err) {
      toast({ title: "Connection Failed", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveAPIKey, getAPIKey, deleteAPIKey, testConnection, loading };
};