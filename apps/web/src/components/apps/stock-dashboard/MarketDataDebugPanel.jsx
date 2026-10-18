import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, X, RefreshCw, Activity } from 'lucide-react';
import { useRealTimeMarketData } from '@/hooks/useRealTimeMarketData';
import { Badge } from '@/components/ui/badge';

export default function MarketDataDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { debugLogs, refresh, lastUpdated, sensexData } = useRealTimeMarketData();

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 z-50 shadow-lg bg-background border-border"
        onClick={() => setIsOpen(true)}
      >
        <Terminal className="h-4 w-4 mr-2" /> Debug API
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[400px] shadow-2xl border-border bg-card">
      <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" /> API Debugger
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => refresh(true)}>
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-3 bg-muted/30 border-b border-border flex justify-between text-xs">
          <span>Source: {sensexData?._source || 'Unknown'}</span>
          <span>Last: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <ScrollArea className="h-[250px] p-4 text-xs font-mono">
          {debugLogs.length === 0 ? (
            <div className="text-muted-foreground">No logs yet...</div>
          ) : (
            debugLogs.map((log, i) => (
              <div key={i} className="mb-3 border-b border-border/50 pb-2 last:border-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground">{new Date(log.time).toLocaleTimeString()}</span>
                  <Badge variant={log.status === 'Success' ? 'outline' : 'destructive'} className="text-[10px] h-4">
                    {log.status}
                  </Badge>
                </div>
                <div className="text-primary">{log.source}</div>
                <div className="text-muted-foreground mt-1 break-all">
                  {typeof log.data === 'string' ? log.data : JSON.stringify(log.data)}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}