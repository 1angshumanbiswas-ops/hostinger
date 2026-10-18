import React, { useEffect, useState } from 'react';
import { Copy, Edit3, Save, Lock, RotateCcw, CheckCircle2, TrendingUp, Lightbulb, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { useSavedCopy } from '@/hooks/useSavedCopy';
import { useAICopySuggestions } from '@/hooks/useAICopySuggestions';
import { useEngagementOptimization } from '@/hooks/useEngagementOptimization';
import PostNowButton from './PostNowButton';
import AICopySuggestions from './AICopySuggestions';
import EngagementOptimizer from './EngagementOptimizer';

const AdCopyGenerator = ({ 
  platform, 
  currentCopy, 
  onCopyUpdate,
  selectedColor,
  selectedTemplate,
  jobDetails
}) => {
  const { toast } = useToast();
  const { getSavedCopy, saveCopy, editCopy, loading } = useSavedCopy();
  
  const savedData = getSavedCopy(platform);
  const isLocked = savedData?.isLocked || false;
  const lastSavedAt = savedData?.savedAt;
  
  const copyText = typeof currentCopy === 'string' ? currentCopy : currentCopy?.content || '';
  const { 
    suggestions: aiSuggestions, 
    isLoading: aiLoading, 
    applySuggestion: applyAiSuggestion, 
    currentSuggestionIndex,
    regenerateSuggestions
  } = useAICopySuggestions(platform, copyText, jobDetails);

  const {
    currentScore,
    suggestions: optimizationSuggestions,
    potentialScore,
    applyOptimization,
    applyAllOptimizations
  } = useEngagementOptimization(copyText, platform);

  const [lastAppliedSuggestionMeta, setLastAppliedSuggestionMeta] = useState(null);

  // Expanded copies (Templates) 
  const expandedCopies = {
    whatsapp: `*Job Alert* 🚨\n\nWe are hiring immediately.\nReply *YES* for details.`
  };

  const limits = {
    facebook: 63206, 
    instagram: 2200, 
    whatsapp: 65536,
    linkedin: 3000,
    snapchat: 150
  };

  useEffect(() => {
    if (savedData?.content) {
       onCopyUpdate(savedData.content);
    } else if (expandedCopies[platform] && (!currentCopy?.content || currentCopy.content.length < 50)) {
       onCopyUpdate(expandedCopies[platform]);
    }
  }, [platform, loading, savedData?.content]);

  const maxChars = limits[platform] || 2000;
  const currentLength = copyText.length || 0;
  const isOverLimit = currentLength > maxChars;

  const handleCopy = () => {
    if (copyText) {
      navigator.clipboard.writeText(copyText);
      toast({ title: "Copied", description: "Ad text copied to clipboard." });
    }
  };

  const handleReset = () => {
      onCopyUpdate("");
      setLastAppliedSuggestionMeta(null);
      toast({ title: "Reset", description: "Ad text cleared." });
  };

  const handleSave = () => {
    if (copyText) {
      saveCopy(platform, copyText);
      toast({ 
        title: "Saved Successfully", 
        description: "Your copy has been locked and saved.",
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-900"
      });
    }
  };

  const handleEdit = () => {
    editCopy(platform, copyText);
    toast({ 
        title: "Editing Mode", 
        description: "You can now make changes. Don't forget to save!",
        className: "bg-orange-50 border-orange-200 text-orange-900" 
    });
  };

  const handleApplyAiSuggestion = (text, meta) => {
      onCopyUpdate(text);
      setLastAppliedSuggestionMeta(meta);
      toast({ 
          title: "Suggestion Applied", 
          description: `Applied '${meta.angle}' angle successfully.`,
          className: "bg-indigo-50 border-indigo-200 text-indigo-900"
      });
  };

  const handleApplyOptimization = (newText) => {
      onCopyUpdate(newText);
      toast({ 
          title: "Optimization Applied", 
          description: "Engagement score updated.",
          className: "bg-green-50 border-green-200 text-green-900"
      });
  };

  const showPostNow = true;

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 p-1">
        <div className="flex items-center gap-2">
            {/* AI Image Selection Section Removed */}
            
            {currentScore > 0 && (
                <Badge variant="outline" className={`text-xs border ${currentScore > 75 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Score: {currentScore}
                </Badge>
            )}
        </div>
        <div className="flex items-center gap-2">
           {showPostNow && (
             <PostNowButton 
                platform={platform} 
                content={copyText} 
                // Image removed from props as requested
                image={null}
                color={selectedColor}
                template={selectedTemplate}
             />
           )}
        </div>
      </div>

      <Card className={`border shadow-sm flex-1 flex flex-col transition-colors duration-300 ${isLocked ? 'bg-green-50/30 border-green-200' : 'bg-white border-slate-200'}`}>
        <CardHeader className="pb-2 border-b flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
             <CardTitle className="text-sm font-medium text-slate-700 uppercase tracking-wider flex items-center gap-2">
               {isLocked ? <Lock className="w-4 h-4 text-green-600" /> : <Edit3 className="w-4 h-4 text-orange-500" />}
               {platform} Copy
             </CardTitle>
             {lastSavedAt && (
               <p className="text-[10px] text-slate-400 font-medium">
                  Last saved: {format(new Date(lastSavedAt), 'MMM d, h:mm a')}
               </p>
             )}
          </div>

          <Badge 
             variant={isLocked ? "default" : "secondary"}
             className={isLocked ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}
          >
             {isLocked ? (
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Saved</span>
             ) : (
                <span className="flex items-center gap-1">Unsaved Changes</span>
             )}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4 pt-2 flex-1 flex flex-col p-0">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
              <div className="px-4 pt-2">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="suggestions" className="flex gap-2">
                        <Lightbulb className="w-3 h-3" /> AI Suggestions
                    </TabsTrigger>
                    <TabsTrigger value="optimizer" className="flex gap-2">
                        <TrendingUp className="w-3 h-3" /> Optimize
                    </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="editor" className="flex-1 flex flex-col p-4 space-y-4 data-[state=inactive]:hidden">
                    <div className="flex-1 relative group min-h-[150px]">
                        <Textarea
                        readOnly={isLocked}
                        placeholder={`Enter your custom ad copy for ${platform}...`}
                        className={`w-full h-full min-h-[150px] resize-none text-sm font-sans leading-relaxed p-4 transition-all duration-300
                            ${isLocked 
                                ? 'bg-slate-50 text-slate-600 cursor-not-allowed border-transparent focus:ring-0' 
                                : 'bg-white border-slate-200 focus:border-orange-300 focus:ring-orange-100'
                            }`}
                        value={copyText}
                        onChange={(e) => onCopyUpdate(e.target.value)}
                        />
                        {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Badge className="bg-white text-slate-900 shadow-sm pointer-events-auto">
                                <Lock className="w-3 h-3 mr-1" /> Read Only
                            </Badge>
                        </div>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        <span>{platform === 'instagram' ? 'Caption' : 'Post'} content</span>
                        <span className={`${isOverLimit ? 'text-red-500 font-bold' : ''}`}>
                            {currentLength.toLocaleString()} / {maxChars.toLocaleString()} chars
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-2 pt-2 border-t border-slate-100">
                        {isLocked ? (
                            <Button onClick={handleEdit} size="sm" variant="outline"><Edit3 className="w-4 h-4 mr-2" /> Edit</Button>
                        ) : (
                            <>
                            <Button onClick={handleReset} variant="ghost" size="sm"><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
                            <Button onClick={handleSave} size="sm" className="bg-orange-500 hover:bg-orange-600"><Save className="w-4 h-4 mr-2" /> Save Copy</Button>
                            </>
                        )}
                        <Button onClick={handleCopy} variant="outline" size="sm" className="text-indigo-600"><Copy className="w-4 h-4 mr-2" /> Copy</Button>
                    </div>
              </TabsContent>

              <TabsContent value="suggestions" className="flex-1 p-4 overflow-y-auto max-h-[600px] data-[state=inactive]:hidden">
                 <AICopySuggestions 
                    suggestions={aiSuggestions}
                    isLoading={aiLoading}
                    onApply={(idx) => applyAiSuggestion(idx, handleApplyAiSuggestion)}
                    onRegenerate={regenerateSuggestions}
                    currentAppliedIndex={currentSuggestionIndex}
                 />
              </TabsContent>

              <TabsContent value="optimizer" className="flex-1 p-4 overflow-y-auto max-h-[600px] data-[state=inactive]:hidden">
                 <EngagementOptimizer 
                    currentScore={currentScore}
                    suggestions={optimizationSuggestions}
                    potentialScore={potentialScore}
                    onApply={(idx) => applyOptimization(idx, handleApplyOptimization)}
                    onApplyAll={() => applyAllOptimizations(handleApplyOptimization)}
                 />
              </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdCopyGenerator;