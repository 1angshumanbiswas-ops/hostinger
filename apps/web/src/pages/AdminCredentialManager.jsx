import React, { useState, useEffect, useCallback } from 'react';
import CredentialManager from '@/components/apps/ecom/credentials/CredentialManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Shield, RefreshCw, ChevronRight, Activity, Database, CheckCircle2 } from 'lucide-react';
import { useCredentialManagement } from '@/hooks/useCredentialManagement';
import { formatDistanceToNow } from 'date-fns';

export default function AdminCredentialManager() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  
  const { fetchAuditLogs, fetchCredentials } = useCredentialManagement();
  const [totalServices, setTotalServices] = useState(0);

  const fetchData = useCallback(async () => {
    setLoadingLogs(true);
    const logs = await fetchAuditLogs();
    setAuditLogs(logs);
    
    const creds = await fetchCredentials();
    setTotalServices(creds.length);
    setLoadingLogs(false);
  }, [fetchAuditLogs, fetchCredentials]);

  useEffect(() => {
    fetchData();
  }, [refreshTrigger, fetchData]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-sm text-slate-500 mb-2">
              <span>Admin</span>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-slate-900">Credential Vault</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-600" />
              API Credentials & Security
            </h1>
            <p className="text-slate-500 mt-2">Centralized, encrypted storage for external service integrations.</p>
          </div>
          <Button variant="outline" onClick={handleRefresh} className="bg-white text-slate-700 shadow-sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingLogs ? 'animate-spin' : ''}`} /> Reload Analytics
          </Button>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Connected Services</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalServices} <span className="text-sm font-normal text-slate-500">/ 7</span></h3>
              </div>
              <div className="p-4 bg-indigo-50 rounded-full">
                <Database className="w-6 h-6 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Vault Status</p>
                <h3 className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5"/> AES Encrypted
                </h3>
              </div>
              <div className="p-4 bg-emerald-50 rounded-full">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Recent API Tests</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {auditLogs.filter(l => l.action === 'test_connection').length}
                </h3>
              </div>
              <div className="p-4 bg-blue-50 rounded-full">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Credential Manager (Form + List + Modal) */}
        <CredentialManager />

        {/* Audit Log */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-600" />
              Access Audit Log
            </CardTitle>
            <CardDescription>Recent credential access, modifications, and tests.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLogs ? (
               <div className="h-32 flex items-center justify-center">
                 <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
               </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">No recent activity logged.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Service</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map(log => (
                      <TableRow key={log.id} className="text-sm">
                        <TableCell className="font-medium text-slate-900">{log.service_name}</TableCell>
                        <TableCell>
                           <Badge variant="outline" className={
                             log.action === 'test_connection' ? 'bg-blue-50 text-blue-700' :
                             log.action === 'update' ? 'bg-emerald-50 text-emerald-700' :
                             log.action === 'delete' ? 'bg-rose-50 text-rose-700' :
                             'bg-slate-100 text-slate-700'
                           }>
                             {log.action.replace('_', ' ').toUpperCase()}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-slate-500">
                           {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                           {log.success ? (
                             <span className="text-emerald-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Success</span>
                           ) : (
                             <span className="text-rose-600 text-xs">{log.details?.message || 'Failed'}</span>
                           )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}