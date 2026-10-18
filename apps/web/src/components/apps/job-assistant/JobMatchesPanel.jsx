import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Check, X, Star, Loader2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const JobMatchesPanel = ({ matchStatus, onRunMatching, matchedJobs, onApprove, onReject, canMatch }) => {
  return (
    <Card className="h-full border-[#E0E0D8] bg-white shadow-sm flex flex-col relative overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-[#F5F3F0] pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
               matchStatus === 'matching' ? 'bg-purple-100 text-purple-600' :
               matchStatus === 'completed' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {matchStatus === 'matching' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Target className="w-5 h-5" />}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#333333]">Matches Found</CardTitle>
              <div className="flex items-center gap-2 text-xs text-[#555555]">
                <Badge variant="outline" className={`
                  ${matchStatus === 'idle' ? 'border-slate-300 text-slate-500' : ''}
                  ${matchStatus === 'matching' ? 'border-purple-200 text-purple-600 bg-purple-50' : ''}
                  ${matchStatus === 'completed' ? 'border-purple-200 text-purple-600 bg-purple-50' : ''}
                `}>
                  {matchStatus === 'idle' ? 'Waiting for Scan' : matchStatus === 'matching' ? 'Analyzing...' : 'Analysis Complete'}
                </Badge>
              </div>
            </div>
          </div>
           <div className="text-right">
            <span className="text-2xl font-bold text-[#333333]">{matchedJobs.length}</span>
            <p className="text-[10px] text-[#555555] uppercase tracking-wider">Top Matches</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 relative flex flex-col">
        
        <div className="flex-1 relative">
            {matchStatus === 'idle' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-10 p-6 text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-full max-w-[200px]">
                            <Button 
                                size="lg"
                                onClick={onRunMatching}
                                disabled={!canMatch}
                                className={`w-full h-14 shadow-lg transition-all rounded-xl text-lg font-semibold group ${
                                    canMatch 
                                    ? 'bg-[#2D7A4A] hover:bg-[#23633b] text-white hover:shadow-xl' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                <PlayCircle className="w-5 h-5 mr-2 fill-current" />
                                Run Matching
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{canMatch ? "Analyze scanned jobs against your profile" : "Please run scan first"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="mt-4 text-sm text-[#555555]">
                        {canMatch 
                            ? "AI will compare job requirements with your skills." 
                            : "Waiting for scanned jobs..."}
                    </p>
                </div>
            ) : null}

            {matchStatus === 'matching' ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20">
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                  <h3 className="text-lg font-bold text-purple-700">Analyzing Compatibility...</h3>
                  <p className="text-sm text-[#555555]">Comparing skills, experience, and requirements</p>
               </div>
            ) : null}

            <ScrollArea className="h-full w-full p-4">
              <AnimatePresence>
                {matchedJobs.length === 0 && matchStatus === 'completed' ? (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400 space-y-2">
                     <Star className="w-8 h-8 opacity-20" />
                     <p className="text-sm">No strong matches found in this batch.</p>
                  </div>
                ) : (
                  matchedJobs.map((item, index) => (
                    <motion.div
                      key={item.job.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="mb-4 p-4 rounded-xl border border-purple-100 bg-white shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                      
                      <div className="flex justify-between items-start mb-2 pl-2">
                        <div>
                           <h4 className="font-bold text-[#333333] text-sm">{item.job.title}</h4>
                           <p className="text-xs text-[#555555]">{item.job.company}</p>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-lg font-bold text-purple-600">{item.analysis.score}%</span>
                           <span className="text-[10px] text-slate-400 uppercase">Match</span>
                        </div>
                      </div>

                      <div className="pl-2 space-y-3">
                        <Progress value={item.analysis.score} className="h-1.5 bg-purple-50" indicatorClassName="bg-purple-500" />
                        
                        <div className="flex flex-wrap gap-1">
                          {item.analysis.matchedSkills.slice(0, 3).map(skill => (
                            <Badge key={skill} variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 hover:bg-purple-100">
                              {skill}
                            </Badge>
                          ))}
                          {item.analysis.matchedSkills.length > 3 && (
                            <span className="text-[10px] text-slate-400 px-1">+{item.analysis.matchedSkills.length - 3} more</span>
                          )}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="w-full bg-[#2D7A4A] hover:bg-[#23633b] h-8 text-xs"
                            onClick={() => onApprove(item)}
                          >
                            <Check className="w-3 h-3 mr-1" /> Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50 h-8 text-xs"
                            onClick={() => onReject(item.job.id)}
                          >
                            <X className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobMatchesPanel;