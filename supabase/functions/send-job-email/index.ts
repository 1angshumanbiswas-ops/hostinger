import { corsHeaders } from "./cors.ts";

const RESEND_API_KEY = "re_123456789"; // Simulation Key - In prod use Deno.env.get('RESEND_API_KEY')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { jobTitle, company, location, jobLink, userEmail, aiReasoning } = await req.json();

    // In a real environment, this would call Resend or SendGrid API
    // For this environment, we simulate a successful email send
    
    console.log(`Sending email to ${userEmail} for ${jobTitle} at ${company}`);

    // Simulation of API Call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email sent to ${userEmail}`,
        id: `email_${Date.now()}`
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    )
  }
})