import { useState, useEffect } from 'react';
import { analyzeEngagement } from '@/utils/aiEngagementOptimizer';

export const useEngagementOptimization = (copy, platform) => {
  const [analysis, setAnalysis] = useState({
    currentScore: 0,
    suggestions: [],
    potentialScore: 0,
    breakdown: {}
  });

  useEffect(() => {
    // For YouTube, copy might be an object { title, description } or string
    // analyzeEngagement needs to handle this
    const result = analyzeEngagement(copy, platform);
    setAnalysis(result);
  }, [copy, platform]);

  const applyOptimization = (index, onApplyCallback) => {
    const suggestion = analysis.suggestions[index];
    if (suggestion && onApplyCallback) {
        // Naive application logic
        let newText = copy;
        
        // Handle YouTube object
        if (platform === 'youtube' && typeof copy === 'object') {
             // If suggestion targets title, update title, etc.
             // For demo simplicity, we append to description
             newText = { 
                 ...copy, 
                 description: copy.description + `\n\n(Optimized: ${suggestion.suggestedImprovement})` 
             };
        } else {
            newText = copy + `\n\n(Optimized: ${suggestion.suggestedImprovement})`; 
        }
        
        onApplyCallback(newText);
    }
  };

  const applyAllOptimizations = (onApplyCallback) => {
      // Demo implementation
      let newText = copy;
       if (platform === 'youtube' && typeof copy === 'object') {
           newText = { ...copy, description: copy.description + "\n\n[All Optimizations Applied]" };
       } else {
           newText = copy + "\n\n[All Optimizations Applied]";
       }
      if (onApplyCallback) onApplyCallback(newText);
  };

  return {
    currentScore: analysis.currentScore,
    suggestions: analysis.suggestions,
    potentialScore: analysis.potentialScore,
    applyOptimization,
    applyAllOptimizations,
    breakdown: analysis.breakdown
  };
};