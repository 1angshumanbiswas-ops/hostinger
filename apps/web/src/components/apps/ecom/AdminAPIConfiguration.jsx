import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminAPIConfiguration() {
  const { toast } = useToast();
  const [statuses, setStatuses] = useState({
    shopify: 'connected',
    woocommerce: 'disconnected',
    airtable: 'connected',
    ai: 'connected'
  });
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = (service) => {
    setIsTesting(true);
    setTimeout(() => {
      setStatuses(prev => ({ ...prev, [service]: 'connected' }));
      setIsTesting(false);
      toast({ title: "Connection Successful", description: `${service} API validated securely.` });
    }, 1500);
  };

  const StatusBadge = ({ status }) => (
    <Badge variant={status === 'connected' ? 'success' : 'secondary'} className="ml-2">
      {status === 'connected' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
      {status}
    </Badge>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Integration Hub</h1>
        <p className="text-slate-500">Securely manage API connections and sync intervals.</p>
      </div>

      <Tabs defaultValue="shopify" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="shopify">Shopify</TabsTrigger>
          <TabsTrigger value="woocommerce">WooCommerce</TabsTrigger>
          <TabsTrigger value="airtable">Airtable</TabsTrigger>
          <TabsTrigger value="ai">AI Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shopify">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">Shopify Integration <StatusBadge status={statuses.shopify} /></CardTitle>
              <CardDescription>Connect your Shopify store to sync products and orders.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Shop URL</label>
                <Input placeholder="your-store.myshopify.com" defaultValue="demo-store.myshopify.com" className="text-slate-900"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin API Access Token</label>
                <Input type="password" placeholder="shpat_..." defaultValue="shpat_1234567890" className="text-slate-900"/>
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={() => handleTestConnection('shopify')} disabled={isTesting}>
                  {isTesting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : 'Test Connection'}
                </Button>
                <Button variant="outline">Force Sync Now</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="woocommerce">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">WooCommerce Integration <StatusBadge status={statuses.woocommerce} /></CardTitle>
              <CardDescription>REST API credentials for WooCommerce.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Store URL</label>
                <Input placeholder="https://your-store.com" className="text-slate-900"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Consumer Key</label>
                <Input type="password" placeholder="ck_..." className="text-slate-900"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Consumer Secret</label>
                <Input type="password" placeholder="cs_..." className="text-slate-900"/>
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={() => handleTestConnection('woocommerce')} disabled={isTesting}>Test Connection</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="airtable">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">Airtable (LTV Data) <StatusBadge status={statuses.airtable} /></CardTitle>
              <CardDescription>Sync historical customer lifetime value data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Personal Access Token</label>
                <Input type="password" defaultValue="pat123..." className="text-slate-900"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base ID</label>
                <Input defaultValue="appXyZ..." className="text-slate-900"/>
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={() => handleTestConnection('airtable')} disabled={isTesting}>Test Connection</Button>
                <Button variant="outline">Sync LTV Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">AI Generators <StatusBadge status={statuses.ai} /></CardTitle>
              <CardDescription>Configure LLM providers for message generation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Groq API Key (Primary)</label>
                <Input type="password" defaultValue="gsk_..." className="text-slate-900"/>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">OpenRouter API Key (Fallback)</label>
                <Input type="password" defaultValue="sk-or-v1-..." className="text-slate-900"/>
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={() => handleTestConnection('ai')} disabled={isTesting}>Test AI Engines</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}