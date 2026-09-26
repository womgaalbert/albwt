// Google Business Profile settings — set these in .env.local (and in your host's
// env settings for production). Anything left empty is simply not rendered.
//
//   VITE_GOOGLE_PROFILE_URL   — your Google Maps / Business Profile link
//   VITE_GOOGLE_REVIEW_URL    — "Ask for reviews" link, e.g. https://g.page/r/XXXX/review
//   VITE_GOOGLE_REVIEWS       — "true" to show live reviews (needs the google-reviews
//                               Edge Function deployed with its secrets)
//   VITE_GOOGLE_SITE_VERIFICATION — Search Console token (injected by vite.config.js)

export const GOOGLE_PROFILE_URL = import.meta.env.VITE_GOOGLE_PROFILE_URL || "";
export const GOOGLE_REVIEW_URL = import.meta.env.VITE_GOOGLE_REVIEW_URL || "";
export const GOOGLE_REVIEWS_ENABLED = import.meta.env.VITE_GOOGLE_REVIEWS === "true";
