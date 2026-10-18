import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BrainCircuit, ArrowRight, ShieldAlert, Zap, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useHuggingFaceRecommendations } from '@/hooks/useHuggingFaceRecommendations';
import { useAPIKeyValidation } from '@/hooks/useAPIKeyValidation';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import AIAnalysisTimestamp from './AIAnalysisTimestamp';
import { Button } from '@/components/ui/button';

const RecommendationsPanel = ({ fullPage = false }) => {
  const { recommendations, loading: recsLoading, refresh, triggerAnalysis } = useHuggingFaceRecommendations();
  const { isKeyConfigured, loading: keysLoading } = useAPIKeyValidation();

  const getConfidenceColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRiskBadge = (level) => {
    const variants = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return variants[level?.toLowerCase()] || 'bg-slate-100 text-slate-800';
  };

  const loading = recsLoading || keysLoading;
  const hfConfigured = isKeyConfigured('Hugging Face');

  return (
    <div className="space-y-4">
      {fullPage && <AIAnalysisTimestamp onTrigger={triggerAnalysis} loading={loading} />}
      
      <Card className={fullPage ? 'shadow-none border-none bg-transparent' : 'h-full flex flex-col border-slate-800 bg-slate-900 text-white'}>
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="flex items-center gap-2 text-lg text-slate-100">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            HF AI Insights
          </CardTitle>
          {!fullPage && (
            <button onClick={refresh} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center">
              <Zap className="w-3 h-3 mr-1" /> Refresh
            </button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4 flex-1 overflow-y-auto">
          {!keysLoading && !hfConfigured ? (
             <div className="text-center p-8 border border-dashed border-slate-700 rounded-xl bg-slate-800/50">
               <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4 opacity-80" />
               <h3 className="text-lg font-medium text-slate-200 mb-2">API Key Required</h3>
               <p className="text-sm text-slate-400 mb-6">
                 Please configure Hugging Face API key in Settings to enable AI recommendations.
               </p>
               <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                 <Link to="/trading/settings">
                   <Settings className="w-4 h-4 mr-2" />
                   Go to Settings
                 </Link>
               </Button>
             </div>
          ) : loading && recommendations.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border border-slate-800 rounded-lg space-y-3 bg-slate-800/30">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24 bg-slate-700" />
                    <Skeleton className="h-5 w-16 bg-slate-700" />
                  </div>
                  <Skeleton className="h-4 w-full bg-slate-700" />
                  <Skeleton className="h-4 w-2/3 bg-slate-700" />
                  <Skeleton className="h-8 w-full mt-2 bg-slate-700" />
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center p-8 text-slate-400 border border-dashed border-slate-700 rounded-lg bg-slate-800/30">
              No recommendations available. Run analysis to generate insights.
            </div>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.id} className="p-4 border border-slate-700 rounded-xl bg-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                {rec.confidence_score >= 80 && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-green-500 transform rotate-45 translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform"></div>
                )}
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                      {rec.asset_type?.toUpperCase() || 'ASSET'}
                      {rec.confidence_score >= 80 && <Zap className="w-4 h-4 text-amber-400 fill-current" />}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-slate-600 text-slate-300">{rec.asset_type}</Badge>
                      <Badge className={`text-[10px] uppercase shadow-none border-none ${getRiskBadge(rec.risk_level)}`}>
                        {rec.risk_level || 'Unknown'} Risk
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-2xl font-black tabular-nums text-slate-200">{rec.confidence_score}%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Confidence</span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-300 mb-4 bg-slate-900/50 p-3 rounded-lg border border-slate-700 leading-relaxed">
                  {rec.reasoning}
                </p>
                
                <div className="space-y-2 mb-4">
                  <Progress value={rec.confidence_score} className="h-1.5 bg-slate-700" indicatorClassName={getConfidenceColor(rec.confidence_score)} />
                </div>

                {(rec.entry_price || rec.target_price) && (
                  <div className="flex justify-between items-center text-sm font-medium bg-slate-950 text-slate-300 p-3 rounded-lg shadow-inner border border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase">Entry Zone</span>
                      <span>${rec.entry_price || '---'}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600" />
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-emerald-500 uppercase">Target Price</span>
                      <span className="text-emerald-400">${rec.target_price || '---'}</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-3 text-right">
                  <span className="text-[10px] text-slate-500">Analyzed: {new Date(rec.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsPanel;