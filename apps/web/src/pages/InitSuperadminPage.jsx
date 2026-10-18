import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldAlert, CheckCircle2, XCircle, ArrowLeft, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InitSuperadminPage() {
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const isConfigured = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleInitialize = async () => {
    setStatus('loading');
    setErrorMessage('');
    setErrorDetails('');

    try {
      const { data, error } = await supabase.functions.invoke('init-superadmin', {
        body: { 
          email: '1angshuman.biswas@gmail.com', 
          password: 'Superadmin@123' 
        }
      });

      if (error) {
        throw new Error(error.message || "Failed to invoke edge function");
      }

      if (!data.success) {
        setErrorDetails(JSON.stringify(data, null, 2));
        throw new Error(data.error || "Failed to create superadmin user");
      }

      setStatus('success');
      toast({
        title: "Initialization Successful",
        description: "Superadmin user has been created.",
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error("Initialization error:", err);
      setStatus('error');
      setErrorMessage(err.message || "An unexpected error occurred during initialization.");
      toast({
        variant: "destructive",
        title: "Initialization Failed",
        description: err.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Link to="/login" className="absolute top-4 left-4 text-slate-400 hover:text-white flex items-center text-sm transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
      </Link>

      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl mb-4">
        <CardHeader className="space-y-1 pb-6 border-b border-slate-800 text-center">
          <div className="w-12 h-12 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-50">Superadmin Setup</CardTitle>
          <CardDescription className="text-slate-400">Initialize the default superadmin account</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between text-xs p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-slate-400">Client Configuration:</span>
            {isConfigured ? (
              <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/50">Valid</Badge>
            ) : (
              <Badge className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/20 border-rose-500/50">Missing Keys</Badge>
            )}
          </div>

          <div className="text-sm text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
            Click the button below to initialize the superadmin user. After initialization, you can login normally.
          </div>

          <div className="space-y-2 text-center text-sm font-mono text-slate-400">
            <p>Email: <span className="text-slate-200">1angshuman.biswas@gmail.com</span></p>
            <p>Password: <span className="text-slate-200">Superadmin@123</span></p>
          </div>

          {status === 'success' && (
            <Alert className="bg-emerald-950/50 border-emerald-900/50 text-emerald-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <AlertTitle className="font-semibold mb-1">Success</AlertTitle>
              <AlertDescription className="text-sm">
                Superadmin user created successfully! You can now login.
                <br /><br />
                <span className="font-semibold animate-pulse">Redirecting to login...</span>
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert className="bg-rose-950/50 border-rose-900/50 text-rose-400 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-rose-500" />
                <AlertTitle className="font-semibold m-0">Error</AlertTitle>
              </div>
              <AlertDescription className="text-sm">
                {errorMessage}
                {errorDetails && (
                  <pre className="mt-2 text-xs bg-rose-950/80 p-2 rounded overflow-x-auto text-rose-300 border border-rose-900/50">
                    {errorDetails}
                  </pre>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button 
            onClick={handleInitialize} 
            disabled={status === 'loading' || status === 'success'}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            {status === 'loading' ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Initializing...</>
            ) : (
              "Initialize Superadmin User"
            )}
          </Button>
          
          <Link to="/debug-superadmin" className="w-full">
            <Button variant="outline" className="w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
              <Bug className="mr-2 h-4 w-4" /> Debug Initialization
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}