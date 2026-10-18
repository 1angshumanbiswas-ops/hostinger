import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, RefreshCw, CheckCircle2, XCircle, Shield, Activity, Database, Trash2, Key } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { validateLinkedInConnection, testLinkedInConnection } from '@/utils/linkedinValidation';
import { getLinkedInLogs } from '@/utils/logLinkedInActivity';
import { supabase } from '@/lib/customSupabaseClient';

const LinkedInDebugPanel = () => {
  const { user } = useAuth();
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  const [postHistory, setPostHistory] = useState([]);

  const runValidation = async () => {
    if (!user) return;
    setValidating(true);
    setValidation(null);
    try {
        const result = await validateLinkedInConnection(user.id);
        setValidation(result);
    } finally {
        setValidating(false);
    }
  };

  const fetchLogs = async () => {
    if (!user) return;
    setLoadingLogs(true);
    try {
        const data = await getLinkedInLogs(user.id, 20);
        setLogs(data || []);
        
        // Also fetch recent posts
        const { data: posts } = await supabase
            .from('ad_posts')
            .select('*')
            .eq('user_id', user.id)
            .eq('platform', 'linkedin')
            .order('created_at', { ascending: false })
            .limit(5);
        setPostHistory(posts || []);
    } finally {
        setLoadingLogs(false);
    }
  };

  const runTestCall = async () => {
      if (!validation?.token) return;
      setTestLoading(true);
      setTestResult(null);
      try {
          const result = await testLinkedInConnection(validation.token);
          setTestResult(result);
          fetchLogs(); // refresh logs
      } finally {
          setTestLoading(false);
      }
  };

  const clearLogs = async () => {
      await supabase.from('debug_logs').delete().eq('user_id', user.id).eq('platform', 'linkedin');
      fetchLogs();
  };

  useEffect(() => {
    runValidation();
    fetchLogs();
  }, [user]);

  const getStatusColor = (valid) => valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <Card className="w-full border-slate-200 shadow-md">
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        LinkedIn Diagnostics
                    </CardTitle>
                    <CardDescription>Real-time status and debugging</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => { runValidation(); fetchLogs(); }}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${validating ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            
            {/* Connection Status */}
            <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
                <h3 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Connection Health
                </h3>
                
                {validating ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" /> Checking connection...
                    </div>
                ) : validation ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(validation.valid)}>
                                {validation.valid ? 'CONNECTED' : 'ISSUE DETECTED'}
                            </Badge>
                            <span className="text-sm font-medium text-slate-700">
                                {validation.message || 'Connection is healthy'}
                            </span>
                        </div>
                        
                        {validation.valid && (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 bg-white rounded border">
                                    <div className="text-slate-500 mb-1 flex items-center gap-1"><Key className="w-3 h-3"/> Token Check</div>
                                    <div className="font-mono text-green-600 truncate">Valid Format</div>
                                </div>
                                <div className="p-2 bg-white rounded border">
                                    <div className="text-slate-500 mb-1">User URN</div>
                                    <div className="font-mono text-slate-700">{validation.platformUserId}</div>
                                </div>
                            </div>
                        )}
                        
                        <Button 
                            size="sm" 
                            variant="secondary"
                            disabled={!validation.valid || testLoading}
                            onClick={runTestCall}
                            className="w-full mt-2"
                        >
                            {testLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : "Test API Connection (Get Profile)"}
                        </Button>
                        
                        {testResult && (
                            <Alert variant={testResult.success ? "default" : "destructive"} className="py-2">
                                <AlertTitle className="text-xs font-bold">{testResult.success ? "API Test Passed" : "API Test Failed"}</AlertTitle>
                                <AlertDescription className="text-xs truncate">
                                    {testResult.success 
                                        ? `Logged in as ${testResult.data.localizedFirstName} ${testResult.data.localizedLastName}` 
                                        : testResult.error}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Posting History */}
            <div className="space-y-2">
                <h3 className="font-semibold text-sm text-slate-700">Recent Posts</h3>
                <div className="border rounded-md divide-y">
                    {postHistory.length === 0 ? (
                        <div className="p-3 text-xs text-slate-500 text-center">No recent posting attempts</div>
                    ) : (
                        postHistory.map(post => (
                            <div key={post.id} className="p-3 flex justify-between items-center text-xs">
                                <div>
                                    <div className={`font-bold ${post.status === 'posted' ? 'text-green-600' : 'text-red-600'}`}>
                                        {post.status.toUpperCase()}
                                    </div>
                                    <div className="text-slate-400">{new Date(post.created_at).toLocaleString()}</div>
                                </div>
                                {post.error_message && (
                                    <div className="text-red-500 max-w-[150px] truncate" title={post.error_message}>
                                        {post.error_message}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Debug Logs */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                        <Database className="w-4 h-4" /> System Logs
                    </h3>
                    <Button variant="ghost" size="xs" className="h-6" onClick={clearLogs}>
                        <Trash2 className="w-3 h-3 mr-1" /> Clear
                    </Button>
                </div>
                <ScrollArea className="h-[200px] w-full border rounded-md p-2 bg-slate-900 text-slate-100 font-mono text-[10px]">
                    {loadingLogs ? (
                        <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin" /></div>
                    ) : logs.length === 0 ? (
                        <div className="text-slate-500 text-center p-4">No logs found.</div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="mb-3 border-b border-slate-700 pb-2 last:border-0">
                                <div className="flex justify-between text-slate-400 mb-0.5">
                                    <span className="font-bold text-blue-400">{log.action}</span>
                                    <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                                </div>
                                <div className="text-slate-300 break-words mb-1">
                                    {log.message}
                                </div>
                                {log.details && (
                                    <details>
                                        <summary className="cursor-pointer text-slate-500 hover:text-white">Data Payload</summary>
                                        <pre className="mt-1 p-1 bg-black/30 rounded overflow-x-auto text-green-300">
                                            {JSON.stringify(log.details, null, 2)}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        ))
                    )}
                </ScrollArea>
            </div>
        </CardContent>
    </Card>
  );
};

export default LinkedInDebugPanel;