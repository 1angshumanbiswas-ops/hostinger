import React from 'react';
import AdCopyGenerator from '@/components/apps/seo/AdCopyGenerator';
import DataSection from '@/components/apps/seo/DataSection';
import { useToast } from '@/components/ui/use-toast';

const YouTubeCopyGenerator = ({ platform, currentCopy, onCopyUpdate, ...props }) => {
  // Video generation components and logic removed as requested.
  // Keeping only Copy Generator and Data Section.

  return (
    <div className="space-y-6 h-full flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Left Column: Editor & Copy Generation */}
            <div className="flex flex-col gap-6 h-full min-h-[600px]">
                <AdCopyGenerator 
                    platform="youtube" 
                    currentCopy={currentCopy} 
                    onCopyUpdate={onCopyUpdate}
                    {...props}
                />
            </div>

            {/* Right Column: Data Breakdown (Moved here since video preview is gone) */}
            <div className="flex flex-col h-full min-h-[600px] justify-start">
                 <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex items-center justify-center min-h-[200px] text-slate-400 mb-6">
                    <span className="text-sm">Video Preview Disabled</span>
                 </div>
                 <DataSection 
                    data={currentCopy}
                    jobDetails={props.jobDetails}
                />
            </div>
        </div>
    </div>
  );
};

export default YouTubeCopyGenerator;