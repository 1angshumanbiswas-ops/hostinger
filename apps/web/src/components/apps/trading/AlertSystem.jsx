import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Bell, Mail, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const AlertSystem = () => {
  const [inApp, setInApp] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [email, setEmail] = useState('');
  const [threshold, setThreshold] = useState([70]);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Alert Settings Saved",
      description: `Alerting for confidence > ${threshold[0]}%`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium">In-App Notifications</label>
              <p className="text-sm text-slate-500">Receive toasts when new AI recommendations appear.</p>
            </div>
            <Switch checked={inApp} onCheckedChange={setInApp} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-base font-medium">Email Alerts</label>
              <p className="text-sm text-slate-500">Get an email for high-confidence trades.</p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>

          {emailAlerts && (
            <div className="space-y-2 pl-4 border-l-2 border-slate-100">
              <label className="text-sm font-medium">Email Address</label>
              <div className="flex gap-2">
                <Mail className="w-5 h-5 text-slate-400 mt-2" />
                <Input type="email" placeholder="trader@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between">
              <label className="text-base font-medium">Confidence Threshold</label>
              <span className="font-bold text-indigo-600">{threshold[0]}%</span>
            </div>
            <p className="text-sm text-slate-500">Only alert me when AI confidence is above this level.</p>
            <Slider value={threshold} onValueChange={setThreshold} max={100} step={5} />
          </div>

          <Button onClick={handleSave} className="w-full">
            <Settings className="w-4 h-4 mr-2" /> Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSystem;