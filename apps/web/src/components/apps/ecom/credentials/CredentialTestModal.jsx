import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { testCredential } from '@/utils/credentialTestService';
import { logCredentialAccess } from '@/utils/credentialAuditLog';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function CredentialTestModal({ isOpen, onClose, serviceName, credentialData }) {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen && serviceName && credentialData) {
      runTest();
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, serviceName]);

  const runTest = async () => {
    setTesting(true);
    setResult(null);
    try {
      const testRes = await testCredential(serviceName, credentialData);
      setResult(testRes);
      if (user) {
        await logCredentialAccess(user.id, serviceName, 'test_connection', testRes.success, { message: testRes.message });
      }
    } catch (err) {
      setResult({ success: false, message: err.message || 'An unexpected error occurred.' });
      if (user) {
        await logCredentialAccess(user.id, serviceName, 'test_connection', false, { message: err.message });
      }
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Testing Connection: {serviceName}</DialogTitle>
          <DialogDescription>
            Validating API credentials format and verifying connection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center min-h-[150px]">
          {testing && (
            <div className="flex flex-col items-center text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
              <p>Contacting {serviceName} servers...</p>
            </div>
          )}
          
          {!testing && result && (
            <div className={`flex flex-col items-center text-center p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
              {result.success ? (
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500 mb-3" />
              )}
              <h3 className={`text-lg font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? 'Connection Successful' : 'Connection Failed'}
              </h3>
              <p className={`text-sm mt-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.message}
              </p>
              
              {!result.success && (
                <div className="mt-4 text-xs text-left bg-white/50 p-3 rounded border border-red-100 text-red-700">
                  <strong>Troubleshooting:</strong>
                  <ul className="list-disc pl-4 mt-1">
                    <li>Check if the API keys are copied entirely without trailing spaces.</li>
                    <li>Ensure your API plan allows external access.</li>
                    <li>Verify token format matches expected service patterns.</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {!testing && !result?.success && (
            <Button variant="outline" onClick={runTest}>Try Again</Button>
          )}
          <Button onClick={onClose} disabled={testing}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}