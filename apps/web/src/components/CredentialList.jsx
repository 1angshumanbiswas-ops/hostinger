import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useCredentialManagement } from '@/hooks/useCredentialManagement';
import { Edit, Trash2, Key, RefreshCw, Activity } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import TestConnectionModal from './TestConnectionModal';

export default function CredentialList({ onEditRequest, refreshTrigger }) {
  const [credentials, setCredentials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, service: null });
  const [testModal, setTestModal] = useState({ open: false, service: null, status: 'pending', message: '' });
  
  const { listCredentials, deleteCredential, getCredential, testConnection } = useCredentialManagement();

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await listCredentials();
    setCredentials(data);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (deleteModal.service) {
      await deleteCredential(deleteModal.service);
      setDeleteModal({ open: false, service: null });
      fetchData();
    }
  };

  const handleTest = async (serviceName) => {
    setTestModal({ open: true, service: serviceName, status: 'pending', message: '' });
    const fullCreds = await getCredential(serviceName);
    if (!fullCreds) {
      setTestModal({ open: true, service: serviceName, status: 'error', message: 'Could not decrypt credentials for testing.' });
      return;
    }
    const result = await testConnection(serviceName, fullCreds);
    setTestModal({ open: true, service: serviceName, status: result.success ? 'success' : 'error', message: result.message });
  };

  const isRecent = (dateStr) => {
    if (!dateStr) return false;
    const diff = new Date() - new Date(dateStr);
    return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-slate-700" />
            Configured Services
          </CardTitle>
          <CardDescription>Manage and monitor your API integrations.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-md" />
            ))}
          </div>
        ) : credentials.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <Key className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No Credentials Configured</p>
            <p className="text-slate-500 text-sm mt-1">Select a tab above to add your first API key.</p>
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-200 rounded-md">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[200px]">Integration</TableHead>
                  <TableHead>Health Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((cred) => {
                  const recent = isRecent(cred.last_accessed);
                  return (
                    <TableRow key={cred.id} className="bg-white">
                      <TableCell className="font-medium text-slate-900">{cred.service_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={recent ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${recent ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {recent ? 'Healthy' : 'Stale'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {new Date(cred.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleTest(cred.service_name)} className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                          <Activity className="w-4 h-4 mr-1" /> Test
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onEditRequest(cred.service_name)} className="text-slate-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ open: true, service: cred.service_name })} className="text-rose-600 hover:text-rose-800 hover:bg-rose-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={deleteModal.open} onOpenChange={(val) => !val && setDeleteModal({ open: false, service: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Credentials</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete credentials for {deleteModal.service}? This action cannot be undone and workflows depending on this integration will fail.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, service: null })}>Cancel</Button>
            <Button variant="destructive" className="bg-rose-600 text-white hover:bg-rose-700" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TestConnectionModal 
        isOpen={testModal.open}
        onClose={() => setTestModal({ ...testModal, open: false })}
        serviceName={testModal.service}
        status={testModal.status}
        message={testModal.message}
        onRetry={() => handleTest(testModal.service)}
      />
    </Card>
  );
}