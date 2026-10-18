import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, X, Terminal, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DebugAuthPanel({ isVisible, onClose }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [isFixing, setIsFixing] = useState(false);
  const [debugResult, setDebugResult] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const runDebugAndFix = async () => {
    setIsFixing(true);
    setDebugResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('debug-user-auth');
      
      if (error) throw error;
      
      setDebugResult(data);
      setAutoRefresh(true);
    } catch (error) {
      setDebugResult({ 
        success: false, 
        error_message: error.message || "Failed to invoke edge function" 
      });
    } finally {
      setIsFixing(false);
    }
  };

  useEffect(() => {
    let interval;
    if (autoRefresh && isVisible) {
      interval = setInterval(() => {
        // In a real scenario we might re-poll status, but we'll just log the active state
        console.log("[Debug Panel] Auto-refreshing status...");
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50 w-full max-w-md shadow-2xl debug-panel"
      >
        <Card className="border-primary/20 bg-background/95 backdrop-blur-md">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Auth Debug Panel
              </CardTitle>
              <CardDescription className="text-xs">
                Investigating: 1angshuman.biswas@gmail.com
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="text-xs space-y-2 bg-muted p-3 rounded-md font-mono">
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span className={isAuthenticated ? "text-positive" : "text-amber-500"}>
                  {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Email:</span>
                <span>{currentUser?.email || "None"}</span>
              </div>
            </div>

            {debugResult && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-xs space-y-2 bg-slate-900 text-slate-50 p-3 rounded-md font-mono"
              >
                <div className="font-bold border-b border-slate-700 pb-1 mb-2">Function Output:</div>
                <div className="flex justify-between">
                  <span>User Exists:</span>
                  <span className={debugResult.user_exists ? "text-emerald-400" : "text-rose-400"}>
                    {debugResult.user_exists ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Email Confirmed:</span>
                  <span className={debugResult.email_confirmed ? "text-emerald-400" : "text-rose-400"}>
                    {debugResult.email_confirmed ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Superadmin Table:</span>
                  <span className={debugResult.superadmin_created ? "text-emerald-400" : "text-rose-400"}>
                    {debugResult.superadmin_created ? "Added" : "Missing/Failed"}
                  </span>
                </div>
                {debugResult.error_message && (
                  <div className="text-rose-400 mt-2 pt-2 border-t border-slate-700">
                    Error: {debugResult.error_message}
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={runDebugAndFix} 
                disabled={isFixing}
                className="w-full text-xs"
                variant={debugResult?.success ? "outline" : "default"}
              >
                {isFixing ? (
                  <><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Fixing...</>
                ) : (
                  <><Terminal className="h-3 w-3 mr-2" /> Run Auth Debug & Fix</>
                )}
              </Button>
              <Button 
                onClick={onClose} 
                variant="secondary"
                className="w-full text-xs"
              >
                Clear Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}