import { corsHeaders } from "./cors.ts";

const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchQuery } = await req.json();
    const unsplashKey = Deno.env.get('UNSPLASH_ACCESS_KEY');

    // If no key is configured, return a random fallback
    if (!unsplashKey) {
      console.log("No Unsplash key found, returning fallback.");
      const randomFallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      return new Response(JSON.stringify({
        imageUrl: randomFallback,
        photographer: "Unsplash",
        source: "Unsplash",
        imageId: "fallback-" + Date.now()
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const query = searchQuery || "office work team";
    const response = await fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&orientation=landscape`, {
      headers: {
        'Authorization': `Client-ID ${unsplashKey}`
      }
    });

    if (!response.ok) {
       console.error("Unsplash API Error", response.status, response.statusText);
       throw new Error("Failed to fetch from Unsplash");
    }

    const data = await response.json();
    
    const result = {
      imageUrl: data.urls.regular,
      photographer: data.user.name,
      source: "Unsplash",
      imageId: data.id
    };

    return new Response(JSON.stringify(result), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error("Edge Function Error:", error);
    // Return fallback on error
    const randomFallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    return new Response(JSON.stringify({
       imageUrl: randomFallback,
       photographer: "Unsplash",
       source: "Unsplash",
       imageId: "fallback-error-" + Date.now()
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});