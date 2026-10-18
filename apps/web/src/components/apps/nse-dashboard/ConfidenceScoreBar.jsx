import React from 'react';
import { Progress } from '@/components/ui/progress';

export default function ConfidenceScoreBar({ score }) {
  // Determine color based on score threshold
  let barColorClass = "bg-slate-400";
  if (score >= 70) barColorClass = "bg-emerald-500";
  else if (score <= 40) barColorClass = "bg-rose-500";
  else barColorClass = "bg-amber-500";

  return (
    <div className="flex items-center gap-2">
      <Progress value={score} className={`h-2 w-full`} indicatorClassName={barColorClass} />
      <span className="text-xs font-medium min-w-[3ch]">{score}%</span>
    </div>
  );
}