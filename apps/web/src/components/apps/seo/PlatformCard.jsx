import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock, Send, AlertCircle, Loader2 } from 'lucide-react';
import { PLATFORM_CONFIGS } from '@/utils/seoAppUtils';
import { format } from 'date-fns';

// Map internal status to UI colors/icons
const getStatusConfig = (status) => {
  switch (status) {
    case 'posted':
    case 'success':
      return { color: 'bg-green-100 text-green-700', icon: CheckCircle2, label: 'Active' };
    case 'failed':
    case 'error':
      return { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Failed' };
    case 'scheduled':
      return { color: 'bg-blue-100 text-blue-700', icon: Clock, label: 'Scheduled' };
    default:
      return { color: 'bg-slate-100 text-slate-500', icon: AlertCircle, label: 'Idle' };
  }
};

const PlatformCard = ({ platform, status, lastPosted, onPostNow, isLoading }) => {
  const config = PLATFORM_CONFIGS[platform] || { name: platform, color: '#666' };
  const statusInfo = getStatusConfig(status);
  const StatusIcon = statusInfo.icon;

  const handlePostClick = (e) => {
      e.stopPropagation();
      console.log(`[FlowDebug] [PlatformCard] Post button clicked for ${platform}`);
      if (onPostNow) onPostNow(platform);
  };

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${status === 'error' ? 'border-red-200 ring-1 ring-red-100' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ backgroundColor: config.color }}
            >
              {platform.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 capitalize">{config.name || platform}</h3>
              <p className="text-xs text-slate-500">
                {lastPosted ? `Last: ${format(new Date(lastPosted), 'MMM d, HH:mm')}` : 'No recent activity'}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className={`${statusInfo.color} border-0`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusInfo.label}
          </Badge>
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            size="sm"
            onClick={handlePostClick}
            disabled={isLoading}
          >
            {isLoading ? (
                <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Publishing...
                </>
            ) : (
                <>
                    <Send className="w-3 h-3 mr-2" />
                    Post Now
                </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformCard;