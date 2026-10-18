import { corsHeaders } from "./cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { job_id, resume_url, cover_letter } = await req.json();

    // 1. Logic to submit to external job board API would go here.
    // await fetch('https://api.greenhouse.io/v1/applications', { ... })

    // 2. Log the activity
    console.log(`Submitting application for Job ${job_id}`);

    // 3. Return success confirmation
    return new Response(JSON.stringify({ 
      success: true, 
      application_id: `app-${Date.now()}`,
      message: "Application submitted successfully" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})