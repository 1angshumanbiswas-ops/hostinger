import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MoreHorizontal, ThumbsUp, MessageCircle, Share2, Heart, Send, Globe, Smile, Paperclip, Phone, Video, RefreshCw, Camera, Sparkles, BrainCircuit } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';

const AdPreview = ({ platform, selectedCopy, selectedTemplate, selectedColor, currentImage, refreshImage, isAiLoading }) => {
  
  const primaryColor = selectedColor?.colors[0] || '#333';
  const secondaryColor = selectedColor?.colors[1] || '#666';

  // Helper for image rendering
  const renderJobImage = (aspectClass) => (
    <div className={`${aspectClass} bg-slate-100 flex items-center justify-center relative overflow-hidden group`}>
      <AnimatePresence mode="wait">
        {isAiLoading ? (
           <motion.div
             key="loading"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 flex items-center justify-center bg-slate-100"
           >
              <div className="flex flex-col items-center gap-2">
                 <BrainCircuit className="w-8 h-8 text-indigo-400 animate-spin" />
                 <span className="text-xs text-indigo-500 font-medium">AI Selecting...</span>
              </div>
           </motion.div>
        ) : currentImage?.imageUrl ? (
          <motion.div
             key={currentImage.imageUrl}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.8 }}
             className="w-full h-full relative"
          >
             <img src={currentImage.imageUrl} alt="Ad Visual" className="w-full h-full object-cover" />
             
             {/* AI Badge Overlay */}
             {currentImage.isAiSelected && (
                 <div className="absolute top-2 left-2 bg-indigo-500/90 text-white px-2 py-1 rounded text-[10px] backdrop-blur-sm flex items-center gap-1 shadow-sm">
                     <Sparkles className="w-3 h-3 text-yellow-300" />
                     AI Selected
                 </div>
             )}

             <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
             
             <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                 <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white" onClick={refreshImage}>
                     <RefreshCw className="w-3 h-3 text-slate-700" />
                 </Button>
             </div>
          </motion.div>
        ) : (
          <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center">
             <Camera className="w-8 h-8 text-slate-300" />
          </div>
        )}
      </AnimatePresence>
      
      {/* Template Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
         <div className="text-center p-4 w-full">
            {selectedTemplate?.id === 'professional' ? (
                <div className="bg-white/95 p-4 rounded shadow-sm inline-block max-w-[80%] backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">WE ARE HIRING</h3>
                    <Button size="sm" className="mt-2 h-7 text-xs bg-[#0A66C2] w-full">Apply Now</Button>
                </div>
            ) : selectedTemplate?.id === 'visual-story' ? (
                 <div className="text-white">
                    <h2 className="text-3xl font-black border-4 border-white p-2 uppercase tracking-tighter mix-blend-overlay">Hiring</h2>
                 </div>
            ) : (
                <h3 className="text-2xl font-black text-white tracking-widest drop-shadow-lg opacity-90">JOIN<br/>US</h3>
            )}
         </div>
      </div>
    </div>
  );
  
  if (!selectedCopy || !selectedCopy.content) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <p className="text-sm">Enter ad copy to see preview</p>
      </div>
    );
  }

  // -- LINKEDIN LAYOUT --
  if (platform === 'linkedin') {
    return (
      <Card className="max-w-md w-full mx-auto bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
        <div className="p-3 flex justify-between items-start border-b border-slate-50 flex-shrink-0">
          <div className="flex gap-2">
            <Avatar className="h-10 w-10 rounded-sm">
              <AvatarFallback className="rounded-sm bg-slate-100 font-bold text-slate-600">HR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-none">Your Company</p>
              <p className="text-[10px] text-slate-500 mt-1">Promoted</p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>
        
        <ScrollArea className="flex-1">
            <div className="p-3 text-sm text-slate-800 whitespace-pre-wrap font-sans">
              {selectedCopy.content}
            </div>

            <div className="mx-3 mb-3 rounded-md overflow-hidden border border-slate-100">
               {renderJobImage("aspect-[1.91/1]")}
               <div className="bg-slate-50 px-3 py-2 flex justify-between items-center">
                    <div className="text-xs font-semibold text-slate-700">Apply for Job</div>
                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-full border-slate-400 text-slate-600">Apply</Button>
               </div>
            </div>
            
            {currentImage && (
               <div className="px-3 pb-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Photo by {currentImage.photographer} ({currentImage.source})</span>
                  {currentImage.isAiSelected && <Badge variant="secondary" className="text-[8px] h-4 bg-indigo-50 text-indigo-600">AI Pick</Badge>}
               </div>
            )}
        </ScrollArea>

        <div className="p-2 border-t border-slate-100 flex gap-4 text-slate-500 flex-shrink-0 bg-white">
           <div className="flex items-center gap-1"><ThumbsUp className="w-4 h-4"/> <span className="text-xs">Like</span></div>
           <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4"/> <span className="text-xs">Comment</span></div>
        </div>
      </Card>
    );
  }

  // -- INSTAGRAM LAYOUT --
  if (platform === 'instagram') {
    return (
      <Card className="max-w-xs w-full mx-auto bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
        <div className="p-2.5 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
             <Avatar className="h-7 w-7"><AvatarFallback>CO</AvatarFallback></Avatar>
             <span className="text-xs font-semibold text-slate-900">company_official</span>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-500" />
        </div>

        <ScrollArea className="flex-1">
            {renderJobImage("aspect-square w-full")}

            <div className="p-3">
              <div className="flex justify-between mb-2">
                  <div className="flex gap-3 text-slate-900">
                      <Heart className="w-5 h-5" />
                      <MessageCircle className="w-5 h-5" />
                      <Share2 className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">Save</Badge>
              </div>
              <p className="text-sm text-slate-900 mb-1"><span className="font-semibold">234 likes</span></p>
              <div className="text-xs text-slate-800 whitespace-pre-wrap">
                  <span className="font-semibold mr-1">company_official</span>
                  {selectedCopy.content}
              </div>
            </div>
        </ScrollArea>
      </Card>
    );
  }

  // -- FACEBOOK LAYOUT --
  if (platform === 'facebook') {
    return (
      <Card className="max-w-md w-full mx-auto bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
         <div className="p-3 flex gap-2 flex-shrink-0">
            <Avatar><AvatarFallback>FB</AvatarFallback></Avatar>
            <div>
               <p className="text-sm font-semibold text-slate-900">Company Page</p>
               <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span>Sponsored</span> • <Globe className="w-3 h-3"/>
               </div>
            </div>
         </div>
         
         <ScrollArea className="flex-1">
             <div className="px-3 pb-2 text-sm text-slate-900 whitespace-pre-wrap font-sans">
                {selectedCopy.content}
             </div>
             
             {renderJobImage("aspect-video w-full")}
             
            <div className="bg-slate-50 px-3 py-2 flex justify-between items-center border-b border-slate-100">
                <div>
                <p className="text-[10px] text-slate-500 uppercase">company.com</p>
                <p className="text-sm font-bold text-slate-900">Join our team today!</p>
                </div>
                <Button size="sm" variant="secondary" className="h-8 bg-slate-200 text-slate-800">Learn More</Button>
            </div>
         </ScrollArea>

         <div className="p-2 flex justify-around text-slate-500 border-t border-slate-100 flex-shrink-0 bg-white">
            <div className="flex items-center gap-1"><ThumbsUp className="w-4 h-4"/> <span className="text-xs font-medium">Like</span></div>
            <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4"/> <span className="text-xs font-medium">Comment</span></div>
            <div className="flex items-center gap-1"><Share2 className="w-4 h-4"/> <span className="text-xs font-medium">Share</span></div>
         </div>
      </Card>
    );
  }

  // -- WHATSAPP LAYOUT --
  if (platform === 'whatsapp') {
    return (
      <Card className="max-w-xs w-full mx-auto bg-[#E5DDD5] border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-[#008069] p-3 flex items-center gap-2 text-white flex-shrink-0">
           <Avatar className="h-8 w-8"><AvatarFallback className="bg-slate-200 text-[#008069]">HR</AvatarFallback></Avatar>
           <div className="flex-1">
              <p className="text-sm font-semibold">HR Recruiter</p>
              <p className="text-[10px] opacity-80">online</p>
           </div>
           <Video className="w-5 h-5" />
           <Phone className="w-5 h-5 ml-2" />
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-3">
           <div className="flex flex-col space-y-3 pb-4">
               {/* Auto-message/System message mock */}
               <div className="flex justify-center mb-4">
                  <span className="text-[10px] bg-[#FFF5C4] text-slate-600 px-2 py-1 rounded shadow-sm">
                     Messages are end-to-end encrypted.
                  </span>
               </div>

               {selectedTemplate?.id === 'broadcast-card' && (
                  <div className="bg-white p-1 rounded-lg rounded-tl-none shadow-sm max-w-[85%] self-start overflow-hidden">
                     {renderJobImage("aspect-video w-full rounded-md mb-1")}
                     <p className="text-xs text-slate-800 px-1 pb-1">Check out this new opening!</p>
                     <div className="text-[9px] text-slate-400 text-right px-1">10:42 AM</div>
                  </div>
               )}
               
               <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm max-w-[90%] self-start">
                  <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                     {selectedCopy.content}
                  </p>
                  <div className="text-[9px] text-slate-400 text-right mt-1">10:43 AM</div>
               </div>
           </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="bg-white p-2 flex items-center gap-2 flex-shrink-0">
           <Smile className="w-5 h-5 text-slate-400" />
           <div className="flex-1 bg-white border border-slate-100 rounded-full h-8 px-3 text-xs flex items-center text-slate-400">Message</div>
           <Paperclip className="w-5 h-5 text-slate-400" />
           <div className="w-8 h-8 bg-[#008069] rounded-full flex items-center justify-center">
              <Send className="w-4 h-4 text-white ml-0.5" />
           </div>
        </div>
      </Card>
    );
  }

  return null;
};

export default AdPreview;