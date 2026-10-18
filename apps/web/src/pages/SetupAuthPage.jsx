import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Database, CheckCircle2, XCircle, ArrowRight, Info } from 'lucide-react';

export default function SetupAuthPage() {
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const envStatus = {
    supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    anonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: !!import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  };

  const isEnvConfigured = envStatus.supabaseUrl && envStatus.anonKey;

  const handleCreateSuperadmin = async () => {
    setStatus('loading');
    setErrorMsg('');

    try {
      // Calling the Edge Function to securely handle Admin API requests
      const { data, error } = await supabase.functions.invoke('create-superadmin-edge-function', {
        body: { 
          email: '1angshuman.biswas@gmail.com', 
          password: 'Superadmin@123' 
        }
      });

      if (error) {
        throw new Error(error.message || "Failed to invoke edge function");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to create superadmin user");
      }

      setStatus('success');
      toast({
        title: "Success",
        description: "Superadmin user created successfully! You can now login.",
      });

    } catch (err) {
      console.error("Creation error:", err);
      setStatus('error');
      setErrorMsg(err.message || "An unexpected error occurred.");
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: err.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
        <CardHeader className="text-center pb-4 border-b border-slate-800">
          <div className="mx-auto w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
            <Database className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Setup Auth</CardTitle>
          <CardDescription className="text-slate-400">Environment & Superadmin Initialization</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300">Environment Configuration</h3>
            </div>
            
            {!isEnvConfigured && (
              <Alert className="bg-amber-950/50 border-amber-900/50 text-amber-400">
                <Info className="h-4 w-4 text-amber-500" />
                <AlertTitle>Missing Configuration</AlertTitle>
                <AlertDescription className="text-sm mt-1">
                  Please configure Supabase environment variables in .env.local
                </AlertDescription>
              </Alert>
            )}

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2 text-slate-400">
              <p>Get these keys from your Supabase dashboard:</p>
              <p className="font-medium text-slate-300">Settings → API</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-400">VITE_SUPABASE_URL</span>
                {envStatus.supabaseUrl ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30">✓ Configured</Badge>
                ) : (
                  <Badge variant="destructive" className="bg-rose-500/20 text-rose-400 border-rose-500/50 hover:bg-rose-500/30">✗ Missing</Badge>
                )}
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-400">VITE_SUPABASE_ANON_KEY</span>
                {envStatus.anonKey ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30">✓ Configured</Badge>
                ) : (
                  <Badge variant="destructive" className="bg-rose-500/20 text-rose-400 border-rose-500/50 hover:bg-rose-500/30">✗ Missing</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-sm space-y-2 text-slate-300">
            <p><strong>Target Superadmin User:</strong></p>
            <p className="font-mono text-xs text-blue-400">Email: 1angshuman.biswas@gmail.com</p>
            <p className="font-mono text-xs text-blue-400">Password: Superadmin@123</p>
          </div>

          {status === 'success' && (
            <Alert className="bg-emerald-950/50 border-emerald-900/50 text-emerald-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription className="text-sm mt-1">
                Superadmin user created successfully! You can now login.
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert className="bg-rose-950/50 border-rose-900/50 text-rose-400">
              <XCircle className="h-4 w-4 text-rose-500" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm mt-1 break-words">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3 border-t border-slate-800 pt-6">
          {status === 'success' ? (
            <Button onClick={() => navigate('/login')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Proceed to Login <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleCreateSuperadmin} 
              disabled={status === 'loading' || !isEnvConfigured}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
              {status === 'loading' ? 'Processing...' : 'Create Superadmin User Manually'}
            </Button>
          )}
          <Link to="/login" className="text-sm text-slate-400 hover:text-slate-300 underline mt-2 text-center w-full">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}