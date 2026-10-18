import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, CheckCircle2, RefreshCw, Zap } from 'lucide-react';

const AICopySuggestions = ({ 
  suggestions, 
  isLoading, 
  onApply, 
  onRegenerate,
  currentAppliedIndex 
}) => {
  
  if (isLoading) {
    return (
      <div className="space-y-4 p-2">
         {[1, 2, 3].map(i => (
             <div key={i} className="flex flex-col gap-2 border rounded-lg p-4 bg-slate-50">
                 <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                 </div>
                 <Skeleton className="h-16 w-full" />
                 <Skeleton className="h-8 w-24" />
             </div>
         ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-1">
      <div className="flex justify-between items-center mb-2">
         <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            AI Variations
         </h4>
         <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRegenerate} 
            className="text-xs text-slate-500 hover:text-indigo-600 h-8"
         >
            <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
         </Button>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
            {suggestions.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className={`border transition-all duration-200 hover:border-indigo-300 ${currentAppliedIndex === index ? 'ring-2 ring-indigo-100 border-indigo-500 bg-indigo-50/10' : 'border-slate-200'}`}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h5 className="font-semibold text-slate-800 text-sm">{item.angle}</h5>
                                        {item.engagementScore > 90 && (
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px] h-4">
                                                <Zap className="w-2 h-2 mr-1" /> High Impact
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{item.description}</p>
                                </div>
                                <Badge variant="outline" className={`font-mono text-xs ${item.engagementScore >= 90 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600'}`}>
                                    {item.engagementScore} Score
                                </Badge>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-md text-xs text-slate-700 font-sans border border-slate-100 mb-3 whitespace-pre-wrap line-clamp-3">
                                {item.suggestedCopy}
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-slate-400 italic flex-1 mr-2">
                                    Why: {item.reasoning}
                                </p>
                                <Button 
                                    size="sm" 
                                    onClick={() => onApply(index)}
                                    variant={currentAppliedIndex === index ? "default" : "outline"}
                                    className={`h-7 text-xs ${currentAppliedIndex === index ? 'bg-indigo-600 hover:bg-indigo-700' : 'text-slate-600'}`}
                                >
                                    {currentAppliedIndex === index ? (
                                        <><CheckCircle2 className="w-3 h-3 mr-1" /> Applied</>
                                    ) : 'Apply'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AICopySuggestions;