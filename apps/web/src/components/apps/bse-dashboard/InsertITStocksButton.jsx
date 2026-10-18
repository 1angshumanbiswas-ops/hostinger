import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { insertITStocksDirectly } from '@/utils/insertITStocks';
import { useToast } from '@/hooks/use-toast';

export default function InsertITStocksButton({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [resultDetails, setResultDetails] = useState(null);
  const { toast } = useToast();

  const handleInsert = async () => {
    setLoading(true);
    setStatus(null);
    setResultDetails(null);
    
    try {
      console.log('Starting IT stocks insertion...');
      
      const result = await insertITStocksDirectly();
      
      console.log('Insertion result:', result);
      setResultDetails(result);
      
      if (result.success) {
        setStatus('success');
        
        let toastMessage = result.message;
        if (result.inserted > 0 && result.skipped > 0) {
          toastMessage = `✅ Inserted ${result.inserted} new stocks (${result.insertedSymbols.join(', ')}). Skipped ${result.skipped} existing stocks (${result.skippedSymbols.join(', ')})`;
        } else if (result.inserted > 0) {
          toastMessage = `✅ Successfully inserted ${result.inserted} IT stocks: ${result.insertedSymbols.join(', ')}`;
        } else if (result.skipped > 0) {
          toastMessage = `ℹ️ All ${result.skipped} IT stocks already exist: ${result.skippedSymbols.join(', ')}`;
        }
        
        toast({
          title: result.inserted > 0 ? "IT Stocks Inserted" : "No New Stocks to Insert",
          description: toastMessage,
          duration: 6000
        });
        
        if (result.inserted > 0 && onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      } else {
        setStatus('error');
        toast({
          title: "❌ Insertion Failed",
          description: result.message || "Failed to insert IT stocks. Check console for details.",
          variant: "destructive",
          duration: 6000
        });
      }
    } catch (err) {
      console.error('Failed to insert IT stocks:', err);
      setStatus('error');
      toast({
        title: "❌ Unexpected Error",
        description: err.message || "An unexpected error occurred during insertion.",
        variant: "destructive",
        duration: 6000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleInsert}
        disabled={loading}
        variant={status === 'success' ? 'outline' : 'default'}
        className="flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Checking & Inserting...
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            {resultDetails?.inserted > 0 ? 'IT Stocks Inserted' : 'All Stocks Exist'}
          </>
        ) : status === 'error' ? (
          <>
            <XCircle className="w-4 h-4 text-red-500" />
            Retry Insertion
          </>
        ) : (
          <>
            <Database className="w-4 h-4" />
            Insert 5 IT Stocks
          </>
        )}
      </Button>
      
      {resultDetails && status === 'success' && (
        <div className="text-xs text-muted-foreground flex items-start gap-1">
          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span>
            {resultDetails.inserted > 0 && `Inserted: ${resultDetails.inserted}`}
            {resultDetails.inserted > 0 && resultDetails.skipped > 0 && ' | '}
            {resultDetails.skipped > 0 && `Skipped: ${resultDetails.skipped}`}
          </span>
        </div>
      )}
    </div>
  );
}