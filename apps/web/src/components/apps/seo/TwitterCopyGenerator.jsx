import React from 'react';
import AdCopyGenerator from '@/components/apps/seo/AdCopyGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, Repeat, Share } from 'lucide-react';

const TwitterCopyGenerator = ({ platform, ...props }) => {
  // Twitter has 280 char limit
  // Reuse AdCopyGenerator logic but tailored display
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Editor Side */}
        <div className="flex flex-col gap-6">
            <AdCopyGenerator 
                platform="twitter" 
                {...props}
            />
        </div>

        {/* Preview Side */}
        <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Twitter Preview</h3>
            <Card className="max-w-md mx-auto border border-slate-200 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>CO</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-sm text-slate-900">Company Name</span>
                                <span className="text-sm text-slate-500">@company_official</span>
                            </div>
                            <div className="mt-1 text-sm text-slate-900 whitespace-pre-wrap">
                                {typeof props.currentCopy === 'string' ? props.currentCopy : props.currentCopy?.content || "Your tweet content..."}
                            </div>
                            {/* Hashtags highlight mock */}
                            <div className="mt-2 text-[#1DA1F2] text-sm">
                                #Hiring #RemoteWork
                            </div>
                            
                            {/* Tweet Metrics */}
                            <div className="flex justify-between mt-3 max-w-[80%] text-slate-500">
                                <div className="flex items-center gap-1 text-xs group cursor-pointer hover:text-[#1DA1F2]">
                                    <MessageCircle className="w-4 h-4 p-0.5" /> 12
                                </div>
                                <div className="flex items-center gap-1 text-xs group cursor-pointer hover:text-green-500">
                                    <Repeat className="w-4 h-4 p-0.5" /> 5
                                </div>
                                <div className="flex items-center gap-1 text-xs group cursor-pointer hover:text-pink-500">
                                    <Heart className="w-4 h-4 p-0.5" /> 24
                                </div>
                                <div className="flex items-center gap-1 text-xs group cursor-pointer hover:text-[#1DA1F2]">
                                    <Share className="w-4 h-4 p-0.5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <div className="mt-6">
                <h4 className="text-xs font-semibold text-slate-500 mb-2">Character Limit</h4>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full ${(props.currentCopy?.content?.length || 0) > 280 ? 'bg-red-500' : 'bg-[#1DA1F2]'}`} 
                        style={{ width: `${Math.min(((props.currentCopy?.content?.length || 0) / 280) * 100, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{(props.currentCopy?.content?.length || 0)} chars</span>
                    <span>280 max</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TwitterCopyGenerator;