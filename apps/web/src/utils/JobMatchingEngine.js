/**
 * Analyzes a job against a user profile to determine a match score.
 */
export const analyzeMatch = (job, profile) => {
  const jobText = (job.title + " " + job.description).toLowerCase();
  const profileText = JSON.stringify(profile).toLowerCase();
  
  let score = 0;
  let matches = [];
  let missing = [];
  let reasoning = [];

  // 1. Role Match (30%) - Updated with new target roles for alignment
  const targetRoles = [
    "Program Manager", 
    "Delivery Manager", 
    "Project Manager", 
    "Scrum Master",
    "Delivery Lead", 
    "Director", 
    "Lead", 
    "AI Automation Engineer", 
    "Developer", 
    "Architect",
    "Technical Project Manager"
  ];
  
  const isRoleMatch = targetRoles.some(role => job.title.toLowerCase().includes(role.toLowerCase()));
  
  if (isRoleMatch) {
    score += 30;
    reasoning.push("Strong alignment with target job titles.");
  } else {
    reasoning.push("Job title is loosely aligned with core profile.");
  }

  // 2. Skill Keyword Match (40%)
  const keySkills = [
    "agile", "scrum", "cloud", "aws", "azure", "python", "data", "analytics", 
    "stakeholder", "leadership", "program management", "delivery", "ai", "react", "node.js", "automation", "project management"
  ];
  
  let skillCount = 0;
  keySkills.forEach(skill => {
    if (jobText.includes(skill)) {
      matches.push(skill);
      skillCount++;
      // Check if user actually has this skill in profile
      if (profileText.includes(skill)) {
        score += 4; // Max 40 points roughly
      } else {
        missing.push(skill);
      }
    }
  });

  // Cap skill score
  score = Math.min(score + (skillCount * 2), 70); 

  // 3. Location/Type Preference (15%)
  if (job.location.toLowerCase().includes("remote")) {
    score += 15;
    reasoning.push("Matches remote work preference.");
  }

  // 4. Seniority (15%)
  if (job.title.toLowerCase().includes("senior") || job.title.toLowerCase().includes("lead") || job.title.toLowerCase().includes("director") || job.title.toLowerCase().includes("architect")) {
    score += 15;
    reasoning.push("Matches seniority level (Senior/Lead/Architect).");
  }

  // Normalize Score
  const finalScore = Math.min(Math.round(score), 100);

  // Confidence Level
  let confidence = "Low";
  if (finalScore > 80) confidence = "High";
  else if (finalScore > 50) confidence = "Medium";

  return {
    score: finalScore,
    confidence,
    matchedSkills: matches,
    missingSkills: missing,
    reasoning: reasoning.join(" ")
  };
};