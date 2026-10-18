import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function MessageQueueManager() {
  const { toast } = useToast();
  const queue = [
    { id: '1', type: 'WhatsApp', to: '+1234567890', status: 'sent', time: '2 mins ago', attempt: 1 },
    { id: '2', type: 'Email', to: 'user@example.com', status: 'failed', time: '15 mins ago', attempt: 3 },
    { id: '3', type: 'WhatsApp', to: '+0987654321', status: 'queued', time: 'In 5 mins', attempt: 0 },
    { id: '4', type: 'SMS', to: '+1122334455', status: 'sent', time: '1 hour ago', attempt: 1 },
  ];

  const handleRetry = () => {
    toast({ title: "Retry Initiated", description: "Message moved back to active queue." });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Message Queue & Logs</h1>
        <p className="text-slate-500">Monitor and manage automated outbound communications.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Messages</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Filter Failed</Button>
            <Button variant="outline" size="sm">Purge Old Logs</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {queue.map((msg) => (
              <div key={msg.id} className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  {getStatusIcon(msg.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{msg.to}</span>
                      <Badge variant="outline" className="text-xs">{msg.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">{msg.time} • Attempt {msg.attempt}</p>
                  </div>
                </div>
                <div>
                  {msg.status === 'failed' && (
                    <Button size="sm" variant="ghost" onClick={handleRetry} className="text-blue-600 hover:text-blue-800">
                      <RefreshCw className="w-4 h-4 mr-1" /> Retry
                    </Button>
                  )}
                  <Badge variant={msg.status === 'sent' ? 'success' : msg.status === 'failed' ? 'destructive' : 'secondary'} className="ml-2">
                    {msg.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}