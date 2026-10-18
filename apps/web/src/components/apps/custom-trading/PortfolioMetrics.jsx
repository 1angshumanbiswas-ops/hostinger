import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, Briefcase, Zap, Percent } from 'lucide-react';

const MetricItem = ({ icon: Icon, label, value, subtext, colorClass = "text-indigo-600", bgClass = "bg-indigo-50" }) => (
  <Card className="shadow-sm border-slate-100">
    <CardContent className="p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h4 className="text-xl font-bold text-slate-800">{value}</h4>
        {subtext && <p className="text-xs text-slate-400 mt-0.5">{subtext}</p>}
      </div>
    </CardContent>
  </Card>
);

const PortfolioMetrics = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricItem 
        icon={Target} label="Win Rate" 
        value={`${metrics.winRate.toFixed(1)}%`} 
        subtext={`${metrics.totalTrades} total trades`}
        colorClass="text-blue-600" bgClass="bg-blue-50"
      />
      <MetricItem 
        icon={TrendingUp} label="Best Trade" 
        value={`$${metrics.bestTrade.toFixed(2)}`} 
        subtext={`Avg Win: $${metrics.avgWin.toFixed(2)}`}
        colorClass="text-emerald-600" bgClass="bg-emerald-50"
      />
      <MetricItem 
        icon={TrendingDown} label="Worst Trade" 
        value={`$${metrics.worstTrade.toFixed(2)}`} 
        subtext={`Avg Loss: $${metrics.avgLoss.toFixed(2)}`}
        colorClass="text-red-600" bgClass="bg-red-50"
      />
      <MetricItem 
        icon={Activity} label="Profit Factor" 
        value={metrics.profitFactor.toFixed(2)} 
        subtext="Gross Win / Gross Loss"
        colorClass="text-purple-600" bgClass="bg-purple-50"
      />
      <MetricItem 
        icon={Briefcase} label="Margin Used" 
        value={`$${metrics.marginUsed.toFixed(2)}`} 
        subtext="Currently locked"
        colorClass="text-orange-600" bgClass="bg-orange-50"
      />
      <MetricItem 
        icon={DollarSign} label="Available Margin" 
        value={`$${metrics.availableMargin.toFixed(2)}`} 
        colorClass="text-teal-600" bgClass="bg-teal-50"
      />
      <MetricItem 
        icon={Percent} label="Margin Util." 
        value={`${metrics.marginUtilization.toFixed(1)}%`} 
        subtext="Of total equity"
        colorClass="text-pink-600" bgClass="bg-pink-50"
      />
      <MetricItem 
        icon={Zap} label="Max Leverage" 
        value={`1:${metrics.maxLeverage}`} 
        subtext="Peak utilization"
        colorClass="text-amber-600" bgClass="bg-amber-50"
      />
    </div>
  );
};

export default PortfolioMetrics;