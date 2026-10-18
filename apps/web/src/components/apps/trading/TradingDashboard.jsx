import React, { useState } from 'react';
import MarketDataDashboard from './MarketDataDashboard';
import RecommendationsPanel from './RecommendationsPanel';
import AIAnalysisTimestamp from './AIAnalysisTimestamp';
import { useHuggingFaceRecommendations } from '@/hooks/useHuggingFaceRecommendations';

const TradingDashboard = () => {
  const { loading, triggerAnalysis } = useHuggingFaceRecommendations();

  return (
    <div className="space-y-6">
      <AIAnalysisTimestamp onTrigger={triggerAnalysis} loading={loading} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <MarketDataDashboard />
        </div>
        <div className="xl:col-span-1">
          <RecommendationsPanel fullPage={false} />
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;