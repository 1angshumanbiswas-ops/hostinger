import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCredentialManagement } from '@/hooks/useCredentialManagement';
import { useToast } from '@/components/ui/use-toast';
import { Save, RefreshCw, ShieldCheck } from 'lucide-react';
import TestConnectionModal from './TestConnectionModal';

const SERVICES = ['Twilio', 'Resend', 'Groq', 'OpenRouter', 'Shopify', 'WooCommerce', 'Airtable'];

export default function CredentialForm({ onSaved, editService = null }) {
  const [activeTab, setActiveTab] = useState(editService || 'Twilio');
  const [formData, setFormData] = useState({});
  const [testModal, setTestModal] = useState({ open: false, status: 'pending', message: '' });
  
  const { saveCredential, getCredential, testConnection, loading } = useCredentialManagement();
  const { toast } = useToast();

  useEffect(() => {
    if (editService) {
      setActiveTab(editService);
      loadExistingCredential(editService);
    }
  }, [editService]);

  const loadExistingCredential = async (service) => {
    const data = await getCredential(service);
    if (data) {
      setFormData(data);
    } else {
      setFormData({});
    }
  };

  const handleTabChange = (val) => {
    setActiveTab(val);
    setFormData({});
    loadExistingCredential(val);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (Object.keys(formData).length === 0) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Please fill out all fields.' });
      return;
    }
    const success = await saveCredential(activeTab, formData);
    if (success && onSaved) onSaved();
  };

  const handleTest = async () => {
    setTestModal({ open: true, status: 'pending', message: '' });
    const result = await testConnection(activeTab, formData);
    setTestModal({ open: true, status: result.success ? 'success' : 'error', message: result.message });
  };

  const renderInputs = () => {
    switch (activeTab) {
      case 'Twilio':
        return (
          <>
            <div className="space-y-2">
              <Label>Account SID</Label>
              <Input type="password" value={formData.accountSid || ''} onChange={(e) => handleInputChange('accountSid', e.target.value)} placeholder="AC..." className="text-slate-900 bg-white" />
              <p className="text-xs text-slate-500">Starts with AC</p>
            </div>
            <div className="space-y-2">
              <Label>Auth Token</Label>
              <Input type="password" value={formData.authToken || ''} onChange={(e) => handleInputChange('authToken', e.target.value)} placeholder="****************" className="text-slate-900 bg-white" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Phone Number</Label>
              <Input type="password" value={formData.phoneNumber || ''} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} placeholder="whatsapp:+1..." className="text-slate-900 bg-white" />
            </div>
          </>
        );
      case 'Resend':
        return (
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" value={formData.apiKey || ''} onChange={(e) => handleInputChange('apiKey', e.target.value)} placeholder="re_..." className="text-slate-900 bg-white" />
          </div>
        );
      case 'Groq':
        return (
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" value={formData.apiKey || ''} onChange={(e) => handleInputChange('apiKey', e.target.value)} placeholder="gsk_..." className="text-slate-900 bg-white" />
          </div>
        );
      case 'OpenRouter':
        return (
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" value={formData.apiKey || ''} onChange={(e) => handleInputChange('apiKey', e.target.value)} placeholder="sk-or-..." className="text-slate-900 bg-white" />
          </div>
        );
      case 'Shopify':
        return (
          <>
            <div className="space-y-2">
              <Label>Admin API Access Token</Label>
              <Input type="password" value={formData.apiKey || ''} onChange={(e) => handleInputChange('apiKey', e.target.value)} placeholder="shpat_..." className="text-slate-900 bg-white" />
            </div>
            <div className="space-y-2">
              <Label>Store URL</Label>
              <Input type="password" value={formData.storeUrl || ''} onChange={(e) => handleInputChange('storeUrl', e.target.value)} placeholder="your-store.myshopify.com" className="text-slate-900 bg-white" />
            </div>
          </>
        );
      case 'WooCommerce':
        return (
          <>
            <div className="space-y-2">
              <Label>Consumer Key</Label>
              <Input type="password" value={formData.apiKey || ''} onChange={(e) => handleInputChange('apiKey', e.target.value)} placeholder="ck_..." className="text-slate-900 bg-white" />
            </div>
            <div className="space-y-2">
              <Label>Consumer Secret</Label>
              <Input type="password" value={formData.apiSecret || ''} onChange={(e) => handleInputChange('apiSecret', e.target.value)} placeholder="cs_..." className="text-slate-900 bg-white" />
            </div>
            <div className="space-y-2">
              <Label>Store URL</Label>
              <Input type="password" value={formData.storeUrl || ''} onChange={(e) => handleInputChange('storeUrl', e.target.value)} placeholder="https://..." className="text-slate-900 bg-white" />
            </div>
          </>
        );
      case 'Airtable':
        return (
          <>
            <div className="space-y-2">
              <Label>Personal Access Token</Label>
              <Input type="password" value={formData.apiKey || ''} onChange={(e) => handleInputChange('apiKey', e.target.value)} placeholder="pat..." className="text-slate-900 bg-white" />
            </div>
            <div className="space-y-2">
              <Label>Base ID</Label>
              <Input type="password" value={formData.baseId || ''} onChange={(e) => handleInputChange('baseId', e.target.value)} placeholder="app..." className="text-slate-900 bg-white" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Secure Configuration
        </CardTitle>
        <CardDescription>All credentials are AES-256 encrypted before storage.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6 h-auto p-1 bg-slate-100">
            {SERVICES.map(service => (
              <TabsTrigger key={service} value={service} className="text-xs py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm">
                {service}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="max-w-xl space-y-6">
            <div className="space-y-4">
              {renderInputs()}
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <Button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800">
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Credential
              </Button>
              <Button variant="outline" onClick={handleTest} disabled={loading} className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Test Connection
              </Button>
            </div>
          </div>
        </Tabs>
      </CardContent>

      <TestConnectionModal 
        isOpen={testModal.open}
        onClose={() => setTestModal({ ...testModal, open: false })}
        serviceName={activeTab}
        status={testModal.status}
        message={testModal.message}
        onRetry={handleTest}
      />
    </Card>
  );
}