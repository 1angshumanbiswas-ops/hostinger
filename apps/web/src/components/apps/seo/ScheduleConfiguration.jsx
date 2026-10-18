import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Save, AlertTriangle } from 'lucide-react';

const ScheduleConfiguration = ({ config, onUpdate }) => {
  const { toast } = useToast();
  const [isSchedulingEnabled, setIsSchedulingEnabled] = useState(true);
  const [frequency, setFrequency] = useState("3");

  const handleSave = () => {
    // In a real app, you'd save this to Supabase here via onUpdate
    toast({
       title: "Configuration Saved",
       description: "Your scheduling preferences have been updated."
    });
  };

  return (
    <div className="grid gap-6">
      <Card className="border-slate-200">
         <CardHeader>
            <CardTitle>Global Settings</CardTitle>
            <CardDescription>Manage how the auto-scheduler behaves across all platforms.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
               <div className="space-y-0.5">
                  <Label className="text-base">Enable Auto-Scheduling</Label>
                  <p className="text-sm text-slate-500">Pause or resume all automated posting activities.</p>
               </div>
               <Switch checked={isSchedulingEnabled} onCheckedChange={setIsSchedulingEnabled} />
            </div>

            <div className="grid gap-2">
               <Label>Posting Frequency (Daily)</Label>
               <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                     <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="1">1x Daily (Morning)</SelectItem>
                     <SelectItem value="2">2x Daily (Morning, Evening)</SelectItem>
                     <SelectItem value="3">3x Daily (Morning, Noon, Evening)</SelectItem>
                     <SelectItem value="4">4x Daily (Every 4 hours)</SelectItem>
                  </SelectContent>
               </Select>
               <p className="text-xs text-slate-500">Applies to high-frequency platforms (Facebook, Instagram, LinkedIn). WhatsApp remains on a separate schedule.</p>
            </div>
         </CardContent>
      </Card>

      <Card className="border-slate-200">
         <CardHeader>
            <CardTitle>Platform Specific Overrides</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
             {['LinkedIn', 'Facebook', 'Instagram'].map(platform => (
                <div key={platform} className="grid grid-cols-3 gap-4 items-center pb-4 border-b border-slate-100 last:border-0">
                   <Label className="font-medium">{platform}</Label>
                   <div className="col-span-2 flex gap-2">
                      <Input type="time" defaultValue="08:00" className="h-8 text-xs" />
                      <Input type="time" defaultValue="12:00" className="h-8 text-xs" />
                      <Input type="time" defaultValue="18:00" className="h-8 text-xs" />
                   </div>
                </div>
             ))}
             <div className="grid grid-cols-3 gap-4 items-center">
                   <Label className="font-medium">WhatsApp</Label>
                   <div className="col-span-2">
                      <Input type="text" disabled value="Bi-weekly (Mondays 10:00 AM)" className="h-8 text-xs bg-slate-50" />
                   </div>
             </div>
         </CardContent>
      </Card>
      
      <div className="flex justify-end">
         <Button onClick={handleSave} className="bg-slate-900 text-white">
            <Save className="w-4 h-4 mr-2" /> Save Changes
         </Button>
      </div>
    </div>
  );
};

export default ScheduleConfiguration;