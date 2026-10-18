import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function TestConnectionModal({ isOpen, onClose, serviceName, status, message, onRetry }) {
  const isPending = status === 'pending';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900">Connection Test</DialogTitle>
          <DialogDescription>
            Validating configuration for {serviceName}
          </DialogDescription>
        </DialogHeader>

        <div className="py-8 flex flex-col items-center justify-center space-y-4">
          {isPending && (
            <>
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              <p className="text-slate-600 font-medium">Validating credentials securely...</p>
            </>
          )}

          {isSuccess && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-emerald-700 font-semibold text-lg">Connection Successful</p>
              <p className="text-slate-500 text-center text-sm">{message}</p>
            </>
          )}

          {isError && (
            <>
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-rose-600" />
              </div>
              <p className="text-rose-700 font-semibold text-lg">Connection Failed</p>
              <p className="text-slate-500 text-center text-sm">{message}</p>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-2">
          {isError ? (
            <>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
              <Button onClick={onRetry} className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700">Retry Test</Button>
            </>
          ) : (
            <Button onClick={onClose} disabled={isPending} className="w-full bg-slate-900 text-white hover:bg-slate-800">
              {isPending ? 'Testing...' : 'Close'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}