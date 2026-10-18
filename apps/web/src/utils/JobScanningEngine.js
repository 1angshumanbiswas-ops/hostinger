import { supabase } from '@/lib/customSupabaseClient';

/**
 * Simulates fetching jobs from external APIs (Indeed, LinkedIn, JSearch).
 * In a production environment, this would call the 'scan-jobs' edge function.
 */
export const scanForJobs = async (criteria = {}) => {
  try {
    // Attempt to call Edge Function first
    const { data: edgeData, error: edgeError } = await supabase.functions.invoke('scan-jobs', {
      body: criteria
    });

    if (!edgeError && edgeData?.jobs) {
      return edgeData.jobs;
    }

    console.warn("Edge function failed or not deployed, falling back to simulation.", edgeError);

    // Updated roles list with requested additions
    const defaultTitles = [
      "Program Manager",
      "Delivery Manager",
      "Project Manager",
      "Scrum Master",
      "Senior Program Manager", 
      "Technical Project Manager", 
      "Delivery Lead",
      "Director of Engineering", 
      "Product Owner", 
      "AI Solutions Architect",
      "Senior AI Automation Engineer",
      "Lead React/Node.js Developer",
      "Cloud Data Architect (AWS/Azure)"
    ];
    
    // Use criteria roles if provided, otherwise default
    const titles = criteria.roles && criteria.roles.length > 0 ? criteria.roles : defaultTitles;

    const companies = [
      "TechCorp Global", "Innovate AI", "Future Systems", "DataFlow Inc",
      "CloudNine Solutions", "NextGen Dynamics", "Global Connect"
    ];
    const locations = ["Remote", "Hybrid - New York", "London, UK", "Bangalore, India", "Austin, TX"];
    
    // Generate 4-6 random jobs to ensure variety
    const count = Math.floor(Math.random() * 3) + 4;
    const newJobs = [];

    for (let i = 0; i < count; i++) {
      const title = titles[Math.floor(Math.random() * titles.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      
      newJobs.push({
        id: `job-${Date.now()}-${i}`,
        title: title,
        company: company,
        location: locations[Math.floor(Math.random() * locations.length)],
        type: "Full-time",
        description: `We are looking for a ${title} to join our team at ${company}. Experience in Agile, Cloud, and AI is a plus.`,
        salary: "$120k - $220k",
        source: Math.random() > 0.5 ? "LinkedIn" : "Indeed",
        url: "#",
        posted_at: new Date().toISOString()
      });
    }

    return newJobs;
  } catch (error) {
    console.error("Scanning Engine Error:", error);
    return [];
  }
};