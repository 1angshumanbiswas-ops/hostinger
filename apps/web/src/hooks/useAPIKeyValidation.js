import { useState, useEffect } from 'react';
import { useAPIKeys } from './useAPIKeys';
import { useToast } from '@/components/ui/use-toast';

export const useAPIKeyValidation = () => {
  const [configuredKeys, setConfiguredKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const { getAPIKey } = useAPIKeys();
  const { toast } = useToast();

  const checkKeys = async () => {
    setLoading(true);
    const keysToCheck = ['Hugging Face', 'Finnhub', 'Alpha Vantage', 'NewsAPI', 'CoinGecko'];
    const results = {};
    
    for (const key of keysToCheck) {
      const val = await getAPIKey(key);
      results[key] = !!val;
    }
    
    setConfiguredKeys(results);
    setLoading(false);
    return results;
  };

  useEffect(() => {
    checkKeys();
  }, [getAPIKey]);

  const isKeyConfigured = (keyName) => !!configuredKeys[keyName];
  
  const getMissingKeys = () => Object.entries(configuredKeys).filter(([_, isConf]) => !isConf).map(([k]) => k);
  
  const getConfiguredKeysList = () => Object.entries(configuredKeys).filter(([_, isConf]) => isConf).map(([k]) => k);

  const showWarningIfMissing = (keyName) => {
    if (!configuredKeys[keyName]) {
      toast({
        title: "API Key Missing",
        description: `Please configure your ${keyName} API key in Settings.`,
        variant: "destructive"
      });
      return true;
    }
    return false;
  };

  return { configuredKeys, loading, checkKeys, isKeyConfigured, getMissingKeys, getConfiguredKeysList, showWarningIfMissing };
};