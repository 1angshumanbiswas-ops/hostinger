import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { fetchAllSourcesComparison } from '@/utils/FreeFinancialDataSources';
import { CheckCircle2, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DataSourceComparison({ symbol }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAllSourcesComparison(symbol);
        setSources(data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [symbol]);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Data Source Comparison</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-[200px] w-full" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Real-Time Data Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Price (₹)</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((src, idx) => {
                const isLatest = idx === 0;
                return (
                  <TableRow key={src.source}>
                    <TableCell className="font-medium">
                      {src.source}
                      {isLatest && <Badge variant="outline" className="ml-2 border-stock-up text-stock-up text-[10px]">Freshest</Badge>}
                    </TableCell>
                    <TableCell className="text-right font-semibold">₹{src.price.toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${src.change >= 0 ? 'text-stock-up' : 'text-destructive'}`}>
                      {src.change >= 0 ? '+' : ''}{src.changePercent.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                        {isLatest ? <CheckCircle2 className="h-4 w-4 text-stock-up" /> : <Clock className="h-4 w-4" />}
                        {new Date(src.timestamp).toLocaleTimeString()}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}