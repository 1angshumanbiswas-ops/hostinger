import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, CheckCircle, AlertCircle, Clock, FileImage as ImageIcon } from 'lucide-react';
import { useRefresh } from '@/hooks/useRefresh';
import { format } from 'date-fns';
import { PLATFORM_CONFIGS } from '@/utils/seoAppUtils';

const RefreshTab = () => {
  const { 
    refreshState, 
    refreshAll, 
    refreshPlatform, 
    refreshHistory, 
    lastRefreshTimes, 
    loading 
  } = useRefresh();

  const platforms = Object.keys(PLATFORM_CONFIGS);

  // Mock function to "refresh" image on Snapchat - in reality this would fetch a new asset from the design team or database
  const handleSnapchatImageRefresh = () => {
     refreshPlatform('snapchat');
     // In a real scenario, this would trigger the useSnapchatImage logic too or invalidate queries
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Platform Sync Status</CardTitle>
                <CardDescription>Manually refresh connection and metrics for each platform.</CardDescription>
            </div>
            <Button 
                onClick={refreshAll} 
                disabled={refreshState.all === 'refreshing'}
                className="bg-indigo-600 hover:bg-indigo-700"
            >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshState.all === 'refreshing' ? 'animate-spin' : ''}`} />
                Refresh All
            </Button>
         </CardHeader>
         <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {platforms.map(platform => {
                     const config = PLATFORM_CONFIGS[platform];
                     const isRefreshing = refreshState[platform] === 'refreshing';
                     const lastRefresh = lastRefreshTimes[platform];
                     
                     return (
                         <div key={platform} className="p-4 border rounded-lg bg-slate-50 flex flex-col justify-between gap-3">
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                     <span className="font-semibold capitalize text-slate-800">{config?.name || platform}</span>
                                 </div>
                                 {refreshState[platform] === 'success' ? (
                                     <CheckCircle className="w-4 h-4 text-green-500" />
                                 ) : refreshState[platform] === 'error' ? (
                                     <AlertCircle className="w-4 h-4 text-red-500" />
                                 ) : null}
                             </div>
                             
                             <div className="text-xs text-slate-500">
                                 {lastRefresh ? (
                                     <span className="flex items-center gap-1">
                                         <Clock className="w-3 h-3" /> {format(new Date(lastRefresh), 'MMM d, h:mm a')}
                                     </span>
                                 ) : (
                                     <span>Never refreshed</span>
                                 )}
                             </div>

                             <div className="mt-auto flex gap-2">
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => refreshPlatform(platform)}
                                    disabled={isRefreshing}
                                >
                                    <RefreshCw className={`w-3 h-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    {isRefreshing ? 'Syncing...' : 'Sync Now'}
                                </Button>
                                {platform === 'snapchat' && (
                                    <Button size="sm" variant="ghost" className="px-2" title="Refresh Asset" onClick={handleSnapchatImageRefresh}>
                                        <ImageIcon className="w-3 h-3 text-slate-500" />
                                    </Button>
                                )}
                             </div>
                         </div>
                     );
                 })}
             </div>
         </CardContent>
      </Card>

      {/* History Table */}
      <Card>
          <CardHeader>
              <CardTitle>Refresh Log</CardTitle>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Platform</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Details</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {refreshHistory.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                  No refresh history available.
                              </TableCell>
                          </TableRow>
                      ) : (
                          refreshHistory.map((item) => (
                              <TableRow key={item.id}>
                                  <TableCell className="font-medium capitalize">{item.platform}</TableCell>
                                  <TableCell>
                                      <Badge variant={item.status === 'success' ? 'default' : 'destructive'} className={item.status === 'success' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                                          {item.status}
                                      </Badge>
                                  </TableCell>
                                  <TableCell className="text-xs text-slate-500">
                                      {format(new Date(item.refreshed_at), 'MMM d, yyyy h:mm:ss a')}
                                  </TableCell>
                                  <TableCell className="text-xs text-slate-500 max-w-[200px] truncate">
                                      {item.error_message || "Completed successfully"}
                                  </TableCell>
                              </TableRow>
                          ))
                      )}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  );
};

export default RefreshTab;