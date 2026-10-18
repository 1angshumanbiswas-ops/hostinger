import React from 'react';
import { RefreshCw, AlertCircle, Sparkles, BrainCircuit, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

const ImageRefresher = ({ currentImage, loading, error, onRefresh, lastRefreshed, theme, reasoning }) => {
  
  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50/50 rounded-lg border border-slate-200">
      {/* Header with AI Badge */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            {loading ? (
                <span className="flex items-center gap-1 text-indigo-600 animate-pulse">
                    <BrainCircuit className="w-4 h-4" /> AI Selecting...
                </span>
            ) : (
                <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    AI Selected Image
                </span>
            )}
            </h4>
        </div>
        
        {lastRefreshed && !loading && (
          <span className="text-[10px] text-slate-400">
            Updated: {format(new Date(lastRefreshed), 'h:mm a')}
          </span>
        )}
      </div>

      {/* Image Area */}
      <div className="relative group aspect-video rounded-md overflow-hidden bg-slate-200 shadow-sm border border-slate-100">
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
             >
               <Skeleton className="w-full h-full" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-indigo-600 animate-spin" />
                      <span className="text-xs font-medium text-indigo-900">Analyzing keywords...</span>
                  </div>
               </div>
             </motion.div>
          ) : currentImage ? (
            <motion.div
              key={currentImage.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full relative"
            >
              <img 
                src={currentImage.imageUrl} 
                alt="AI Selected Ad Background" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                 <div className="flex items-center gap-1.5 text-white/90 mb-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] font-bold">AI Reason:</span>
                 </div>
                 <p className="text-[10px] text-white/90 leading-tight">
                    {reasoning || currentImage.reasoning || "Matched to platform theme."}
                 </p>
                 <div className="mt-2 flex items-center justify-between text-[9px] text-white/60">
                    <span>By: {currentImage.photographer}</span>
                 </div>
              </div>
            </motion.div>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
               <div className="flex flex-col items-center gap-2">
                 <AlertCircle className="w-8 h-8 opacity-50" />
                 <span className="text-xs">No image loaded</span>
               </div>
             </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between gap-2">
         {error ? (
           <Badge variant="destructive" className="text-[10px] h-6">
             <AlertCircle className="w-3 h-3 mr-1" /> Selection Failed
           </Badge>
         ) : (
           <div className="flex items-center gap-2 flex-1 min-w-0">
               <Badge variant="secondary" className="text-[10px] h-6 bg-indigo-50 text-indigo-700 border-indigo-100 truncate max-w-full">
                  Score: {currentImage?.relevanceScore || 85}% Match
               </Badge>
           </div>
         )}

         <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={loading}
            className="h-7 text-xs border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200"
         >
            <RefreshCw className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Thinking...' : 'Try Another'}
         </Button>
      </div>
      
      {/* Reasoning Text (Visible always if not loading) */}
      {!loading && (reasoning || currentImage?.reasoning) && (
          <div className="text-[10px] text-slate-500 bg-slate-100 p-2 rounded border border-slate-100 italic">
             "{reasoning || currentImage?.reasoning}"
          </div>
      )}
    </div>
  );
};

export default ImageRefresher;