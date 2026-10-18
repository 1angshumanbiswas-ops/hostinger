import { useState, useEffect } from 'react';

// Helper functions as requested
const normalizeText = (text) => {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9\s.-]/g, ' ').replace(/\s+/g, ' ').trim();
};

// Expanded dictionary for realistic matching
const KEYWORD_DICTIONARY = [
  'python', 'java', 'javascript', 'react', 'node.js', 'node', 'sql', 'aws', 'docker', 'kubernetes',
  'project management', 'leadership', 'communication', 'agile', 'scrum', 'html', 'css', 'typescript',
  'c++', 'c#', 'ruby', 'php', 'swift', 'go', 'rust', 'git', 'ci/cd', 'machine learning', 'ai', 'data analysis',
  'marketing', 'sales', 'seo', 'design', 'figma', 'ui/ux', 'problem solving', 'teamwork', 'cloud', 'azure', 'gcp'
];

const extractKeywords = (text) => {
  if (!text) return [];
  const normalized = normalizeText(text);
  const found = KEYWORD_DICTIONARY.filter(kw => {
    // Basic word boundary check or exact string match
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(normalized);
  });
  
  // Fallback: extract > 4 letter words as potential keywords if dictionary misses
  const words = normalized.split(' ').filter(w => w.length > 4 && !KEYWORD_DICTIONARY.includes(w));
  const stopWords = new Set(['about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'considering', 'despite', 'down', 'during', 'except', 'from', 'inside', 'into', 'like', 'near', 'outside', 'over', 'past', 'regarding', 'round', 'since', 'through', 'throughout', 'toward', 'under', 'underneath', 'until', 'unto', 'upon', 'with', 'within', 'without']);
  const extraWords = [...new Set(words.filter(w => !stopWords.has(w)))].slice(0, 10); // Take up to 10 extra

  return [...new Set([...found, ...extraWords])];
};

const calculateMatchPercentage = (cvKeywords, jdKeywords) => {
  if (!jdKeywords || jdKeywords.length === 0) return 0;
  const matchCount = jdKeywords.filter(kw => cvKeywords.includes(kw)).length;
  return (matchCount / jdKeywords.length) * 100;
};

export function useATSAnalysis(cvText, jobDescriptionText) {
  const [state, setState] = useState({
    score: 0,
    matchedKeywords: [],
    missingKeywords: [],
    analysis: '',
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!cvText || !jobDescriptionText) {
      setState({
        score: 0,
        matchedKeywords: [],
        missingKeywords: [],
        analysis: 'Missing data to perform analysis.',
        isLoading: false,
        error: null
      });
      return;
    }

    let isMounted = true;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Simulate slight processing delay for realistic feel
    const timer = setTimeout(() => {
      try {
        const cvKeywords = extractKeywords(cvText);
        const jdKeywords = extractKeywords(jobDescriptionText);

        if (jdKeywords.length === 0) {
          if (isMounted) setState({ 
            score: 0, 
            matchedKeywords: [], 
            missingKeywords: [], 
            analysis: 'No recognizable keywords found in Job Description.',
            isLoading: false, 
            error: null 
          });
          return;
        }

        const matched = jdKeywords.filter(kw => cvKeywords.includes(kw));
        const missing = jdKeywords.filter(kw => !cvKeywords.includes(kw));
        
        let rawScore = calculateMatchPercentage(cvKeywords, jdKeywords);
        
        // Base score rules
        let finalScore = Math.round(rawScore);
        if (matched.length > 0 && finalScore < 10) finalScore = 10; // Min 10% if any match
        if (matched.length === jdKeywords.length) finalScore = 100; // Max 100% perfect match

        let analysisText = `We found ${matched.length} out of ${jdKeywords.length} key requirements.`;

        if (isMounted) {
          setState({
            score: finalScore,
            matchedKeywords: matched,
            missingKeywords: missing,
            analysis: analysisText,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setState(prev => ({ ...prev, isLoading: false, error: err.message }));
        }
      }
    }, 800);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [cvText, jobDescriptionText]);

  return state;
}