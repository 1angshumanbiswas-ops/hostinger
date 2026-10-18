import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { MessageCircle, Settings2 } from 'lucide-react';

export default function TwilioWhatsAppAction() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-500" />
          Twilio WhatsApp Action
        </CardTitle>
        <CardDescription>Deliver messages via WhatsApp Business API.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Twilio Account SID</label>
          <Input type="password" defaultValue="AC1234567890abcdef" className="text-slate-900"/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Twilio Auth Token</label>
          <Input type="password" defaultValue="*****************" className="text-slate-900"/>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">WhatsApp Sender Number</label>
          <Input defaultValue="whatsapp:+14155238886" className="text-slate-900"/>
        </div>
        
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-sm">Retry Logic (Exponential Backoff)</span>
            </div>
            <Switch defaultChecked />
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-6">Retries failed messages 3 times (1m, 5m, 15m).</p>
        </div>
      </CardContent>
    </Card>
  );
}