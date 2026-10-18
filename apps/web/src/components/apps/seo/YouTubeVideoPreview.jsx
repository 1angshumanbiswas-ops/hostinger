import React, { useState } from 'react';
import { Play, ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatViewCount, formatUploadTime } from '@/utils/youtubeVideoGenerator';
import { motion, AnimatePresence } from 'framer-motion';

const YouTubeVideoPreview = ({ videoData }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { title, description, thumbnail, metadata } = videoData;
  const { viewCount, uploadTime, channelName, channelAvatar, duration } = metadata || {};

  const defaultThumbnail = "https://horizons-cdn.hostinger.com/e0687bb0-98a0-45d4-8f73-50f1c1652251/458871fe584c6a34dce9a67d14642588.png";

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 max-w-2xl mx-auto font-sans">
      {/* Thumbnail Section */}
      <div className="relative aspect-video group cursor-pointer bg-slate-900">
        <img 
            src={thumbnail || defaultThumbnail} 
            alt="Video Thumbnail" 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl"
            >
                <Play className="w-6 h-6 text-white fill-white ml-1" />
            </motion.div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
            {duration || "4:20"}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/20">
             <div className="h-full w-[35%] bg-red-600"></div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 space-y-4">
        <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug line-clamp-2">
                {title || "Video Title Loading..."}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                <span>{formatViewCount(viewCount)}</span>
                <span className="text-[10px]">•</span>
                <span>{formatUploadTime(uploadTime)}</span>
            </div>
        </div>

        {/* Channel & Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-100 pb-4">
             <div className="flex items-center gap-3">
                 <img src={channelAvatar || "https://ui-avatars.com/api/?name=Channel"} alt={channelName} className="w-10 h-10 rounded-full bg-slate-200" />
                 <div>
                     <p className="text-sm font-bold text-slate-900">{channelName || "Channel Name"}</p>
                     <p className="text-xs text-slate-500">125K subscribers</p>
                 </div>
                 <Button variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full h-9 px-4 text-sm font-medium ml-2">
                     Subscribe
                 </Button>
             </div>
             
             <div className="flex items-center gap-2">
                 <div className="flex bg-slate-100 rounded-full h-9 items-center px-1">
                     <Button variant="ghost" size="sm" className="rounded-l-full hover:bg-slate-200 h-9 px-3 gap-2 text-slate-700">
                         <ThumbsUp className="w-4 h-4" />
                         <span className="text-xs font-semibold">4.5K</span>
                     </Button>
                     <div className="w-px h-5 bg-slate-300"></div>
                     <Button variant="ghost" size="sm" className="rounded-r-full hover:bg-slate-200 h-9 px-3 text-slate-700">
                         <ThumbsDown className="w-4 h-4" />
                     </Button>
                 </div>
                 <Button variant="ghost" size="sm" className="bg-slate-100 rounded-full hover:bg-slate-200 h-9 px-4 gap-2 text-slate-700">
                     <Share2 className="w-4 h-4" />
                     <span className="text-xs font-semibold">Share</span>
                 </Button>
                 <Button variant="ghost" size="sm" className="bg-slate-100 rounded-full hover:bg-slate-200 w-9 h-9 p-0 text-slate-700">
                     <MoreHorizontal className="w-4 h-4" />
                 </Button>
             </div>
        </div>

        {/* Description Section */}
        <div className="bg-slate-50 rounded-xl p-3 text-sm cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setShowFullDesc(!showFullDesc)}>
             <div className="flex gap-2 font-semibold text-slate-900 mb-1">
                 <span>{formatViewCount(viewCount)}</span>
                 <span>{formatUploadTime(uploadTime)}</span>
                 <span className="text-slate-400">#Hiring #Remote #TechJobs</span>
             </div>
             <motion.div 
                initial={false}
                animate={{ height: showFullDesc ? "auto" : 60 }}
                className="overflow-hidden text-slate-700 whitespace-pre-wrap relative"
             >
                 {description || "No description provided."}
             </motion.div>
             <button className="text-slate-600 font-bold mt-1 text-xs uppercase hover:text-slate-900">
                 {showFullDesc ? "Show less" : "Show more"}
             </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideoPreview;