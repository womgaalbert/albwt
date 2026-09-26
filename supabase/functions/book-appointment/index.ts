// Discovery-call booking — replaces Calendly.
//
// POST { action: "slots" }  → { slots: ISO[], timezone, durationMin }
//   Free 30-min slots, Mon–Fri 09:00–17:00 America/Toronto, next 21 days, ≥24h notice.
//   Never returns personal data.
// POST { action: "book", startsAt, name, email, company?, phone?, topic, message?,
//        format, lang, timezone, website (honeypot) }
//   → 201 { id, startsAt } | 409 slot_taken | 429 rate_limited | 400 invalid_*
//   The unique index on appointments(starts_at) is the final double-booking guard.
//   Confirmation (+ .ics) goes to the visitor, a notice goes to NOTIFY_EMAIL.
//   A failed email never loses a booking.

import {
  type Appointment,
  buildIcs,
  candidateSlots,
  corsHeaders,
  db,
  emailLayout,
  escapeHtml,
  isValidTimeZone,
  json,
  NOTIFY_EMAIL,
  sendEmail,
  SLOT_MINUTES,
  BUSINESS_TZ,
  whenBlock,
} from "../_shared/booking.ts";

const BOOKINGS_PER_HOUR = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ---------- Free slots ----------

async function freeSlots() {
  const candidates = candidateSlots();
  if (candidates.length === 0) return [];
  const from = new Date(candidates[0].at).toISOString();
  const to = new Date(candidates[candidates.length - 1].at).toISOString();

  const [takenRes, blockedRes] = await Promise.all([
    db(`appointments?select=starts_at&status=neq.cancelled&starts_at=gte.${encodeURIComponent(from)}&starts_at=lte.${encodeURIComponent(to)}`),
    db(`blocked_dates?select=date&date=gte.${candidates[0].date}&date=lte.${candidates[candidates.length - 1].date}`),
  ]);
  if (!takenRes.ok || !blockedRes.ok) throw new Error(`slots lookup failed ${takenRes.status}/${blockedRes.status}`);
  const taken = new Set((await takenRes.json()).map((r: { starts_at: string }) => new Date(r.starts_at).getTime()));
  const blocked = new Set((await blockedRes.json()).map((r: { date: string }) => r.date));

  return candidates
    .filter((s) => !taken.has(s.at) && !blocked.has(s.date))
    .map((s) => new Date(s.at).toISOString());
}

// ---------- Rate limit (shares agent_rate_limits with the analyzer) ----------

async function allowBooking(ip: string) {
  const key = `book:${ip}`;
  try {
    const rows = await (await db(`agent_rate_limits?ip=eq.${encodeURIComponent(key)}&select=window_start,count`)).json();
    const now = Date.now();
    const fresh = rows.length === 0 || now - new Date(rows[0].window_start).getTime() >= 3600_000;
    if (!fresh && rows[0].count >= BOOKINGS_PER_HOUR) return false;
    await db("agent_rate_limits?on_conflict=ip", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(
        fresh
          ? { ip: key, window_start: new Date(now).toISOString(), count: 1 }
          : { ip: key, window_start: rows[0].window_start, count: rows[0].count + 1 },
      ),
    });
    return true;
  } catch {
    return true; // never block bookings because the limiter store is down
  }
}

// ---------- Emails ----------

function field(label: string, value: string | null | undefined) {
  return value ? `<p style="margin:0 0 8px"><strong>${label}:</strong> ${escapeHtml(value)}</p>` : "";
}

async function sendConfirmation(appt: Appointment) {
  const fr = appt.lang === "fr";
  const first = escapeHtml(appt.name.split(" ")[0] || appt.name);
  const body = `
<p style="margin:0 0 16px">${fr ? `Bonjour ${first},` : `Hi ${first},`}</p>
<p style="margin:0 0 16px">${fr
    ? "Merci ! Votre appel découverte est confirmé :"
    : "Thanks! Your discovery call is confirmed:"}</p>
${whenBlock(appt)}
${field(fr ? "Sujet" : "Topic", appt.topic)}
${field(fr ? "Format" : "Format", appt.format === "phone" ? (fr ? "Téléphone" : "Phone") : (fr ? "Vidéo" : "Video"))}
<p style="margin:16px 0">${fr
    ? "Je vous enverrai le lien de la visioconférence (ou vous appellerai) à l'heure prévue. L'invitation est jointe pour l'ajouter à votre agenda."
    : "I'll send the video link (or call you) at the scheduled time. The invite is attached so you can add it to your calendar."}</p>
<p style="margin:0">${fr
    ? "Besoin de changer l'heure ? Répondez simplement à ce courriel."
    : "Need to reschedule? Just reply to this email."}</p>
<p style="margin:16px 0 0">— Albert</p>`;
  const ics = toBase64(buildIcs(appt));
  return sendEmail(
    appt.email,
    fr ? "Votre appel avec Albert Womga est confirmé" : "Your call with Albert Womga is confirmed",
    emailLayout(fr ? "Rendez-vous confirmé" : "Call confirmed", body),
    [{ filename: "albwt-call.ics", content: ics }],
  );
}

async function sendNotification(appt: Appointment) {
  const body = `
${whenBlock({ ...appt, lang: "en", timezone: BUSINESS_TZ })}
${field("Name", appt.name)}
${field("Email", appt.email)}
${field("Company", appt.company)}
${field("Phone", appt.phone)}
${field("Topic", appt.topic)}
${field("Format", appt.format)}
${field("Language", appt.lang)}
${field("Visitor time zone", appt.timezone)}
${field("Message", appt.message)}`;
  return sendEmail(NOTIFY_EMAIL, `New call booked: ${appt.name} — ${appt.topic}`, emailLayout("New discovery call", body));
}

// ---------- HTTP handler ----------

function toBase64(text: string) {
  let bin = "";
  for (const byte of new TextEncoder().encode(text)) bin += String.fromCharCode(byte);
  return btoa(bin);
}

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

Deno.serve({ port: Number(Deno.env.get("SERVE_PORT") || 8000) }, async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400, origin);
  }

  try {
    if (body?.action === "slots") {
      return json({ slots: await freeSlots(), timezone: BUSINESS_TZ, durationMin: SLOT_MINUTES }, 200, origin);
    }

    if (body?.action !== "book") return json({ error: "invalid_action" }, 400, origin);

    // Honeypot: bots fill every field; pretend success.
    if (str(body.website, 200)) return json({ id: crypto.randomUUID(), startsAt: body.startsAt }, 201, origin);

    const name = str(body.name, 120);
    const email = str(body.email, 254).toLowerCase();
    const topic = str(body.topic, 80);
    const startsAt = str(body.startsAt, 40);
    if (!name) return json({ error: "invalid_name" }, 400, origin);
    if (!EMAIL_RE.test(email)) return json({ error: "invalid_email" }, 400, origin);
    if (!topic) return json({ error: "invalid_topic" }, 400, origin);

    const at = new Date(startsAt).getTime();
    if (!Number.isFinite(at)) return json({ error: "invalid_slot" }, 400, origin);
    const iso = new Date(at).toISOString();
    if (!(await freeSlots()).includes(iso)) return json({ error: "slot_taken" }, 409, origin);

    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    if (!(await allowBooking(ip))) return json({ error: "rate_limited" }, 429, origin);

    const row = {
      starts_at: iso,
      duration_min: SLOT_MINUTES,
      name,
      email,
      company: str(body.company, 160) || null,
      phone: str(body.phone, 40) || null,
      topic,
      message: str(body.message, 1000) || null,
      format: body.format === "phone" ? "phone" : "video",
      lang: body.lang === "fr" ? "fr" : "en",
      timezone: isValidTimeZone(body.timezone) ? body.timezone : null,
    };
    const res = await db("appointments", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    });
    if (res.status === 409) return json({ error: "slot_taken" }, 409, origin); // unique index race
    if (!res.ok) {
      console.error("insert failed", res.status, (await res.text()).slice(0, 300));
      return json({ error: "internal_error" }, 500, origin);
    }
    const [appt] = (await res.json()) as Appointment[];

    // Emails are best-effort: the booking already exists.
    await Promise.all([sendConfirmation(appt), sendNotification(appt)]);

    return json({ id: appt.id, startsAt: appt.starts_at }, 201, origin);
  } catch (err) {
    console.error("booking error", err);
    return json({ error: "internal_error" }, 500, origin);
  }
});
