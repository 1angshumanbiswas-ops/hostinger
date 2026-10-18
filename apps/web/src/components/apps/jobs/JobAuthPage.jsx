import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Briefcase, Loader2, ShieldCheck } from 'lucide-react';

export default function JobAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithSuperAdminBypass } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/jobs/dashboard';
  const isSuperAdminEmail = email.toLowerCase().trim() === '1angshuman.biswas@gmail.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSuperAdminEmail) {
        const { error } = await signInWithSuperAdminBypass(email);
        if (error) throw error;
        navigate(from, { replace: true });
        return;
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "You can now sign in.",
        });
        setIsLogin(true);
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Card className={`w-full max-w-md shadow-xl transition-all duration-300 ${isSuperAdminEmail ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'}`}>
        <CardHeader className="space-y-2 text-center pb-6 relative overflow-hidden">
          {isSuperAdminEmail && (
            <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
               <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300 flex items-center gap-1">
                 <ShieldCheck className="w-3 h-3" />
                 Admin Access
               </Badge>
            </div>
          )}
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${isSuperAdminEmail ? 'bg-amber-100' : 'bg-emerald-100'}`}>
            <Briefcase className={`w-6 h-6 ${isSuperAdminEmail ? 'text-amber-600' : 'text-emerald-600'}`} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            {isSuperAdminEmail ? 'Superadmin Login' : (isLogin ? 'Welcome back' : 'Create an account')}
          </CardTitle>
          <CardDescription className="text-slate-500">
            {isSuperAdminEmail ? 'Password bypass activated for admin account' : (isLogin ? 'Enter your credentials to access your account' : 'Enter your details to start finding jobs')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`text-slate-900 bg-white ${isSuperAdminEmail ? 'border-amber-300 focus-visible:ring-amber-500' : ''}`}
              />
            </div>
            
            {!isSuperAdminEmail && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <button type="button" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isSuperAdminEmail}
                  className="text-slate-900 bg-white"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className={`w-full text-white transition-colors ${isSuperAdminEmail ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`} 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSuperAdminEmail ? 'Sign In as Admin' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          {!isSuperAdminEmail && (
            <div className="mt-6 text-center text-sm text-slate-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          )}
          
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-400 mb-2">Admin Demo Access</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-dashed border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={() => setEmail('1angshuman.biswas@gmail.com')}
              >
                Fill Superadmin Email
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}