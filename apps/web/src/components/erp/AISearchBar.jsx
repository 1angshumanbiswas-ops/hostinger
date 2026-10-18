import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Loader2, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AISearchBar = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setIsOpen(true);
    setResults(null);

    try {
      // In a real implementation, this would call a Supabase Edge Function
      // const { data, error } = await supabase.functions.invoke('parse-erp-query', {
      //   body: { query }
      // });
      
      // MOCK RESPONSE for Demo purposes since Edge Function is hypothetical
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing
      
      const mockResults = {
        intent: "Search Invoice",
        confidence: 0.92,
        matches: [
          { type: 'invoice', id: 'INV-2023-001', customer: 'Acme Corp', amount: '$12,500.00', status: 'Paid' },
          { type: 'invoice', id: 'INV-2023-042', customer: 'Stark Ind', amount: '$8,250.00', status: 'Pending' }
        ]
      };
      
      setResults(mockResults);

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Could not process your query. Please try again.",
        variant: "destructive"
      });
      setIsOpen(false);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative w-full group">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Ask AI: 'Show unpaid invoices from last month'..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm rounded-xl"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
             {isSearching ? (
                 <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
             ) : (
                 <div className="flex items-center gap-1">
                     <span className="hidden sm:inline-flex h-5 items-center justify-center rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500">
                        ⌘K
                     </span>
                     <Button type="submit" size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-blue-50 hover:text-blue-600">
                        <Sparkles className="w-3.5 h-3.5" />
                     </Button>
                 </div>
             )}
          </div>
        </div>
      </form>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Search Results
            </DialogTitle>
            <DialogDescription>
              Analysis for: <span className="font-medium text-slate-900">"{query}"</span>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {isSearching ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                    <Sparkles className="w-5 h-5 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-slate-900">Analyzing ERP Database...</h3>
                    <p className="text-xs text-slate-500 mt-1">Checking finance, inventory, and sales records</p>
                </div>
              </div>
            ) : results ? (
              <div className="space-y-4">
                 <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white shadow-sm capitalize">
                            {results.intent || 'General Search'}
                        </Badge>
                        <span className="text-xs text-slate-500">Confidence: {(results.confidence * 100).toFixed(0)}%</span>
                    </div>
                 </div>

                 {results.matches && results.matches.length > 0 ? (
                    <div className="grid gap-2">
                        {results.matches.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        {item.type === 'invoice' && <CornerDownLeft className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{item.id}</p>
                                        <p className="text-sm text-slate-500">{item.customer} • {item.amount}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={item.status === 'Paid' ? 'default' : 'secondary'} className={item.status === 'Paid' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
                                        {item.status}
                                    </Badge>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-8 text-slate-500">
                        No specific records found matching your query.
                    </div>
                 )}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AISearchBar;