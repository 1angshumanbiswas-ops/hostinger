import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          setCurrentUser(session?.user ?? null);
          setIsAuthenticated(!!session?.user);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setCurrentUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (!error && data?.user) {
      setCurrentUser(data.user);
      setIsAuthenticated(true);
    }
    
    return { data, error };
  };

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password 
    });
    
    if (!error && data?.user) {
      setCurrentUser(data.user);
      setIsAuthenticated(true);
    }
    
    return { data, error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
    
    return { error };
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};