import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, Mail, AlertCircle, Bug } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/erp';

  useEffect(() => {
    setErrorMsg('');
    setDebugInfo(null);
  }, []);

  const handleChange = (e) => {
    setErrorMsg(''); 
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.trim()) {
      setErrorMsg('Please enter a valid email');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email format');
      return false;
    }
    if (!formData.password) {
      setErrorMsg('Please enter a password');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setDebugInfo(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const emailToUse = formData.email.toLowerCase().trim();
      const passwordToUse = formData.password; 
      
      const { data, error } = await login(emailToUse, passwordToUse);
      
      if (error) {
        throw error;
      }

      if (data?.user) {
        toast({
          title: "Login Successful",
          description: "Welcome to the ERP system.",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200"
        });
        
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error("=== LOGIN ERROR ===", error);
      
      let friendlyError = 'Authentication failed. Please try again.';
      
      if (error.message?.includes('Invalid login credentials')) {
        friendlyError = 'Invalid email or password. Please check your credentials.';
      } else if (error.message?.includes('Email not confirmed')) {
        friendlyError = 'Please verify your email address before logging in. Check auth.users table in Supabase.';
      } else if (error.message) {
        friendlyError = error.message;
      }
      
      setErrorMsg(friendlyError);
      
      setDebugInfo({
        message: error.message,
        status: error.status,
        name: error.name
      });

      toast({
        title: "Authentication Failed",
        description: friendlyError,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="space-y-1 text-center pb-6 pt-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="font-bold text-2xl text-primary-foreground">H</span>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Horizons ERP
          </CardTitle>
          <CardDescription>
            Secure Enterprise Resource Planning System
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMsg && (
              <Alert variant="destructive" className="py-2 px-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">{errorMsg}</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <Alert variant="default" className="py-2 px-3 bg-amber-50 border-amber-200 text-amber-900">
                <Bug className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 text-xs font-bold uppercase tracking-wider">Debug Info</AlertTitle>
                <AlertDescription className="ml-2 text-xs font-mono break-all mt-1">
                  <div>Message: {debugInfo.message}</div>
                  <div>Status: {debugInfo.status || 'N/A'}</div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-9 focus-visible:ring-primary text-slate-900"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="p-0 h-auto text-xs text-primary" type="button" onClick={() => toast({ title: "Forgot Password", description: "🚧 Password reset feature is not implemented yet!" })}>
                  Forgot Password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-9 focus-visible:ring-primary text-slate-900"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;