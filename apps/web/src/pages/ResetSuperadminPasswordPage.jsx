import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { invokeResetSuperadminPassword } from '@/utils/resetSuperadminPassword';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Key, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ResetSuperadminPasswordPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [resetResult, setResetResult] = useState(null);
  const [loginResult, setLoginResult] = useState(null);
  const { toast } = useToast();

  const targetEmail = "1angshuman.biswas@gmail.com";
  const targetPassword = "Superadmin@123";

  const handleReset = async () => {
    setIsResetting(true);
    setResetResult(null);
    
    try {
      const data = await invokeResetSuperadminPassword();
      setResetResult({ type: 'success', message: data.message });
      toast({
        title: "Success",
        description: "Password reset executed successfully.",
      });
    } catch (err) {
      setResetResult({ type: 'error', message: err.message });
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: err.message,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoggingIn(true);
    setLoginResult(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: targetPassword,
      });

      if (error) throw error;
      
      if (data?.user) {
        setLoginResult({ 
          type: 'success', 
          message: `Login successful! User ID: ${data.user.id}` 
        });
        toast({
          title: "Login Success",
          description: "Authentication with new password worked.",
        });
      }
    } catch (err) {
      setLoginResult({ type: 'error', message: err.message });
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-start justify-center pt-20">
      <div className="w-full max-w-xl space-y-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-600" />
              Reset Superadmin Password
            </CardTitle>
            <CardDescription>
              Force reset the password for user ID 1a9d186f6 to the default password using Supabase Admin Client.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-100 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-3 items-center text-sm">
                <span className="font-semibold text-slate-600">Target Email:</span>
                <span className="col-span-2 font-mono">{targetEmail}</span>
              </div>
              <div className="grid grid-cols-3 items-center text-sm">
                <span className="font-semibold text-slate-600">New Password:</span>
                <span className="col-span-2 font-mono">{targetPassword}</span>
              </div>
              <div className="grid grid-cols-3 items-center text-sm">
                <span className="font-semibold text-slate-600">Target User ID:</span>
                <span className="col-span-2 font-mono text-xs">1a9d186f6</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleReset} 
                  disabled={isResetting}
                  className="w-full"
                >
                  {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Trigger Password Reset
                </Button>
                
                {resetResult && (
                  <div className={`p-3 rounded text-sm flex items-start gap-2 ${resetResult.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {resetResult.type === 'success' ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : <ShieldAlert className="h-4 w-4 mt-0.5" />}
                    <span>{resetResult.message}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">Test Authentication</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input value={targetEmail} readOnly className="bg-slate-50" />
                  </div>
                  <div className="space-y-1">
                    <Label>Password</Label>
                    <Input value={targetPassword} readOnly type="password" className="bg-slate-50" />
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={handleTestLogin} 
                    disabled={isLoggingIn}
                    className="w-full"
                  >
                    {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Test Login
                  </Button>

                  {loginResult && (
                    <div className={`p-3 rounded text-sm flex items-start gap-2 ${loginResult.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {loginResult.type === 'success' ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : <ShieldAlert className="h-4 w-4 mt-0.5" />}
                      <span className="break-all">{loginResult.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}