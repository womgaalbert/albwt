// Shared by book-appointment and appointment-reminders.
//
// Secrets (supabase secrets set):
//   RESEND_API_KEY       — https://resend.com → API Keys (or RESEND_API_KEY_albwt; emails are skipped when unset)
//   BOOKING_FROM_EMAIL   — default: "Albert Womga <no-reply@albwt.com>" (domain must be verified in Resend)
//   BOOKING_NOTIFY_EMAIL — where new-booking notices go, default: contact@albwt.com
//   CRON_SECRET          — shared secret for the daily reminder cron (appointment-reminders only)

export const BUSINESS_TZ = "America/Toronto";
export const SLOT_MINUTES = 30;
export const DAY_START_HOUR = 9; // first slot 09:00
export const DAY_END_HOUR = 17; // last slot ends 17:00
export const DAYS_AHEAD = 21;
export const MIN_NOTICE_HOURS = 24;

export const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
export const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Accepts either name: the project secret is RESEND_API_KEY_albwt.
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || Deno.env.get("RESEND_API_KEY_albwt") || "";
const FROM_EMAIL = Deno.env.get("BOOKING_FROM_EMAIL") || "Albert Womga <no-reply@albwt.com>";
export const NOTIFY_EMAIL = Deno.env.get("BOOKING_NOTIFY_EMAIL") || "contact@albwt.com";
const REPLY_TO = "contact@albwt.com";
const SITE_URL = "https://albwt.com";

const ALLOWED_ORIGINS = new Set([
  "https://albwt.com",
  "https://www.albwt.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

// ---------- HTTP ----------

export function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : null;
  return {
    "Access-Control-Allow-Origin": allowed ?? "https://albwt.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

// ---------- Supabase REST (service role) ----------

export async function db(path: string, init: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

// ---------- Time zones (no dependencies) ----------

/** Offset (ms) of `tz` from UTC at the given instant. */
function tzOffsetMs(instant: number, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(instant));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - instant;
}

/** UTC instant of a wall-clock time in `tz` (DST-safe). */
export function zonedToUtc(y: number, m: number, d: number, h: number, min: number, tz = BUSINESS_TZ) {
  const guess = Date.UTC(y, m - 1, d, h, min);
  const first = guess - tzOffsetMs(guess, tz);
  return first - (tzOffsetMs(first, tz) - tzOffsetMs(guess, tz));
}

/** Calendar date (y, m, d) in `tz` for an instant. */
export function zonedDate(instant: number, tz = BUSINESS_TZ) {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(instant)).split("-").map(Number);
  return { y, m, d };
}

export function isValidTimeZone(tz: unknown): tz is string {
  if (typeof tz !== "string" || !tz || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Every bookable slot (UTC ms) in the booking window, before removing taken/blocked ones. */
export function candidateSlots(now = Date.now()) {
  const earliest = now + MIN_NOTICE_HOURS * 3600_000;
  const today = zonedDate(now);
  const slots: { at: number; date: string }[] = [];
  for (let i = 0; i <= DAYS_AHEAD; i++) {
    const day = new Date(Date.UTC(today.y, today.m - 1, today.d + i, 12));
    const dow = day.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    const y = day.getUTCFullYear(), m = day.getUTCMonth() + 1, d = day.getUTCDate();
    const date = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    for (let mins = DAY_START_HOUR * 60; mins + SLOT_MINUTES <= DAY_END_HOUR * 60; mins += SLOT_MINUTES) {
      const at = zonedToUtc(y, m, d, Math.floor(mins / 60), mins % 60);
      if (at >= earliest) slots.push({ at, date });
    }
  }
  return slots;
}

export function formatWhen(instant: number, lang: string, tz: string) {
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-CA" : "en-CA", {
    timeZone: tz, dateStyle: "full", timeStyle: "short",
  }).format(new Date(instant));
}

// ---------- Email ----------

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function icsDate(instant: number) {
  return new Date(instant).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** iCalendar invite for one booking. */
export function buildIcs(appt: Appointment) {
  const start = new Date(appt.starts_at).getTime();
  const fr = appt.lang === "fr";
  const summary = fr ? "Appel découverte avec Albert Womga" : "Discovery call with Albert Womga";
  const description = fr
    ? `Sujet : ${appt.topic}\nFormat : ${appt.format === "phone" ? "téléphone" : "vidéo"}\nLe lien de la visioconférence vous sera envoyé par courriel.`
    : `Topic: ${appt.topic}\nFormat: ${appt.format === "phone" ? "phone" : "video"}\nThe video link will be sent by email.`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//albwt.com//Booking//EN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${appt.id}@albwt.com`,
    `DTSTAMP:${icsDate(Date.now())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(start + appt.duration_min * 60_000)}`,
    `SUMMARY:${icsText(summary)}`,
    `DESCRIPTION:${icsText(description)}`,
    `ORGANIZER;CN=Albert Womga:mailto:${REPLY_TO}`,
    `URL:${SITE_URL}/booking`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export type Appointment = {
  id: string;
  starts_at: string;
  duration_min: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  topic: string;
  message: string | null;
  format: "video" | "phone";
  lang: "en" | "fr";
  timezone: string | null;
};

/** Sends through Resend; returns false (and logs) instead of throwing. */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  attachments?: { filename: string; content: string }[],
) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipped email:", subject);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, reply_to: REPLY_TO, to: [to], subject, html, attachments }),
    });
    if (!res.ok) {
      console.error("resend error", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("resend call failed", err);
    return false;
  }
}

/** Branded email shell: navy header, white card. */
export function emailLayout(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#101b33">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden">
<tr><td style="background:#101b33;padding:22px 28px;color:#ffffff;font-size:18px;font-weight:bold">Albert Womga <span style="color:#00d4b8">· AI/ML</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:20px;color:#101b33">${title}</h1>
${bodyHtml}
</td></tr>
<tr><td style="padding:16px 28px;background:#f7f9fc;color:#6b7a90;font-size:12px">albwt.com · ${REPLY_TO}</td></tr>
</table></td></tr></table></body></html>`;
}

/** "Your time (Ottawa time)" lines, in the booking's language. */
export function whenBlock(appt: Appointment) {
  const at = new Date(appt.starts_at).getTime();
  const fr = appt.lang === "fr";
  const tz = isValidTimeZone(appt.timezone) ? appt.timezone! : BUSINESS_TZ;
  const local = formatWhen(at, appt.lang, tz);
  const ottawa = formatWhen(at, appt.lang, BUSINESS_TZ);
  return `<p style="margin:0 0 6px;font-size:16px;font-weight:bold">${escapeHtml(local)}</p>
<p style="margin:0 0 16px;color:#6b7a90;font-size:13px">${escapeHtml(tz)}${tz === BUSINESS_TZ ? "" : ` · ${fr ? "Heure d'Ottawa" : "Ottawa time"} : ${escapeHtml(ottawa)}`} · ${appt.duration_min} min</p>`;
}
