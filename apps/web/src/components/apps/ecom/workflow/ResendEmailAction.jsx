import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Mail, Beaker } from 'lucide-react';

export default function ResendEmailAction() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-red-500" />
          Resend Email Action
        </CardTitle>
        <CardDescription>Deliver fallback or generic HTML emails.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Resend API Key</label>
          <Input type="password" defaultValue="re_123456789" className="text-slate-900"/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Sender Email (From)</label>
          <Input defaultValue="hello@yourstore.com" className="text-slate-900"/>
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Beaker className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-sm">A/B Testing Subject Lines</span>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2 ml-6">
            <Input defaultValue="Oops, you left something behind! 🛒" className="text-sm h-8" />
            <Input defaultValue="Your cart is expiring in 2 hours ⏰" className="text-sm h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}