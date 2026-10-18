import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wrench, ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Terminal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function DebugAuthPage() {
  const [email, setEmail] = useState('1angshuman.biswas@gmail.com');
  const [password, setPassword] = useState('Superadmin@123');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState(null);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerifyCreate = async () => {
    setIsVerifying(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('debug-and-fix-auth', {
        body: { email, password }
      });
      
      if (error) {
        throw error;
      }
      
      setResult({
        type: data.success ? 'success' : 'error',
        message: data.message || data.error,
        details: data.user_id ? `User ID: ${data.user_id}` : null
      });
      
      if (data.success) {
        toast({ title: "Operation Successful", description: data.message });
      }
      
    } catch (err) {
      setResult({
        type: 'error',
        message: 'Edge Function Execution Failed',
        details: err.message
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleTestLogin = async () => {
    setIsTesting(true);
    setResult(null);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setResult({
          type: 'error',
          message: 'Login Failed',
          details: `${error.message} (Status: ${error.status || 'unknown'})`
        });
      } else {
        setResult({
          type: 'success',
          message: 'Login Successful!',
          details: 'You are now authenticated. Redirecting to dashboard...'
        });
        
        toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setResult({
        type: 'error',
        message: 'Unexpected Login Error',
        details: err.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Link to="/login" className="absolute top-4 left-4 text-slate-400 hover:text-white flex items-center text-sm">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
      </Link>

      <Card className="w-full max-w-lg bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
        <CardHeader className="space-y-1 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-md">
              <Wrench className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-50">Auth Debug & Fix Tool</CardTitle>
              <CardDescription className="text-slate-400">Manage and verify superadmin credentials</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="space-y-2">
              <Label htmlFor="debug-email" className="text-slate-300">Target Email</Label>
              <Input 
                id="debug-email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border-slate-700 text-slate-100 focus-visible:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="debug-password" className="text-slate-300">Target Password</Label>
              <Input 
                id="debug-password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-900 border-slate-700 text-slate-100 focus-visible:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleVerifyCreate} 
              disabled={isVerifying || isTesting}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isVerifying ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working...</>
              ) : (
                <><ShieldCheck className="mr-2 h-4 w-4" /> Verify / Create User</>
              )}
            </Button>
            
            <Button 
              onClick={handleTestLogin} 
              disabled={isVerifying || isTesting}
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {isTesting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing...</>
              ) : (
                <><Terminal className="mr-2 h-4 w-4" /> Test Login</>
              )}
            </Button>
          </div>

          {result && (
            <Alert className={`mt-6 ${
              result.type === 'success' 
                ? 'bg-emerald-950/50 border-emerald-900/50 text-emerald-400' 
                : 'bg-rose-950/50 border-rose-900/50 text-rose-400'
            }`}>
              {result.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-500" />
              )}
              <AlertTitle className="font-semibold mb-1">
                {result.type === 'success' ? 'Success' : 'Error'}
              </AlertTitle>
              <AlertDescription className="text-sm space-y-1">
                <div className="font-medium">{result.message}</div>
                {result.details && (
                  <div className="font-mono text-xs opacity-80 mt-2 p-2 bg-black/30 rounded">
                    {result.details}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}