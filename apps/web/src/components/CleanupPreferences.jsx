import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings, Save, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const CleanupPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Preferences State
  const [categories, setCategories] = useState({
      social: true,
      promotions: true,
      junk: true,
      updates: true
  });
  const [sensitivity, setSensitivity] = useState(50); // 0=Low, 50=Medium, 100=High
  const [autoDeleteJunk, setAutoDeleteJunk] = useState(false);
  const [keepImportant, setKeepImportant] = useState(true);
  const [notifications, setNotifications] = useState({
      start: true,
      complete: true
  });
  const [notifyMethod, setNotifyMethod] = useState('in-app');

  useEffect(() => {
    if (user) fetchPreferences();
  }, [user]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cleanup_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
          setCategories({
              social: data.delete_social,
              promotions: data.delete_promotions,
              junk: data.delete_junk,
              updates: data.delete_updates
          });
          setSensitivity(data.junk_sensitivity === 'High' ? 100 : data.junk_sensitivity === 'Low' ? 0 : 50);
          setAutoDeleteJunk(data.auto_delete_junk);
          setKeepImportant(data.keep_important);
          setNotifications({
              start: data.notify_start,
              complete: data.notify_complete
          });
          setNotifyMethod(data.notification_method);
      }
    } catch (err) {
      console.log("No preferences found, using defaults");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const sensitivityLabel = sensitivity > 75 ? 'High' : sensitivity < 25 ? 'Low' : 'Medium';
      
      const { error } = await supabase
        .from('cleanup_preferences')
        .upsert({
            user_id: user.id,
            delete_social: categories.social,
            delete_promotions: categories.promotions,
            delete_junk: categories.junk,
            delete_updates: categories.updates,
            junk_sensitivity: sensitivityLabel,
            auto_delete_junk: autoDeleteJunk,
            keep_important: keepImportant,
            notify_start: notifications.start,
            notify_complete: notifications.complete,
            notification_method: notifyMethod,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Preferences Saved",
        description: "Your cleanup settings have been updated.",
        className: "bg-green-50 border-green-200 text-green-900"
      });
    } catch (err) {
      toast({
        title: "Error Saving",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Cleanup Preferences
        </CardTitle>
        <CardDescription>Customize how the AI handles your emails during cleanup.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Categories Section */}
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Categories to Clean</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.keys(categories).map((cat) => (
                    <div key={cat} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <Checkbox 
                            id={`cat-${cat}`} 
                            checked={categories[cat]}
                            onCheckedChange={(checked) => setCategories({...categories, [cat]: checked})}
                        />
                        <Label htmlFor={`cat-${cat}`} className="capitalize cursor-pointer flex-1 font-medium">{cat}</Label>
                    </div>
                ))}
            </div>
        </div>

        {/* AI Sensitivity */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <Label className="font-semibold">Junk Detection Sensitivity</Label>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-white border rounded text-indigo-600">
                    {sensitivity > 75 ? 'High' : sensitivity < 25 ? 'Low' : 'Medium'}
                </span>
            </div>
            <Slider 
                value={[sensitivity]} 
                max={100} 
                step={25} 
                onValueChange={(val) => setSensitivity(val[0])}
                className="py-4"
            />
            <p className="text-xs text-slate-500">
                {sensitivity > 75 
                    ? "Aggressive filtering. May flag some newsletters as junk." 
                    : sensitivity < 25 
                        ? "Conservative filtering. Only deletes obvious spam." 
                        : "Balanced approach. Recommended for most users."}
            </p>
        </div>

        {/* Advanced Toggles */}
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Advanced Actions</h3>
            
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base">Auto-Delete Junk</Label>
                    <p className="text-sm text-slate-500">Skip trash and permanently delete identified junk.</p>
                </div>
                <Switch checked={autoDeleteJunk} onCheckedChange={setAutoDeleteJunk} />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base">Always Keep Important</Label>
                    <p className="text-sm text-slate-500">Never delete emails flagged as 'High Priority'.</p>
                </div>
                <Switch checked={keepImportant} onCheckedChange={setKeepImportant} />
            </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Notifications</h3>
            
            <div className="grid grid-cols-2 gap-4">
                 <div className="flex items-center space-x-2">
                     <Checkbox 
                        id="notify-start" 
                        checked={notifications.start}
                        onCheckedChange={(c) => setNotifications(prev => ({...prev, start: c}))}
                     />
                     <Label htmlFor="notify-start">When cleanup starts</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                     <Checkbox 
                        id="notify-complete" 
                        checked={notifications.complete}
                        onCheckedChange={(c) => setNotifications(prev => ({...prev, complete: c}))}
                     />
                     <Label htmlFor="notify-complete">When summary is ready</Label>
                 </div>
            </div>

            <RadioGroup value={notifyMethod} onValueChange={setNotifyMethod} className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-app" id="r-app" />
                    <Label htmlFor="r-app">In-App Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="r-email" />
                    <Label htmlFor="r-email">Email Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="r-both" />
                    <Label htmlFor="r-both">Both</Label>
                </div>
            </RadioGroup>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Preferences
        </Button>

      </CardContent>
    </Card>
  );
};

export default CleanupPreferences;