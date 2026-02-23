import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface GeoRequest {
  id: string;
  lat: number;
  lng: number;
}

interface GeoResult {
  id: string;
  city: string | null;
}

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'GetPlace-DataEnrichment/1.0' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address;
    // Try city, town, village, hamlet, county in order
    return addr?.city || addr?.town || addr?.village || addr?.hamlet || addr?.suburb || addr?.county || null;
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { points } = await req.json() as { points: GeoRequest[] };

    if (!points || !Array.isArray(points) || points.length === 0) {
      return new Response(JSON.stringify({ error: 'No points provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Limit batch size to 10 to respect Nominatim rate limits (1 req/sec)
    const batch = points.slice(0, 10);
    const results: GeoResult[] = [];

    for (const point of batch) {
      const city = await reverseGeocode(point.lat, point.lng);
      results.push({ id: point.id, city });
      // Respect Nominatim's 1 req/sec rate limit
      if (batch.indexOf(point) < batch.length - 1) {
        await new Promise(r => setTimeout(r, 1100));
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
