import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TestSuperadminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState({ recreate: false, login: false, verify: false });
  const { toast } = useToast();

  const addLog = (type, message, details = null) => {
    setLogs(prev => [...prev, { type, message, details, time: new Date().toISOString() }]);
  };

  const handleRecreate = async () => {
    if (!email || !password) {
      toast({ variant: "destructive", title: "Error", description: "Email and password required" });
      return;
    }
    setIsLoading(prev => ({ ...prev, recreate: true }));
    addLog('info', 'Invoking Edge Function: fix-superadmin-auth...');
    
    try {
      const { data, error } = await supabase.functions.invoke('fix-superadmin-auth', {
        body: { email, password }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        addLog('success', 'User recreated successfully', data);
        toast({ title: "Success", description: "User has been recreated." });
      } else {
        throw new Error(data?.error || 'Unknown edge function error');
      }
    } catch (err) {
      addLog('error', 'Failed to recreate user', err.message);
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(prev => ({ ...prev, recreate: false }));
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ variant: "destructive", title: "Error", description: "Email and password required" });
      return;
    }
    setIsLoading(prev => ({ ...prev, login: true }));
    addLog('info', `Attempting login with ${email}...`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data?.session) {
        addLog('success', 'Login successful!', {
          user_id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role,
          access_token: `${data.session.access_token.substring(0, 15)}...`
        });
        toast({ title: "Login Success", description: "Successfully authenticated." });
      }
    } catch (err) {
      addLog('error', 'Login failed', err.message);
      toast({ variant: "destructive", title: "Login Failed", description: err.message });
    } finally {
      setIsLoading(prev => ({ ...prev, login: false }));
    }
  };

  const handleVerify = async () => {
    if (!email) {
      toast({ variant: "destructive", title: "Error", description: "Email required" });
      return;
    }
    setIsLoading(prev => ({ ...prev, verify: true }));
    addLog('info', 'Verifying user in superadmins table...');
    
    try {
      const { data, error } = await supabase
        .from('superadmins')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('User not found in superadmins table.');
        }
        throw error;
      }
      
      addLog('success', 'User found in database', data);
      toast({ title: "Verified", description: "User exists in superadmins table." });
    } catch (err) {
      addLog('error', 'Verification failed', err.message);
      toast({ variant: "destructive", title: "Verification Failed", description: err.message });
    } finally {
      setIsLoading(prev => ({ ...prev, verify: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Auth Debugger
            </CardTitle>
            <CardDescription>
              Test and fix authentication issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Target Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} className="bg-white font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input value={password} onChange={e => setPassword(e.target.value)} className="bg-white font-mono text-sm" type="password" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div>
                  <h4 className="font-semibold text-sm">Step 1: Recreate Account</h4>
                  <p className="text-xs text-slate-500 mt-1">Deletes existing account and creates a fresh one with confirmed email.</p>
                </div>
                <Button onClick={handleRecreate} disabled={isLoading.recreate}>
                  {isLoading.recreate ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Run Edge Function
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div>
                  <h4 className="font-semibold text-sm">Step 2: Verify in DB</h4>
                  <p className="text-xs text-slate-500 mt-1">Check if the user exists in the `superadmins` table.</p>
                </div>
                <Button variant="outline" onClick={handleVerify} disabled={isLoading.verify}>
                  {isLoading.verify ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Verify Database
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div>
                  <h4 className="font-semibold text-sm">Step 3: Test Login</h4>
                  <p className="text-xs text-slate-500 mt-1">Attempt to authenticate with Supabase Auth.</p>
                </div>
                <Button variant="secondary" onClick={handleLogin} disabled={isLoading.login}>
                  {isLoading.login ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Test Sign In
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <Card className="h-full border-slate-200 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-mono flex justify-between items-center">
              Execution Logs
              <Button variant="ghost" size="sm" onClick={() => setLogs([])} className="h-6 text-xs">Clear</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 bg-slate-900 rounded-b-lg p-4 font-mono text-xs overflow-y-auto max-h-[600px]">
            {logs.length === 0 ? (
              <span className="text-slate-500">Waiting for actions...</span>
            ) : (
              <div className="space-y-3">
                {logs.map((log, i) => (
                  <div key={i} className="border-l-2 border-slate-700 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-500">{new Date(log.time).toLocaleTimeString()}</span>
                      {log.type === 'success' && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                      {log.type === 'error' && <XCircle className="h-3 w-3 text-rose-400" />}
                      {log.type === 'info' && <ArrowRight className="h-3 w-3 text-blue-400" />}
                      <span className={
                        log.type === 'success' ? 'text-emerald-400 font-semibold' :
                        log.type === 'error' ? 'text-rose-400 font-semibold' :
                        'text-blue-400 font-semibold'
                      }>
                        {log.message}
                      </span>
                    </div>
                    {log.details && (
                      <pre className="text-slate-300 bg-slate-800 p-2 rounded mt-1 overflow-x-auto">
                        {typeof log.details === 'object' ? JSON.stringify(log.details, null, 2) : log.details}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}