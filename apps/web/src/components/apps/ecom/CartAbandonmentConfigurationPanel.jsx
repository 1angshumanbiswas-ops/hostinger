import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Settings, Save, Clock, Mail } from 'lucide-react';

export default function CartAbandonmentConfigurationPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    timeout_minutes: 30,
    token_expiration_days: 7,
    admin_email: '1angshuman.biswas@gmail.com',
    notifications_enabled: true,
    max_retries: 3,
    rate_limiting_enabled: true
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase.from('cart_abandonment_config').select('*').single();
      if (data) setConfig(data);
    } catch (err) {
      console.error('Failed to load config:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Upsert logic (assuming 1 row exists)
      const { data: existing } = await supabase.from('cart_abandonment_config').select('id').single();
      
      let res;
      if (existing?.id) {
        res = await supabase.from('cart_abandonment_config').update({ ...config, updated_at: new Date().toISOString() }).eq('id', existing.id);
      } else {
        res = await supabase.from('cart_abandonment_config').insert([{ ...config, updated_at: new Date().toISOString() }]);
      }

      if (res.error) throw res.error;
      toast({ title: 'Settings Saved', description: 'Cart abandonment configurations updated successfully.' });
    } catch (err) {
      toast({ title: 'Save Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2"><Settings className="w-8 h-8 text-indigo-600"/> Automation Rules</h1>
        <p className="text-slate-500">Configure abandonment detection and notification parameters.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detection & Token Settings</CardTitle>
          <CardDescription>Rules for identifying and recovering lost carts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Abandonment Timeout (Minutes)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input type="number" className="pl-9" value={config.timeout_minutes} onChange={e => setConfig({...config, timeout_minutes: Number(e.target.value)})} />
              </div>
              <p className="text-xs text-slate-500">Time of inactivity before marking cart as abandoned.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Recovery Token Expiration (Days)</Label>
              <Input type="number" value={config.token_expiration_days} onChange={e => setConfig({...config, token_expiration_days: Number(e.target.value)})} />
              <p className="text-xs text-slate-500">How long the recovery link remains valid.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification System</CardTitle>
          <CardDescription>Email alerts and retries configurations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <Label className="text-base font-semibold text-slate-900">Enable Automated Notifications</Label>
              <p className="text-sm text-slate-500">Automatically send emails when carts are abandoned.</p>
            </div>
            <Switch checked={config.notifications_enabled} onCheckedChange={v => setConfig({...config, notifications_enabled: v})} />
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2 max-w-md">
              <Label>Admin Notification Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input type="email" className="pl-9" value={config.admin_email} onChange={e => setConfig({...config, admin_email: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2 max-w-xs">
              <Label>Delivery Retry Attempts</Label>
              <Input type="number" value={config.max_retries} onChange={e => setConfig({...config, max_retries: Number(e.target.value)})} />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="rate-limit" checked={config.rate_limiting_enabled} onCheckedChange={v => setConfig({...config, rate_limiting_enabled: v})} />
              <Label htmlFor="rate-limit">Enable Rate Limiting (Prevent Spam)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Settings</>}
        </Button>
      </div>
    </div>
  );
}