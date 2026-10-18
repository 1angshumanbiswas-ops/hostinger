import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { validateCredentialFormat } from '@/utils/credentialEncryption';

const SERVICES = ['Twilio', 'Resend', 'Groq', 'OpenRouter', 'Shopify', 'WooCommerce', 'Airtable'];

export default function CredentialForm({ onSave, defaultService = 'Twilio', existingData = {} }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(defaultService);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setActiveTab(defaultService);
    if (existingData[defaultService]) {
      setFormData(existingData[defaultService]);
    } else {
      setFormData({});
    }
  }, [defaultService, existingData]);

  const handleTabChange = (val) => {
    setActiveTab(val);
    setFormData(existingData[val] || {});
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!validateCredentialFormat(activeTab, formData)) {
      toast({ title: 'Validation Failed', description: 'Please fill out required fields with valid formats.', variant: 'destructive' });
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(activeTab, formData);
      toast({ title: 'Saved Successfully', description: `${activeTab} credentials secured in vault.` });
    } catch (err) {
      toast({ title: 'Error Saving', description: err.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add / Update Credentials</CardTitle>
        <CardDescription>Select a service to configure its API keys securely.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="flex flex-wrap h-auto gap-2 justify-start mb-6">
            {SERVICES.map(s => <TabsTrigger key={s} value={s}>{s}</TabsTrigger>)}
          </TabsList>

          <TabsContent value="Twilio" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account SID</label>
              <Input name="accountSid" value={formData.accountSid || ''} onChange={handleChange} placeholder="AC..." type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Auth Token</label>
              <Input name="authToken" value={formData.authToken || ''} onChange={handleChange} placeholder="Required" type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} placeholder="+1234567890" />
            </div>
          </TabsContent>

          <TabsContent value="Resend" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input name="apiKey" value={formData.apiKey || ''} onChange={handleChange} placeholder="re_..." type="password" />
            </div>
          </TabsContent>

          <TabsContent value="Groq" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input name="apiKey" value={formData.apiKey || ''} onChange={handleChange} placeholder="gsk_..." type="password" />
            </div>
          </TabsContent>

          <TabsContent value="OpenRouter" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <Input name="apiKey" value={formData.apiKey || ''} onChange={handleChange} placeholder="sk-or-..." type="password" />
            </div>
          </TabsContent>

          <TabsContent value="Shopify" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin API Access Token</label>
              <Input name="apiKey" value={formData.apiKey || ''} onChange={handleChange} placeholder="shpat_..." type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Store URL</label>
              <Input name="storeUrl" value={formData.storeUrl || ''} onChange={handleChange} placeholder="your-store.myshopify.com" />
            </div>
          </TabsContent>

          <TabsContent value="WooCommerce" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Consumer Key</label>
              <Input name="consumerKey" value={formData.consumerKey || ''} onChange={handleChange} placeholder="ck_..." type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Consumer Secret</label>
              <Input name="consumerSecret" value={formData.consumerSecret || ''} onChange={handleChange} placeholder="cs_..." type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Store URL</label>
              <Input name="storeUrl" value={formData.storeUrl || ''} onChange={handleChange} placeholder="https://yourstore.com" />
            </div>
          </TabsContent>

          <TabsContent value="Airtable" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Personal Access Token</label>
              <Input name="apiKey" value={formData.apiKey || ''} onChange={handleChange} placeholder="pat..." type="password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Base ID</label>
              <Input name="baseId" value={formData.baseId || ''} onChange={handleChange} placeholder="app..." />
            </div>
          </TabsContent>

          <div className="pt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}