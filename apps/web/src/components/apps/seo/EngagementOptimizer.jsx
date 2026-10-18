import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Check, AlertTriangle, Wand2, Trophy } from 'lucide-react';
import { getEngagementScoreColor, getOptimizationImpactLabel } from '@/utils/seoAppUtils';

const EngagementOptimizer = ({ 
  currentScore, 
  suggestions, 
  potentialScore, 
  onApply, 
  onApplyAll 
}) => {
  
  const scoreColor = getEngagementScoreColor(currentScore);
  
  return (
    <div className="space-y-6 p-1">
        {/* Score Header */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Engagement Score</span>
                <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${scoreColor}`}>
                        {currentScore}
                    </span>
                    <span className="text-sm text-slate-400">/ 100</span>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 w-1/2">
                <div className="flex justify-between w-full text-xs text-slate-500 mb-1">
                    <span>Potential</span>
                    <span className="font-bold text-slate-700">{potentialScore}</span>
                </div>
                <Progress value={(currentScore / 100) * 100} className="h-2" />
                <p className="text-[10px] text-slate-400 mt-1">
                   {currentScore < 50 ? "Needs improvement" : currentScore < 80 ? "Good start" : "Excellent"}
                </p>
            </div>
        </div>

        {/* Suggestions List */}
        <div>
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-orange-500" />
                    Optimizations
                </h4>
                {suggestions.length > 0 && (
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-7 text-xs bg-orange-50 text-orange-700 hover:bg-orange-100"
                        onClick={onApplyAll}
                    >
                        Apply All
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {suggestions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed">
                        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50 text-yellow-500" />
                        <p className="text-sm">Perfect! No optimizations needed.</p>
                    </div>
                ) : (
                    suggestions.map((item, idx) => (
                        <Card key={idx} className="border-l-4 border-l-orange-400 overflow-hidden shadow-sm">
                            <CardContent className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                                        <span className="text-xs font-bold text-slate-700">{item.issue}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                                        +{item.impactPercentage}% Impact
                                    </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-2 mb-3">
                                    <div className="text-[11px] bg-red-50 text-red-700 p-1.5 rounded line-through opacity-70">
                                        {item.currentText}
                                    </div>
                                    <div className="text-[11px] bg-green-50 text-green-800 p-1.5 rounded flex items-center gap-1 font-medium">
                                        <ArrowUpRight className="w-3 h-3" /> {item.suggestedImprovement}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400">
                                        {getOptimizationImpactLabel(item.impactPercentage)}
                                    </span>
                                    <Button 
                                        size="sm" 
                                        className="h-6 text-[10px] bg-white border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
                                        onClick={() => onApply(idx)}
                                    >
                                        Fix Issue
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

export default EngagementOptimizer;