// Google Reviews proxy — Google Places API (New) on Supabase Edge Functions (Deno).
//
// Returns the Business Profile's rating, review count and up to 5 reviews so the
// site can display them without exposing the API key to the browser.
//
// Secrets (supabase secrets set):
//   GOOGLE_PLACES_API_KEY — Google Cloud key with "Places API (New)" enabled
//   GOOGLE_PLACE_ID       — your Business Profile's Place ID
//                           (find it: https://developers.google.com/maps/documentation/places/web-service/place-id)
//
// Responses are cached in memory per language for CACHE_TTL_HOURS, which keeps
// Places API usage (and cost) negligible.

const API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY") || "";
const PLACE_ID = Deno.env.get("GOOGLE_PLACE_ID") || "";

const CACHE_TTL_HOURS = 6;
const FIELD_MASK = "rating,userRatingCount,googleMapsUri,googleMapsLinks,reviews";

const ALLOWED_ORIGINS = new Set([
  "https://albwt.com",
  "https://www.albwt.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const cache = new Map<string, { at: number; data: unknown }>();

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : null;
  return {
    "Access-Control-Allow-Origin": allowed ?? "https://albwt.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

async function fetchPlace(lang: string) {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}?languageCode=${lang}`,
    { headers: { "X-Goog-Api-Key": API_KEY, "X-Goog-FieldMask": FIELD_MASK } },
  );
  if (!res.ok) throw new Error(`places ${res.status}: ${await res.text()}`);
  const p = await res.json();
  return {
    rating: p.rating ?? null,
    count: p.userRatingCount ?? 0,
    mapsUri: p.googleMapsUri ?? null,
    writeReviewUri: p.googleMapsLinks?.writeAReviewUri ?? null,
    reviews: (p.reviews ?? []).map((r: any) => ({
      author: r.authorAttribution?.displayName ?? "Google user",
      authorUri: r.authorAttribution?.uri ?? null,
      photoUri: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? 0,
      text: r.text?.text ?? r.originalText?.text ?? "",
      relativeTime: r.relativePublishTimeDescription ?? "",
      uri: r.googleMapsUri ?? null,
    })),
  };
}

Deno.serve({ port: Number(Deno.env.get("SERVE_PORT") || 8000) }, async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);
  if (!API_KEY || !PLACE_ID) return json({ error: "not_configured" }, 503, origin);

  let lang = "en";
  try {
    const body = await req.json();
    if (body?.lang === "fr") lang = "fr";
  } catch {
    // empty body → default language
  }

  const hit = cache.get(lang);
  if (hit && Date.now() - hit.at < CACHE_TTL_HOURS * 3600_000) return json(hit.data, 200, origin);

  try {
    const data = await fetchPlace(lang);
    cache.set(lang, { at: Date.now(), data });
    return json(data, 200, origin);
  } catch (err) {
    console.error(err);
    // Serve stale data rather than failing if Google is briefly unavailable.
    if (hit) return json(hit.data, 200, origin);
    return json({ error: "upstream_failed" }, 502, origin);
  }
});
