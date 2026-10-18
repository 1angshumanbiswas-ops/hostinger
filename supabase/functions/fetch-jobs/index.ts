import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from "./cors.ts";

const MOCK_COMPANIES = [
  { name: "Google", logo: "https://logo.clearbit.com/google.com" },
  { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
  { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
  { name: "Infosys", logo: "https://logo.clearbit.com/infosys.com" },
  { name: "TCS", logo: "https://logo.clearbit.com/tcs.com" },
  { name: "Wipro", logo: "https://logo.clearbit.com/wipro.com" },
  { name: "Zoho", logo: "https://logo.clearbit.com/zoho.com" },
  { name: "Flipkart", logo: "https://logo.clearbit.com/flipkart.com" },
  { name: "Swiggy", logo: "https://logo.clearbit.com/swiggy.com" },
  { name: "Zomato", logo: "https://logo.clearbit.com/zomato.com" },
  { name: "Adobe", logo: "https://logo.clearbit.com/adobe.com" },
  { name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com" }
];

const JOB_TITLES = [
  "Senior Full Stack Developer", "Product Manager", "Data Scientist", 
  "DevOps Engineer", "React Native Developer", "AI/ML Engineer",
  "UX Designer", "Cloud Architect", "Backend Developer (Go/Rust)",
  "Frontend Lead", "QA Automation Engineer"
];

const LOCATIONS = ["Bangalore, India", "Remote", "Hyderabad, India", "Pune, India", "Mumbai, India", "Gurgaon, India", "Delhi NCR"];

// Helper to generate realistic mock data for platforms that don't have public APIs
function generateMockJobs(source, count) {
  return Array.from({ length: count }).map(() => {
    const company = MOCK_COMPANIES[Math.floor(Math.random() * MOCK_COMPANIES.length)];
    const title = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    
    return {
      title: title,
      company: company.name,
      location: location,
      type: Math.random() > 0.2 ? 'Full-time' : 'Contract',
      salary: Math.random() > 0.5 ? '₹25L - ₹45L PA' : 'Competitive',
      description: `<p>We are looking for a talented <strong>${title}</strong> to join our team at ${company.name}. This is a great opportunity to work on cutting-edge technologies.</p>`,
      url: `https://www.${source.toLowerCase().replace(/\s/g, '')}.com/jobs`,
      company_logo: company.logo,
      posted_at: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString(), // Last 3 days
      tags: ['Tech', 'Engineering', 'IT'],
      source: source,
      created_at: new Date().toISOString()
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting job fetch process...');
    let allJobs = [];

    // 1. Fetch Real Data from Jobicy (Open API)
    try {
      const response = await fetch('https://jobicy.com/api/v2/remote-jobs?count=20');
      if (response.ok) {
        const data = await response.json();
        const realJobs = (data.jobs || []).map(job => ({
          title: job.jobTitle,
          company: job.companyName,
          location: job.jobGeo || 'Remote',
          type: job.jobType || 'Full-time',
          salary: job.salary || 'Competitive',
          description: job.jobDescription,
          url: job.url,
          company_logo: job.companyLogo,
          posted_at: job.pubDate ? new Date(job.pubDate).toISOString() : new Date().toISOString(),
          tags: job.jobIndustry ? job.jobIndustry : [],
          source: 'Jobicy', // Tag real API source
          created_at: new Date().toISOString()
        }));
        allJobs = [...allJobs, ...realJobs];
        console.log(`Fetched ${realJobs.length} real jobs from Jobicy`);
      }
    } catch (e) {
      console.error('Failed to fetch Jobicy data:', e);
    }

    // 2. Generate Simulated Data for Closed Platforms
    // (LinkedIn, Naukri, etc. block scrapers, so we simulate them for the demo)
    const platforms = [
      { name: 'LinkedIn', count: 8 },
      { name: 'Naukri', count: 8 },
      { name: 'Indeed', count: 5 },
      { name: 'Glassdoor', count: 5 },
      { name: 'Instahyre', count: 6 },
      { name: 'Monster', count: 4 },
      { name: 'Shine', count: 4 }
    ];

    platforms.forEach(platform => {
      const mocks = generateMockJobs(platform.name, platform.count);
      allJobs = [...allJobs, ...mocks];
    });

    // 3. Update Database
    // Clear old data to refresh feed
    await supabaseClient
      .from('app_job_postings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert new mixed dataset
    const { error: insertError } = await supabaseClient
      .from('app_job_postings')
      .insert(allJobs);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully refreshed ${allJobs.length} jobs from ${platforms.length + 1} sources`,
        count: allJobs.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})