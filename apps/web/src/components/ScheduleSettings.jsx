import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar, Save, Loader2, AlertCircle, ChevronsUpDown, Check } from 'lucide-react';
import { useAutoCleanupSchedule } from '@/hooks/useAutoCleanupSchedule';
import { useMultiAccount } from '@/hooks/useMultiAccount';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

const ScheduleSettings = () => {
  // Use multi-account hook to get context
  const { currentAccount, accounts, switchAccount, loading: accountsLoading } = useMultiAccount();
  
  // Pass currentAccount to schedule hook
  const { schedule, countdown, loading: fetchLoading, updateSchedule, nextCleanupTime } = useAutoCleanupSchedule(currentAccount);
  
  const { toast } = useToast();
  
  const [enabled, setEnabled] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (schedule) {
      setEnabled(schedule.enabled);
      setSelectedDay(schedule.day_of_week);
      setSelectedHour(schedule.hour);
      setSelectedMinute(schedule.minute);
    } else if (!fetchLoading) {
      // Defaults
      setEnabled(false);
    }
  }, [schedule, fetchLoading]);

  const handleSave = async () => {
    if (!currentAccount) return;
    try {
      setSaving(true);
      await updateSchedule(selectedDay, selectedHour, selectedMinute, enabled);
      toast({
        title: "Schedule Updated",
        description: `Cleanup scheduled for ${DAYS.find(d => d.value === selectedDay)?.label}s at ${selectedHour}:${selectedMinute.toString().padStart(2, '0')}`,
        className: "bg-green-50 border-green-200 text-green-900"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update schedule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (accountsLoading) {
       return <Card className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" /></Card>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Auto-Cleanup Schedule
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                    <CardDescription>
                        Configure for:
                    </CardDescription>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 text-xs border-dashed">
                                {currentAccount ? currentAccount.account_email : "Select Account"}
                                <ChevronsUpDown className="ml-2 h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>Select Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {accounts.map((acc) => (
                                <DropdownMenuItem key={acc.id} onClick={() => switchAccount(acc.id)}>
                                    <span className="truncate">{acc.account_email}</span>
                                    {currentAccount?.id === acc.id && <Check className="ml-auto h-4 w-4" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {enabled && nextCleanupTime && currentAccount && (
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border border-indigo-100">
                    <Clock className="w-3 h-3" />
                    Next run in: {countdown}
                </div>
            )}
        </div>
      </CardHeader>
      
      {!currentAccount ? (
         <CardContent>
            <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg">
                Please add or select an account to configure a schedule.
            </div>
         </CardContent>
      ) : fetchLoading ? (
         <CardContent>
             <div className="h-[200px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
         </CardContent>
      ) : (
        <CardContent className="space-y-6">
            {/* Toggle Enable */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                    <Label className="text-base font-medium">Enable Weekly Cleanup</Label>
                    <p className="text-sm text-slate-500">Automatically run mail cleanup once a week for {currentAccount.account_email}.</p>
                </div>
                <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>

            {/* Schedule Inputs */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-200 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-2">
                    <Label>Day of Week</Label>
                    <Select 
                        value={selectedDay.toString()} 
                        onValueChange={(val) => setSelectedDay(parseInt(val))}
                        disabled={!enabled}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                            {DAYS.map((day) => (
                                <SelectItem key={day.value} value={day.value.toString()}>
                                    {day.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label>Hour (24h)</Label>
                    <Select 
                        value={selectedHour.toString()} 
                        onValueChange={(val) => setSelectedHour(parseInt(val))}
                        disabled={!enabled}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select hour" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {HOURS.map((h) => (
                                <SelectItem key={h} value={h.toString()}>
                                    {h.toString().padStart(2, '0')}:00
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Minute</Label>
                    <Select 
                        value={selectedMinute.toString()} 
                        onValueChange={(val) => setSelectedMinute(parseInt(val))}
                        disabled={!enabled}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select minute" />
                        </SelectTrigger>
                        <SelectContent>
                            {MINUTES.map((m) => (
                                <SelectItem key={m} value={m.toString()}>
                                    {m.toString().padStart(2, '0')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Summary & Save */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                <div className="text-sm text-slate-500">
                    {enabled ? (
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-green-500" />
                            Scheduled for <strong>Every {DAYS.find(d => d.value === selectedDay)?.label}</strong> at <strong>{selectedHour}:{selectedMinute.toString().padStart(2, '0')}</strong>
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-slate-400">
                            <AlertCircle className="w-4 h-4" />
                            Auto-cleanup is disabled.
                        </span>
                    )}
                </div>
                
                <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Schedule
                        </>
                    )}
                </Button>
            </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ScheduleSettings;