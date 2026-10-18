import { useState, useEffect } from 'react';

export function useFitmentAnalysis(cvContent, jobDescription) {
  const [state, setState] = useState({
    fitmentScore: 0,
    fitmentReasons: [],
    improvementSuggestions: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!cvContent || !jobDescription) {
      setState({
        fitmentScore: 0,
        fitmentReasons: [],
        improvementSuggestions: [],
        isLoading: false,
        error: null
      });
      return;
    }

    let isMounted = true;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const timer = setTimeout(() => {
      try {
        const cv = cvContent.toLowerCase();
        const jd = jobDescription.toLowerCase();

        const commonSkills = ['react', 'node', 'javascript', 'python', 'java', 'sql', 'aws', 'docker', 'kubernetes', 'agile', 'scrum', 'leadership', 'communication', 'management', 'marketing', 'sales', 'design', 'figma', 'typescript', 'c++', 'go', 'rust', 'ci/cd', 'machine learning', 'ai'];
        const commonQualifications = ['bachelor', 'master', 'phd', 'degree', 'certification', 'pmp', 'cpa', 'mba', 'aws certified'];
        const commonExperience = ['years', 'experience', 'senior', 'junior', 'lead', 'manager', 'director', 'executive', 'architect'];

        const extractMatches = (dictionary) => {
          return dictionary.filter(term => jd.includes(term) && cv.includes(term));
        };

        const calculateFrequency = (text, term) => {
          const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
          const matches = text.match(regex);
          return matches ? matches.length : (text.includes(term) ? 1 : 0);
        };

        const matchingSkills = extractMatches(commonSkills);
        const matchingQuals = extractMatches(commonQualifications);
        const matchingExp = extractMatches(commonExperience);

        const reasons = [];

        if (matchingSkills.length > 0) {
          reasons.push({
            category: 'Key Skills',
            items: matchingSkills.map(s => `Found matching skill: ${s.charAt(0).toUpperCase() + s.slice(1)}`)
          });
        } else {
          reasons.push({ category: 'Key Skills', items: ['Analyzed general technical/soft skills alignment.'] });
        }

        if (matchingExp.length > 0) {
          reasons.push({
            category: 'Experience Alignment',
            items: matchingExp.map(e => `Matches experience requirement related to: "${e}"`)
          });
        } else {
          reasons.push({ category: 'Experience Alignment', items: ['Experience level appears relevant to the role.'] });
        }

        if (matchingQuals.length > 0) {
          reasons.push({
            category: 'Qualifications',
            items: matchingQuals.map(q => `Meets educational/certification criteria: ${q.charAt(0).toUpperCase() + q.slice(1)}`)
          });
        } else {
           reasons.push({ category: 'Qualifications', items: ['Standard qualification check passed.'] });
        }
        
        // Generate Improvement Suggestions
        const suggestions = [];
        let idCounter = 1;

        const processMissing = (dictionary, categoryLabel, reasonText) => {
          dictionary.forEach(term => {
            const freq = calculateFrequency(jd, term);
            if (freq > 0 && !cv.includes(term)) {
              let priority = 'medium';
              if (freq >= 3) priority = 'critical';
              else if (freq === 2) priority = 'high';

              suggestions.push({
                id: idCounter++,
                category: categoryLabel,
                suggestion: `Add "${term.charAt(0).toUpperCase() + term.slice(1)}" to your resume.`,
                priority,
                reason: reasonText,
                frequency: freq
              });
            }
          });
        };

        processMissing(commonSkills, 'Skills', 'Core competency required for the role.');
        processMissing(commonExperience, 'Experience', 'Aligns your background with the seniority expected.');
        processMissing(commonQualifications, 'Qualifications', 'Fulfills basic educational or certification requirements.');

        // Sort: Critical > High > Medium, then by frequency descending
        const priorityWeight = { critical: 3, high: 2, medium: 1 };
        suggestions.sort((a, b) => {
          if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
            return priorityWeight[b.priority] - priorityWeight[a.priority];
          }
          return b.frequency - a.frequency;
        });

        const overallScore = Math.min(100, Math.round(((matchingSkills.length + matchingQuals.length + matchingExp.length) / 10) * 100) + 40);

        if (isMounted) {
          setState({
            fitmentScore: overallScore,
            fitmentReasons: reasons,
            improvementSuggestions: suggestions,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setState(prev => ({ ...prev, isLoading: false, error: err.message }));
        }
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [cvContent, jobDescription]);

  return state;
}