import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { toast } = useToast();

  // Clear success message after 5 seconds
  useEffect(() => {
    let timer;
    if (isSuccess) {
      timer = setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSuccess]);

  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrorMsg("Please enter a valid email format.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        setErrorMsg(error.message || "Failed to send magic link.");
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        setIsSuccess(true);
        toast({ title: "Magic Link Sent!", description: "Check your email for the login link." });
      }
    } catch (err) {
      setErrorMsg(`An unexpected error occurred: ${err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4 py-4 animate-in fade-in-50 zoom-in-95">
        <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Check your email for login link</h3>
        <p className="text-sm text-slate-500">
          We've sent a magic login link to <strong>{email}</strong>. Click the link to instantly sign in.
        </p>
        <Button variant="outline" className="w-full mt-4 text-slate-900" onClick={() => setIsSuccess(false)}>
          Send another link
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleMagicLinkSubmit} className="space-y-4 animate-in fade-in-50 zoom-in-95">
      {errorMsg && (
        <Alert variant="destructive" className="py-2.5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2 text-sm">{errorMsg}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email-magic">Email</Label>
        <p className="text-xs text-slate-500 pb-1">We'll send you a secure login link via email.</p>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            id="email-magic" 
            type="email" 
            placeholder="name@company.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 focus-visible:ring-primary text-slate-900"
            disabled={isLoading}
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Link...</>
        ) : (
          "Send Magic Link"
        )}
      </Button>
    </form>
  );
}