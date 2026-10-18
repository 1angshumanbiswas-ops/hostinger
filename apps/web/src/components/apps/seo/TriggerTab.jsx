import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Rocket, Loader2, AlertCircle, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import PlatformCard from './PlatformCard';
import PostConfirmationDialog from './PostConfirmationDialog';
import { useTriggerPosting } from '@/hooks/useTriggerPosting';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const TriggerTab = ({ currentCopy }) => {
  const { user, isSuperAdmin } = useAuth();
  
  const { 
    postToPlatform, 
    postToAllPlatforms, 
    platformStatuses, 
    loading, 
    globalLoading,
    errorDetails
  } = useTriggerPosting();

  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    platform: null, 
    isAll: false 
  });

  const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'snapchat', 'whatsapp'];
  const contentToPost = typeof currentCopy === 'string' ? currentCopy : currentCopy?.content || "Check out our latest updates! #NewPost";

  const handlePostClick = (platform) => {
    // Auth checks REMOVED
    if (!loading[platform] && !globalLoading) {
        setConfirmDialog({ isOpen: true, platform: platform, isAll: false });
    }
  };

  const handlePostAllClick = () => {
    // Auth checks REMOVED
    setConfirmDialog({ isOpen: true, platform: null, isAll: true });
  };

  const handleConfirm = async () => {
    const { platform, isAll } = confirmDialog;
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    
    if (isAll) {
      await postToAllPlatforms(contentToPost);
    } else if (platform) {
      await postToPlatform(platform, contentToPost);
    }
  };

  // Only show disconnected warnings if we are NOT super admin
  const disconnectedPlatforms = isSuperAdmin 
        ? [] 
        : Object.entries(platformStatuses)
            .filter(([_, status]) => status && status.connected === false)
            .map(([key]) => key);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="border-indigo-100 bg-gradient-to-r from-white to-indigo-50/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              Trigger - Manual Posting
              {isSuperAdmin && <ShieldCheck className="w-5 h-5 text-purple-600" title="Super Admin Mode" />}
            </CardTitle>
            <CardDescription>Post your content to social media platforms instantly.</CardDescription>
          </div>
          <Button 
            onClick={handlePostAllClick} 
            disabled={globalLoading}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            size="lg"
          >
            {globalLoading ? (
               <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            ) : (
               <><Rocket className="w-4 h-4 mr-2" /> Post All Platforms</>
            )}
          </Button>
        </CardHeader>
        <CardContent>
           <div className="p-4 bg-white/50 rounded-lg border border-indigo-100 text-sm text-slate-600 mb-2">
              <span className="font-bold text-indigo-900">Current Content to Post:</span>
              <p className="mt-1 line-clamp-2 italic">"{contentToPost}"</p>
           </div>
           
           {isSuperAdmin && (
              <Alert className="mt-2 bg-purple-50 border-purple-200 text-purple-900">
                 <ShieldCheck className="h-4 w-4 text-purple-600" />
                 <AlertDescription>
                     Super Admin Mode Active: Auth checks bypassed.
                 </AlertDescription>
              </Alert>
           )}
           
           {disconnectedPlatforms.length > 0 && (
             <Alert variant="warning" className="mt-2 bg-yellow-50 border-yellow-200 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    Some platforms are not connected: {disconnectedPlatforms.join(', ')}. Please connect them in Settings.
                </AlertDescription>
             </Alert>
           )}

           {Object.keys(errorDetails).length > 0 && (
             <Alert variant="destructive" className="mt-2 bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Some platforms failed to post. See individual cards for details.
                </AlertDescription>
             </Alert>
           )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {platforms.map(platform => {
          const error = errorDetails[platform];
          const isLoading = loading[platform] || globalLoading;
          const statusObj = platformStatuses[platform] || {};
          const status = statusObj.status || 'idle';
          const isConnected = statusObj.connected !== false; 
          
          return (
            <div key={platform} className="relative group">
                <PlatformCard
                    platform={platform}
                    status={status === 'error' ? 'failed' : status}
                    lastPosted={statusObj.lastPosted}
                    onPostNow={() => handlePostClick(platform)}
                    isLoading={isLoading}
                    disabled={(!isConnected && !isSuperAdmin)}
                />
                
                {status === 'error' && (
                    <div className="absolute -bottom-2 left-2 right-2 z-10">
                        <div className="bg-red-600 text-white text-xs p-2 rounded-md shadow-md flex items-center justify-between">
                            <span className="truncate max-w-[150px]" title={error}>{error || "Failed"}</span>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 text-white hover:bg-red-700 hover:text-white"
                                onClick={() => handlePostClick(platform)}
                            >
                                <RefreshCw className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                )}
                
                {!isConnected && !isSuperAdmin && (
                     <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Not Connected
                     </div>
                )}
            </div>
          );
        })}
      </div>

      <PostConfirmationDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirm}
        platform={confirmDialog.platform}
        content={contentToPost}
        isAll={confirmDialog.isAll}
      />
    </div>
  );
};

export default TriggerTab;