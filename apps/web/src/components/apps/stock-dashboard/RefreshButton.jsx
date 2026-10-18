import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function RefreshButton({ onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (onRefresh) onRefresh();
    }, 2000);
  };

  return (
    <Button 
      onClick={handleRefresh} 
      disabled={isRefreshing}
      size="lg"
      className="font-black text-base shadow-md bg-primary hover:bg-primary/90 text-primary-foreground border-none"
    >
      <RefreshCw className={`mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'SYNCHRONIZING...' : 'REFRESH LIVE DATA'}
    </Button>
  );
}