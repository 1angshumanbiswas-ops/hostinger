export const analyzeEngagement = (copyInput, platform) => {
  const scoreBreakdown = {};
  const suggestions = [];
  
  // Normalize input
  let text = "";
  let title = ""; // For YT
  if (typeof copyInput === 'string') {
      text = copyInput.toLowerCase();
  } else if (copyInput && typeof copyInput === 'object') {
      text = (copyInput.description || "").toLowerCase();
      title = (copyInput.title || "").toLowerCase();
  }

  // --- TWITTER SCORING ---
  if (platform === 'twitter') {
      // Hashtag usage (15pts)
      const hashtagCount = (text.match(/#/g) || []).length;
      if (hashtagCount >= 2) scoreBreakdown.hashtags = 15;
      else suggestions.push({ category: "Hashtags", issue: "Low visibility", suggestedImprovement: "Add 2-3 relevant hashtags.", impactPercentage: 15 });
      
      // Character Efficiency (20pts) - sweet spot 100-250 chars
      if (text.length > 50 && text.length < 260) scoreBreakdown.efficiency = 20;
      else suggestions.push({ category: "Length", issue: "Optimal length", suggestedImprovement: "Keep tweets between 50-260 chars.", impactPercentage: 20 });
      
      // CTA Strength (20pts)
      if (text.includes("link") || text.includes("click") || text.includes("apply")) scoreBreakdown.cta = 20;
      else suggestions.push({ category: "CTA", issue: "No action", suggestedImprovement: "Add 'Click link' or 'Apply'.", impactPercentage: 20 });

      // Engagement Hooks (20pts) - questions?
      if (text.includes("?")) scoreBreakdown.hooks = 20;
      else suggestions.push({ category: "Engagement", issue: "No question", suggestedImprovement: "Ask a question to prompt replies.", impactPercentage: 20 });
      
      // Mention Strategy (15pts)
      if (text.includes("@")) scoreBreakdown.mentions = 15;
      else scoreBreakdown.mentions = 5; // Optional
      
      // Trending Language (10pts)
      if (text.includes("🔥") || text.includes("🚀") || text.includes("alert")) scoreBreakdown.trending = 10;
      else scoreBreakdown.trending = 0;

  } 
  // --- SNAPCHAT SCORING ---
  else if (platform === 'snapchat') {
      // Emoji Usage (15pts)
      if ((text.match(/[\u{1F300}-\u{1F9FF}]/u) || []).length > 0) scoreBreakdown.emojis = 15;
      else suggestions.push({ category: "Visuals", issue: "No emojis", suggestedImprovement: "Add fun emojis!", impactPercentage: 15 });

      // Urgency/FOMO (20pts)
      if (text.includes("now") || text.includes("hours") || text.includes("fast")) scoreBreakdown.fomo = 20;
      else suggestions.push({ category: "Urgency", issue: "Low urgency", suggestedImprovement: "Create FOMO (e.g., '24h left').", impactPercentage: 20 });
      
      // Trendy Language (20pts)
      if (text.length < 100) scoreBreakdown.trendy = 20; // Short is trendy
      else suggestions.push({ category: "Length", issue: "Too long", suggestedImprovement: "Keep it under 100 chars for Snaps.", impactPercentage: 20 });
      
      // CTA Clarity (20pts)
      if (text.includes("swipe")) scoreBreakdown.cta = 20;
      else suggestions.push({ category: "CTA", issue: "Wrong CTA", suggestedImprovement: "Use 'Swipe Up'.", impactPercentage: 20 });
      
      // Fun Factor (15pts)
      scoreBreakdown.fun = 15; // Assume user is fun for now
      
      // Story Potential (10pts)
      scoreBreakdown.story = 10;
  }
  // --- YOUTUBE SCORING ---
  else if (platform === 'youtube') {
      // Title Clickability (20pts)
      if (title.length > 10 && (title.includes("how") || title.includes("hiring") || title.includes("job"))) scoreBreakdown.title = 20;
      else suggestions.push({ category: "Title", issue: "Weak title", suggestedImprovement: "Use 'Hiring', 'Job', or 'How to' in title.", impactPercentage: 20 });
      
      // SEO Optimization (20pts) - keywords in desc
      if (text.includes("career") && text.includes("salary")) scoreBreakdown.seo = 20;
      else suggestions.push({ category: "SEO", issue: "Missing keywords", suggestedImprovement: "Include 'Career' and 'Salary' in description.", impactPercentage: 20 });
      
      // Description Completeness (20pts)
      if (text.length > 100) scoreBreakdown.desc = 20;
      else suggestions.push({ category: "Description", issue: "Too short", suggestedImprovement: "Write a detailed description (>100 chars).", impactPercentage: 20 });
      
      // CTA Strength (15pts)
      if (text.includes("link") || text.includes("subscribe")) scoreBreakdown.cta = 15;
      else suggestions.push({ category: "CTA", issue: "No CTA", suggestedImprovement: "Ask to Subscribe or Click Link.", impactPercentage: 15 });
      
      // Keywords (15pts)
      scoreBreakdown.keywords = 15;
      
      // Hashtag Optimization (10pts)
      if (text.includes("#")) scoreBreakdown.hashtags = 10;
      else suggestions.push({ category: "Tags", issue: "No hashtags", suggestedImprovement: "Add hashtags to description.", impactPercentage: 10 });
  }
  // --- GENERIC ---
  else {
      // Default basic scoring (simplified from previous task)
      scoreBreakdown.basic = 50; 
      suggestions.push({ category: "General", issue: "Generic analysis", suggestedImprovement: "Check platform specifics.", impactPercentage: 10 });
  }

  const currentScore = Object.values(scoreBreakdown).reduce((a, b) => a + b, 0);
  const potentialScore = Math.min(100, currentScore + suggestions.reduce((a, b) => a + b.impactPercentage, 0));

  return {
    currentScore,
    suggestions: suggestions.slice(0, 3),
    potentialScore,
    breakdown: scoreBreakdown
  };
};