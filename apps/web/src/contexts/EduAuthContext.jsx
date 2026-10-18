import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const EduAuthContext = createContext({});

export const EduAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted && session?.user) {
          setCurrentUser(session.user);
          setIsAuthenticated(true);
          setIsAdmin(session.user.user_metadata?.role === 'admin');
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
        setIsAdmin(session?.user?.user_metadata?.role === 'admin');
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data?.user) {
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      setIsAdmin(data.user.user_metadata?.role === 'admin');
    }
    return { data, error };
  };

  const signup = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'student' // Default role
        }
      }
    });
    return { data, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <EduAuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isAdmin,
      isLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </EduAuthContext.Provider>
  );
};

export const useEduAuth = () => useContext(EduAuthContext);