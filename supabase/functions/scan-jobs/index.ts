import { corsHeaders } from "./cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { keywords, location } = await req.json();

    // In a real implementation, you would make fetch calls to external APIs here.
    // Example: Indeed, LinkedIn, Google Jobs API
    // const response = await fetch(`https://api.jsearch.com/search?query=${keywords}...`);

    // For this environment, we return simulated data to demonstrate the structure
    // This allows the frontend to work immediately without paid API keys.
    const mockJobs = [
      {
        id: `job-${Date.now()}-1`,
        title: "Senior AI Engineer",
        company: "TechFlow Systems",
        location: location || "Remote",
        type: "Full-time",
        source: "LinkedIn",
        salary: "$140k - $190k",
        description: "Leading AI initiatives using Python, TensorFlow, and AWS.",
        posted_at: new Date().toISOString()
      },
      {
        id: `job-${Date.now()}-2`,
        title: "Product Manager",
        company: "Global Innovate",
        location: "Hybrid",
        type: "Contract",
        source: "Indeed",
        salary: "$120k - $160k",
        description: "Looking for an experienced PM to manage roadmap.",
        posted_at: new Date().toISOString()
      }
    ];

    return new Response(JSON.stringify({ jobs: mockJobs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})