import React from 'react';
import { ShieldCheck, AlertTriangle, MinusCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function RecommendationBadgeForBSE({ recommendation, confidence, rationale }) {
  const isBuy = recommendation?.toUpperCase() === 'BUY';
  const isSell = recommendation?.toUpperCase() === 'SELL';
  const isHold = recommendation?.toUpperCase() === 'HOLD';

  let config = {
    colorClass: 'bg-muted text-muted-foreground border-muted',
    icon: MinusCircle,
    label: 'UNKNOWN'
  };

  if (isBuy) {
    config = {
      colorClass: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
      icon: ShieldCheck,
      label: 'BUY'
    };
  } else if (isSell) {
    config = {
      colorClass: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
      icon: AlertTriangle,
      label: 'SELL'
    };
  } else if (isHold) {
    config = {
      colorClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
      icon: MinusCircle,
      label: 'HOLD'
    };
  }

  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.colorClass} cursor-help transition-colors hover:bg-opacity-20`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{config.label}</span>
            <span className="opacity-70 ml-1 font-medium">{confidence}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 space-y-1.5 shadow-xl border-border">
          <p className="font-semibold text-sm flex items-center gap-2">
            AI Signal: {config.label} ({confidence}% confidence)
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {rationale || 'AI models suggest this action based on current technical indicators and market sentiment.'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}