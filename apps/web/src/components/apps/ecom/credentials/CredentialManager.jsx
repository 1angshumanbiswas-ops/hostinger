import React, { useState, useEffect } from 'react';
import CredentialForm from './CredentialForm';
import CredentialList from './CredentialList';
import CredentialTestModal from './CredentialTestModal';
import CredentialRotationReminder from './CredentialRotationReminder';
import { useCredentialManagement } from '@/hooks/useCredentialManagement';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function CredentialManager() {
  const { fetchCredentials, saveCredential, deleteCredential, loading } = useCredentialManagement();
  const [credentials, setCredentials] = useState([]);
  const [editingService, setEditingService] = useState('Twilio');
  const [existingDataMap, setExistingDataMap] = useState({});
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testService, setTestService] = useState(null);
  const [testData, setTestData] = useState(null);
  
  const { toast } = useToast();

  const loadData = async () => {
    const data = await fetchCredentials();
    setCredentials(data);
    
    const map = {};
    data.forEach(item => {
      map[item.service_name] = item.decryptedData;
    });
    setExistingDataMap(map);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (serviceName, data) => {
    await saveCredential(serviceName, data);
    await loadData();
  };

  const handleDelete = async (serviceName) => {
    if (!window.confirm(`Are you sure you want to delete ${serviceName} credentials? This will break integrations.`)) return;
    
    try {
      await deleteCredential(serviceName);
      toast({ title: 'Deleted', description: `${serviceName} credentials removed from vault.` });
      await loadData();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete credentials.', variant: 'destructive' });
    }
  };

  const handleEditRequest = (serviceName) => {
    setEditingService(serviceName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestRequest = (serviceName, data) => {
    setTestService(serviceName);
    setTestData(data);
    setTestModalOpen(true);
  };

  if (loading && credentials.length === 0) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="space-y-8">
      <CredentialRotationReminder credentials={credentials} onRotateRequest={handleEditRequest} />
      
      <CredentialForm 
        onSave={handleSave} 
        defaultService={editingService} 
        existingData={existingDataMap} 
      />
      
      <CredentialList 
        credentials={credentials} 
        onEdit={handleEditRequest} 
        onDelete={handleDelete}
        onTest={handleTestRequest}
      />

      <CredentialTestModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        serviceName={testService}
        credentialData={testData}
      />
    </div>
  );
}