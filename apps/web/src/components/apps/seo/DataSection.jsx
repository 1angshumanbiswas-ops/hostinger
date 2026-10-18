import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Edit3, Rocket, Briefcase, Banknote, Home, Type } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateVideoTitle } from '@/utils/youtubeVideoGenerator';

const DataSection = ({ data, jobDetails }) => {
  const { toast } = useToast();
  
  // Extract or default data
  const content = typeof data === 'string' ? data : data?.content || "";
  const title = generateVideoTitle(content);
  const description = content.replace(title, '').trim();

  const handleCopy = (text, type) => {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: `${type} copied to clipboard.` });
  };

  return (
    <Card className="bg-white border-slate-200 shadow-sm mt-6">
        <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Title Block */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Rocket className="w-3 h-3 text-orange-500" /> Video Title
                    </h4>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm font-semibold text-slate-800 line-clamp-2 min-h-[3rem]">
                        {title}
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-indigo-600 ml-auto flex" onClick={() => handleCopy(title, "Title")}>
                        <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                </div>

                {/* Role Info Block */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                         <Briefcase className="w-3 h-3 text-blue-500" /> Job Details
                    </h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                             <Home className="w-4 h-4 text-slate-400" />
                             <span className="font-medium">{jobDetails?.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                             <Banknote className="w-4 h-4 text-green-500" />
                             <span className="font-medium">{jobDetails?.salary || "Competitive Salary"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                             <Briefcase className="w-4 h-4 text-purple-500" />
                             <span className="font-medium">{jobDetails?.title || "Full-time Role"}</span>
                        </div>
                    </div>
                </div>

                {/* Description Stat Block */}
                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-2">
                    <div className="flex items-center justify-between">
                         <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                             <Type className="w-3 h-3 text-slate-500" /> Description Content
                         </h4>
                         <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                             {content.length} / 5000 chars
                         </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 line-clamp-3 min-h-[3.5rem] whitespace-pre-wrap">
                        {description || "No description content available yet."}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleCopy(description, "Description")}>
                            <Copy className="w-3 h-3 mr-1" /> Copy Desc
                        </Button>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

export default DataSection;