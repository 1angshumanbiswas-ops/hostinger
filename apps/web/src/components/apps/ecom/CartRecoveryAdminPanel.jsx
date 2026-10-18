import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

export default function CartRecoveryAdminPanel() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Configuration Saved", description: "Cart recovery settings have been updated." });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Recovery Configuration</h1>
        <p className="text-slate-500">Manage triggers, discounts, and templates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trigger Settings</CardTitle>
          <CardDescription>Define when the recovery workflow starts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Cart Value ($)</Label>
              <Input type="number" defaultValue="50" className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label>Wait Time (Minutes)</Label>
              <Input type="number" defaultValue="45" className="text-slate-900" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg mt-4">
            <div>
              <p className="font-medium">Enable AI Timing Optimization</p>
              <p className="text-sm text-slate-500">Automatically adjust wait time based on user behavior.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dynamic Discount Rules</CardTitle>
          <CardDescription>Set LTV and customer type based incentives.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>VIP LTV Threshold ($)</Label>
              <Input type="number" defaultValue="500" className="text-slate-900" />
            </div>
            <div className="space-y-2">
              <Label>VIP Discount (%)</Label>
              <Input type="number" defaultValue="15" className="text-slate-900" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg mt-4">
            <div>
              <p className="font-medium">Free Shipping for New Customers</p>
              <p className="text-sm text-slate-500">Offer free shipping instead of % discount for first-timers.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>WhatsApp / SMS Body</Label>
            <Textarea 
              className="min-h-[100px] text-slate-900" 
              defaultValue="Hi {{customer.first_name}}, looks like you left something behind! Use code {{discount.code}} for {{discount.value}} off your cart. Checkout here: {{cart.url}}"
            />
          </div>
          <Button onClick={handleSave} className="w-full">Save Configuration</Button>
        </CardContent>
      </Card>
    </div>
  );
}