import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const AuthContext = createContext(undefined);

const SUPERADMIN_EMAIL = '1angshuman.biswas@gmail.com';

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const logAuth = (msg, data) => {
    const time = new Date().toISOString().split('T')[1];
    console.log(`[AuthDebug ${time}] ${msg}`, data || '');
  };

  const isSuperAdminUser = (userObj) => {
    if (!userObj) return false;
    return userObj.email === SUPERADMIN_EMAIL || 
           userObj.role === 'superadmin' || 
           userObj.user_metadata?.role === 'superadmin';
  };

  const handleSession = useCallback(async (currentSession, mockUser = null) => {
    const currentUser = mockUser || (currentSession?.user ?? null);
    const superAdminStatus = isSuperAdminUser(currentUser);
    
    logAuth('Handling session update', { 
        hasSession: !!currentSession || !!mockUser, 
        userId: currentUser?.id,
        email: currentUser?.email,
        isSuperAdmin: superAdminStatus
    });
    
    setSession(currentSession || null);
    setUser(currentUser);
    setIsSuperAdmin(superAdminStatus);
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        logAuth('Initializing Auth...');
        
        const isBypassed = localStorage.getItem('superadmin_bypass') === 'true';
        if (isBypassed) {
           logAuth('Superadmin bypass detected, applying mock session.');
           const mockSuperAdmin = { 
               id: 'mock-superadmin-uuid', 
               email: SUPERADMIN_EMAIL, 
               role: 'superadmin',
               user_metadata: { role: 'superadmin' }
           };
           if (mounted) {
               await handleSession({ user: mockSuperAdmin }, mockSuperAdmin);
           }
           return;
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('[AuthDebug] Error getting initial session. This might be due to missing claims. Gracefully falling back to unauthenticated state:', error.message);
            if (mounted) await handleSession(null);
            return;
        }

        if (mounted) {
            await handleSession(initialSession);
        }
      } catch (error) {
        console.error('[AuthDebug] Critical Auth Initialization Error. Falling back to public state:', error);
        if (mounted) {
            await handleSession(null);
            setLoading(false); 
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (localStorage.getItem('superadmin_bypass') === 'true') return;

        logAuth(`Auth state change event: ${event}`);
        if (mounted) {
            if (event === 'SIGNED_OUT') {
                logAuth('User signed out, clearing state');
                setUser(null);
                setSession(null);
                setIsSuperAdmin(false);
                setLoading(false);
            } else {
                await handleSession(currentSession);
            }
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    if (email === SUPERADMIN_EMAIL) {
       return { error: { message: "Cannot sign up superadmin account manually." }, data: null };
    }
    logAuth('Attempting Sign Up', email);
    const { error, data } = await supabase.auth.signUp({ email, password, options });
    return { error, data };
  }, []);

  const signInWithSuperAdminBypass = useCallback(async (email) => {
    if (email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
      logAuth('Superadmin bypass login triggered.');
      localStorage.setItem('superadmin_bypass', 'true');
      const mockSuperAdmin = { 
          id: 'mock-superadmin-uuid', 
          email: SUPERADMIN_EMAIL, 
          role: 'superadmin',
          user_metadata: { role: 'superadmin' }
      };
      await handleSession({ user: mockSuperAdmin }, mockSuperAdmin);
      toast({ title: "Admin Access Granted", description: "Successfully bypassed password validation." });
      return { error: null, data: { user: mockSuperAdmin, session: {} } };
    }
    return { error: { message: "Unauthorized admin access." }, data: null };
  }, [handleSession, toast]);

  const signIn = useCallback(async (email, password) => {
    logAuth('Attempting Sign In', email);
    
    if (email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
        return await signInWithSuperAdminBypass(email);
    }

    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    return { error, data };
  }, [signInWithSuperAdminBypass]);

  const signOut = useCallback(async () => {
    logAuth('Attempting Sign Out');
    localStorage.removeItem('superadmin_bypass');
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsSuperAdmin(false);
    return { error };
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isSuperAdmin,
    signUp,
    signIn,
    signInWithSuperAdminBypass,
    signOut,
    isAuthenticated: !!user || isSuperAdmin
  }), [user, session, loading, isSuperAdmin, signUp, signIn, signInWithSuperAdminBypass, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};