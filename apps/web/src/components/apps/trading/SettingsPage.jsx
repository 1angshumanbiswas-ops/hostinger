import React from 'react';
import SettingsHeader from './SettingsHeader';
import APIKeyInput from './APIKeyInput';
import { useAPIKeys } from '@/hooks/useAPIKeys';
import { useAPIKeyValidation } from '@/hooks/useAPIKeyValidation';
import { Skeleton } from '@/components/ui/skeleton';

const SettingsPage = () => {
  const { saveAPIKey, deleteAPIKey, testConnection } = useAPIKeys();
  const { configuredKeys, loading, checkKeys } = useAPIKeyValidation();

  const apis = [
    { name: 'Hugging Face', description: 'Required for AI-driven market analysis and trade recommendations.' },
    { name: 'Finnhub', description: 'Real-time stock market data, quotes, and financial news.' },
    { name: 'Alpha Vantage', description: 'Historical stock data, forex, and cryptocurrency feeds.' },
    { name: 'NewsAPI', description: 'Aggregated financial news and sentiment analysis sources.' },
    { name: 'CoinGecko', description: 'Cryptocurrency prices, volumes, and market cap data.' }
  ];

  const handleSave = async (name, value) => {
    const success = await saveAPIKey(name, value);
    if (success) await checkKeys();
    return success;
  };

  const handleDelete = async (name) => {
    const success = await deleteAPIKey(name);
    if (success) await checkKeys();
    return success;
  };

  const configuredCount = Object.values(configuredKeys).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <SettingsHeader configuredCount={configuredCount} totalCount={apis.length} />
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-white mb-6">Connected Services</h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full bg-slate-800 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {apis.map((api) => (
              <APIKeyInput
                key={api.name}
                name={api.name}
                description={api.description}
                isConfigured={!!configuredKeys[api.name]}
                onSave={handleSave}
                onDelete={handleDelete}
                onTest={testConnection}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;