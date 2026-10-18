import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Linkedin, Facebook, Instagram, MessageCircle, Send, Clock, AlertCircle, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';

const ScheduledPostCard = ({ post, onPostNow }) => {
  const iconMap = {
    linkedin: <Linkedin className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    whatsapp: <MessageCircle className="w-4 h-4" />
  };

  const statusColors = {
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    posted: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    failed: "bg-red-100 text-red-700 border-red-200"
  };

  const statusIcons = {
    scheduled: <Clock className="w-3 h-3 mr-1" />,
    posted: <CheckCircle2 className="w-3 h-3 mr-1" />,
    pending: <Clock className="w-3 h-3 mr-1" />,
    failed: <AlertCircle className="w-3 h-3 mr-1" />
  };

  // Safe extraction of theme info if stored in engagement_metrics or root
  const themeMeta = post.engagement_metrics?.theme_meta || {};
  // Check if AI selected based on stored metadata. 
  // We assume 'theme_meta' has the 'name' property set to 'AI Selected' or a dedicated flag.
  const isAiSelected = themeMeta.name === "AI Selected" || post.engagement_metrics?.theme_meta?.isAiSelected;

  return (
    <Card className="hover:shadow-md transition-all duration-300 border-slate-200 group overflow-hidden">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Platform Icon */}
        <div className={`p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors`}>
           {iconMap[post.platform] || <Send className="w-4 h-4" />}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <h4 className="text-sm font-semibold text-slate-900 capitalize">{post.platform} Post</h4>
             <Badge variant="outline" className={`h-5 text-[10px] px-1.5 border ${statusColors[post.status] || "bg-slate-100 text-slate-600"}`}>
                {statusIcons[post.status]} {post.status}
             </Badge>
          </div>
          <div className="text-xs text-slate-500 flex flex-col gap-1">
             <span className="flex items-center gap-2">
                {format(new Date(post.scheduled_time), 'MMM d, h:mm a')}
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: post.color === 'Gradient' ? '#833AB4' : post.color.toLowerCase() }} />
                    {post.color}
                </span>
             </span>
             {themeMeta.name && (
                <div className="flex items-center gap-1">
                    {isAiSelected ? (
                        <span className="flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded w-fit border border-indigo-100">
                            <Sparkles className="w-3 h-3 text-indigo-500" /> AI Selected
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded w-fit">
                            <ImageIcon className="w-3 h-3" /> Theme: {themeMeta.name}
                        </span>
                    )}
                </div>
             )}
          </div>
        </div>

        {/* Image Preview Thumbnail if available */}
        {post.image_url && (
            <div className="h-10 w-16 rounded border border-slate-200 overflow-hidden flex-shrink-0 relative">
                <img src={post.image_url} alt="Scheduled asset" className="w-full h-full object-cover" />
                {isAiSelected && (
                    <div className="absolute top-0 right-0 p-0.5 bg-indigo-600">
                        <Sparkles className="w-2 h-2 text-white" />
                    </div>
                )}
            </div>
        )}

        {/* Actions */}
        {post.status === 'scheduled' && (
           <TooltipProvider>
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button 
                   size="sm" 
                   variant="ghost" 
                   className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                   onClick={() => onPostNow(post)}
                 >
                    <Send className="w-4 h-4" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent>
                 <p>Post Immediately</p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduledPostCard;