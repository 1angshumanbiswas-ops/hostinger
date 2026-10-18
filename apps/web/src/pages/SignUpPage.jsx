import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, AlertCircle, LayoutGrid } from 'lucide-react';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/job-assistant';

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email format.');
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return false;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await signup(email, password);

      if (error) {
        if (error.message.includes('already registered')) {
          setErrorMsg('An account with this email already exists.');
        } else {
          setErrorMsg(error.message);
        }
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message,
        });
      } else if (data?.user) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please log in.",
        });
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-3xl" />

      <Card className="w-full max-w-[400px] shadow-2xl border-slate-200 dark:border-slate-800 relative z-10 bg-white dark:bg-slate-900">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <LayoutGrid className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create Account</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 mt-1">Sign up for a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-5">
            {errorMsg && (
              <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900 py-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2 text-sm font-medium">{errorMsg}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2 text-left">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={`bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white h-11 ${errorMsg ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary'}`}
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className={`bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white h-11 ${errorMsg ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary'}`}
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300 font-medium">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className={`bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white h-11 ${errorMsg ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-primary'}`}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 text-white transition-all shadow-md hover:shadow-lg" 
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-sm text-slate-400 dark:text-slate-500 relative z-10">
        &copy; {new Date().getFullYear()} My Digital Space. All rights reserved.
      </p>
    </div>
  );
}