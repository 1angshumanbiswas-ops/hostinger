import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ConnectionStatus({ serviceName, lastAccessed, isConnected }) {
  const timeAgo = lastAccessed 
    ? formatDistanceToNow(new Date(lastAccessed), { addSuffix: true })
    : 'Never';

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {isConnected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-500" />
          )}
        </div>
        <div>
          <p className="font-medium text-slate-900 text-sm">{serviceName}</p>
          <div className="flex items-center text-xs text-slate-500 mt-0.5">
            <Clock className="w-3 h-3 mr-1" />
            Last accessed {timeAgo}
          </div>
        </div>
      </div>
      <div>
        <Badge variant={isConnected ? 'success' : 'destructive'} className={
          isConnected ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50' : 'bg-rose-50 text-rose-700 hover:bg-rose-50'
        }>
          {isConnected ? 'Connected' : 'Not Connected'}
        </Badge>
      </div>
    </div>
  );
}