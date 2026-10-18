import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, ShieldAlert, Play, CheckCircle2, LogIn, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuperadminDebugPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (action, status, data) => {
    setLogs(prev => [...prev, {
      time: new Date().toISOString(),
      action,
      status,
      data: JSON.stringify(data, null, 2)
    }]);
  };

  const handleDirectCreate = async () => {
    if (!email || !password) {
      addLog('Validation', 'error', 'Email and password required');
      return;
    }
    setLoading(true);
    addLog('Direct Create', 'pending', { email });
    try {
      const { data, error } = await supabase.functions.invoke('create-superadmin-direct', {
        body: { email, password }
      });
      if (error) throw error;
      addLog('Direct Create', 'success', data);
    } catch (err) {
      addLog('Direct Create', 'error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!email) {
      addLog('Validation', 'error', 'Email required');
      return;
    }
    setLoading(true);
    addLog('Verify User', 'pending', { email });
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      addLog('Verify User (Reset Pwd Check)', 'success', data);
    } catch (err) {
      addLog('Verify User', 'error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    if (!email || !password) {
      addLog('Validation', 'error', 'Email and password required');
      return;
    }
    setLoading(true);
    addLog('Test Login', 'pending', { email });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      addLog('Test Login', 'success', { user_id: data.user?.id, role: data.user?.user_metadata?.role });
    } catch (err) {
      addLog('Test Login', 'error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <Link to="/debug-auth" className="text-slate-400 hover:text-white flex items-center text-sm transition-colors w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Setup
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-amber-500" />
                <CardTitle>Diagnostics</CardTitle>
              </div>
              <CardDescription className="text-slate-400">Directly test auth operations</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3 mb-6">
                <Input 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
                <Input 
                  placeholder="Password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <Button onClick={handleDirectCreate} disabled={loading} className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <Play className="mr-2 h-4 w-4" /> 1. Create via Admin Client (Direct)
              </Button>
              <Button onClick={handleVerify} disabled={loading} variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <CheckCircle2 className="mr-2 h-4 w-4" /> 2. Verify User Exists
              </Button>
              <Button onClick={handleTestLogin} disabled={loading} variant="outline" className="w-full justify-start border-emerald-700/50 text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-300">
                <LogIn className="mr-2 h-4 w-4" /> 3. Test Login
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border-slate-800 text-slate-100 shadow-2xl flex flex-col h-[450px]">
            <CardHeader className="border-b border-slate-800 py-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-slate-400" />
                <CardTitle className="text-lg">Console Logs</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full w-full p-4 font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="text-slate-500 italic text-center mt-4">No logs yet. Run an action.</div>
                ) : (
                  <div className="space-y-4">
                    {logs.map((log, i) => (
                      <div key={i} className={`p-3 rounded border ${log.status === 'error' ? 'border-rose-900/50 bg-rose-950/20 text-rose-300' : log.status === 'success' ? 'border-emerald-900/50 bg-emerald-950/20 text-emerald-300' : 'border-blue-900/50 bg-blue-950/20 text-blue-300'}`}>
                        <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-1">
                          <span className="font-bold">{log.action}</span>
                          <span className="text-[10px] opacity-50">{new Date(log.time).toLocaleTimeString()}</span>
                        </div>
                        <pre className="whitespace-pre-wrap overflow-x-auto">{log.data}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}