import { useState, useEffect, useCallback } from 'react';
import { generateCopySuggestions } from '@/utils/aiCopySuggestions';

export const useAICopySuggestions = (platform, currentCopy, jobDetails) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(null); 

  const regenerateSuggestions = useCallback(async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Pass platform-specific logic inside generateCopySuggestions or split here
    // For simplicity, we update generateCopySuggestions in utils/aiCopySuggestions.js 
    // BUT since I need to modify that util anyway, I will inline logic or update util.
    // The prompt says "Update useAICopySuggestions.js hook to generate...".
    // I will actually implement the logic here or call a more robust utility.
    // Given the constraints, I will update the utility in a separate block if needed, 
    // but the task says "Update useAICopySuggestions.js hook... Each platform returns 5 angle suggestions".
    // I'll put the generator logic in the util file for cleaner code, but trigger it here.
    
    const newSuggestions = generateCopySuggestions(platform, currentCopy, jobDetails);
    setSuggestions(newSuggestions);
    setIsLoading(false);
    setCurrentSuggestionIndex(null); 
  }, [platform, currentCopy, jobDetails]);

  // Regenerate when platform changes
  useEffect(() => {
    regenerateSuggestions();
  }, [platform]);

  const applySuggestion = (index, onApplyCallback) => {
    if (suggestions[index]) {
      setCurrentSuggestionIndex(index);
      if (onApplyCallback) {
        onApplyCallback(suggestions[index].suggestedCopy, suggestions[index]);
      }
    }
  };

  return {
    suggestions,
    isLoading,
    applySuggestion,
    currentSuggestionIndex,
    regenerateSuggestions
  };
};