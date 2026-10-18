import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ShieldAlert, CheckCircle2, UserPlus, LogIn } from 'lucide-react';

export default function SuperAdminSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); 
  
  const { login } = useAuth();

  const handleCreateSuperAdmin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus({ type: 'error', message: 'Email and password are required.' });
      return;
    }

    setIsLoading(true);
    setStatus({ type: 'info', message: 'Creating user via Edge Function...' });

    try {
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('create-superadmin-user', {
        body: { email, password, metadata: { source: 'setup_panel' } }
      });

      if (edgeError) throw new Error(edgeError.message || 'Failed to invoke function');
      if (!edgeData?.success) throw new Error(edgeData?.error || 'Unknown error from function');

      const userId = edgeData.user_id;
      setStatus({ type: 'info', message: `User created (ID: ${userId}). Adding to superadmins table...` });

      const { error: dbError } = await supabase
        .from('superadmins')
        .upsert([{ email }], { onConflict: 'email' });

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      setStatus({ 
        type: 'success', 
        message: 'Superadmin setup complete!', 
        details: `User ID: ${userId} has been successfully created and configured as a superadmin.`
      });

    } catch (err) {
      setStatus({ type: 'error', message: 'Setup Failed', details: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setIsLoading(true);
    setStatus({ type: 'info', message: 'Testing login credentials...' });
    
    try {
      const { error } = await login(email, password);
      if (error) {
        setStatus({ type: 'error', message: 'Login Test Failed', details: error.message });
      } else {
        setStatus({ type: 'success', message: 'Login Successful!', details: 'You are now authenticated. You can navigate to other parts of the app.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Login Test Error', details: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="space-y-2 text-center pb-6 pt-8 bg-slate-900 text-slate-50 rounded-t-xl">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
            <ShieldAlert className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Setup</CardTitle>
          <CardDescription className="text-slate-300">
            Automated initialization of admin credentials
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
          {status && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'} 
                   className={status.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : (status.type === 'info' ? 'bg-blue-50 text-blue-900 border-blue-200' : '')}>
              {status.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {status.type === 'error' && <ShieldAlert className="h-4 w-4" />}
              <AlertTitle>{status.message}</AlertTitle>
              {status.details && <AlertDescription className="text-xs mt-1 font-mono">{status.details}</AlertDescription>}
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-slate-900 font-mono text-sm"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-slate-900 font-mono text-sm"
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pb-8">
          <Button 
            onClick={handleCreateSuperAdmin} 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white" 
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Run Automated Setup
          </Button>
          
          <Button 
            onClick={handleTestLogin} 
            variant="outline"
            className="w-full" 
            disabled={isLoading || !email || !password || status?.type !== 'success'}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Test Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}