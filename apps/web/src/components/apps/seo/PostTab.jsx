import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, Loader2, RefreshCcw, Trash2, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePosting } from '@/hooks/usePosting';
import { format } from 'date-fns';
import { PLATFORM_CONFIGS } from '@/utils/seoAppUtils';
import SnapchatMobilePreview from '@/components/apps/seo/SnapchatMobilePreview';

const PostTab = () => {
  const { 
    postingState, 
    postToAll, 
    postToPlatform, 
    postingHistory, 
    loading, 
    errorState,
    retryPost, 
    deletePost 
  } = usePosting();

  const [filterPlatform, setFilterPlatform] = useState('all');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const platforms = Object.keys(PLATFORM_CONFIGS);

  const filteredHistory = postingHistory.filter(item => 
      filterPlatform === 'all' || item.platform === filterPlatform
  );

  const handlePostAll = () => {
      console.log("UI: Post All Clicked");
      const mockAdContent = "🚀 Exciting updates coming to our platform! #TechNews #Innovation";
      postToAll(null, mockAdContent, platforms);
  };

  const handleSinglePost = (platform) => {
      console.log(`UI: Single Post Clicked for ${platform}`);
      const mockAdContent = `Hello ${platform}! Check out our latest updates.`;
      
      if (platform === 'snapchat') {
          console.log("UI: Opening Snapchat Preview");
          setPreviewData({
              platform,
              content: mockAdContent,
              image: { imageUrl: "https://horizons-cdn.hostinger.com/e0687bb0-98a0-45d4-8f73-50f1c1652251/458871fe584c6a34dce9a67d14642588.png" }
          });
          setShowPreview(true);
      } else {
          postToPlatform(null, platform, mockAdContent);
      }
  };

  const confirmSnapchatPost = () => {
      if (previewData) {
          console.log("UI: Confirming Snapchat Post");
          postToPlatform(null, previewData.platform, previewData.content);
          setShowPreview(false);
      }
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Quick Publish</CardTitle>
                    <CardDescription>Send updates directly to configured platforms.</CardDescription>
                </div>
                <Button onClick={handlePostAll} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" /> Post to All
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {platforms.map(platform => {
                        const isPosting = postingState[platform] === 'posting';
                        const isError = postingState[platform] === 'error';
                        const config = PLATFORM_CONFIGS[platform];
                        
                        return (
                            <TooltipProvider key={platform}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant={isError ? "destructive" : "outline"}
                                        className={`w-full flex justify-between px-2 ${isError ? 'opacity-90' : ''}`}
                                        onClick={() => handleSinglePost(platform)}
                                        disabled={isPosting}
                                        style={{ borderColor: (!isError && isPosting) ? config?.color : '' }}
                                    >
                                        <span className="capitalize text-xs truncate">{config?.name || platform}</span>
                                        {isPosting ? <Loader2 className="w-3 h-3 animate-spin" /> : 
                                         isError ? <AlertCircle className="w-3 h-3" /> : 
                                         <Send className="w-3 h-3 text-slate-400" />}
                                    </Button>
                                </TooltipTrigger>
                                {errorState[platform] && (
                                    <TooltipContent>
                                        <p className="text-xs text-red-200">{errorState[platform]}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
            </CardContent>
        </Card>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="sm:max-w-[400px] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Confirm Snapchat Post</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-4 scale-75 origin-top -mb-20">
                    <SnapchatMobilePreview image={previewData?.image} content={previewData?.content} />
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t sticky bottom-0 bg-white">
                    <Button variant="outline" onClick={() => setShowPreview(false)}>Cancel</Button>
                    <Button onClick={confirmSnapchatPost} className="bg-yellow-400 text-black hover:bg-yellow-500">
                        <Send className="w-4 h-4 mr-2" /> Post Now
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Posting History</CardTitle>
                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter Platform" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        {platforms.map(p => (
                            <SelectItem key={p} value={p}>{PLATFORM_CONFIGS[p]?.name || p}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Platform</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Message / Error</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && filteredHistory.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></TableCell></TableRow>
                        ) : filteredHistory.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-500">No posts found.</TableCell></TableRow>
                        ) : (
                            filteredHistory.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium capitalize flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLATFORM_CONFIGS[post.platform]?.color || '#ccc' }} />
                                        {post.platform}
                                        {post.retry_count > 0 && <Badge variant="secondary" className="text-[10px] h-4 px-1">Retry {post.retry_count}</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${post.status === 'posted' || post.status === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                            ${post.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                            ${post.status === 'posting' || post.status === 'pending' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                        `}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-xs text-slate-500">
                                        {post.status === 'failed' ? 
                                            <span className="text-red-500 flex items-center gap-1" title={post.error_message}><AlertCircle className="w-3 h-3" /> {post.error_message || 'Unknown error'}</span> : 
                                            (post.post_content || "No content")
                                        }
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {post.created_at ? format(new Date(post.created_at), 'MMM d, h:mm a') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            {post.status === 'failed' && (
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-orange-500" onClick={() => retryPost(post.id)} title="Retry">
                                                    <RefreshCcw className="w-3 h-3" />
                                                </Button>
                                            )}
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => deletePost(post.id)} title="Delete">
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
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

export default PostTab;