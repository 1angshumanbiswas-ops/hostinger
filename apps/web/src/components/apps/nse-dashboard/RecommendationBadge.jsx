import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function RecommendationBadge({ recommendation }) {
  let badgeClasses = "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  
  if (recommendation?.toUpperCase() === 'BUY') {
    badgeClasses = "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
  } else if (recommendation?.toUpperCase() === 'SELL') {
    badgeClasses = "bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
  } else if (recommendation?.toUpperCase() === 'HOLD') {
    badgeClasses = "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
  }

  return (
    <Badge className={`font-semibold shadow-none border ${badgeClasses}`}>
      {recommendation || 'N/A'}
    </Badge>
  );
}