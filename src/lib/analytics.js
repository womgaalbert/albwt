/**
 * GA4 analytics — lazy-loaded, zero-dependency, no-op until VITE_GA4_ID is set.
 *
 * Funnel events (see the individual call sites):
 *   page_view          — SPA route change (App.jsx)
 *   cta_click           — any "book a call" button { source: nav|hero|services|cta_banner|contact_sidebar|widget }
 *   widget_open         — floating lead widget opened
 *   lead_submitted      — lead form inside the widget succeeded
 *   booking_confirmed   — discovery call booked (Booking.jsx)
 *   contact_submitted   — contact form succeeded (Contact.jsx)
 */

/**
 * @typedef {Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }} AnalyticsWindow
 */

const GA4_ID = import.meta.env.VITE_GA4_ID;
const w = /** @type {AnalyticsWindow} */ (window);

let bootstrapped = false;

function bootstrap() {
  if (bootstrapped || !GA4_ID) return;
  bootstrapped = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  w.dataLayer = w.dataLayer || [];
  // Queue-safe stub: events pushed before gtag.js loads are replayed by it.
  w.gtag = (...args) => {
    w.dataLayer?.push(args);
  };
  w.gtag("js", new Date());
  // Page views are sent manually on route change (SPAs), not on config.
  w.gtag("config", GA4_ID, { send_page_view: false });
}

/** SPA page view — call on every route change. */
export function trackPageView(path) {
  bootstrap();
  if (typeof w.gtag !== "function") return;
  w.gtag("event", "page_view", { page_path: path });
}

/** Named funnel event, e.g. trackEvent("cta_click", { source: "hero" }). */
export function trackEvent(name, params = {}) {
  bootstrap();
  if (typeof w.gtag !== "function") return;
  w.gtag("event", name, params);
}
