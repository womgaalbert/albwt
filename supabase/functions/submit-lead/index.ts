// Lead capture for the floating contact widget.
//
// POST { name, email?, phone?, message?, lang, page, website (honeypot) }
//   → 200 { ok: true } | 400 invalid_* | 429 rate_limited
//   At least one of email / phone is required. The same email or phone within
//   DEDUPE_MINUTES is acknowledged without a new row or email.
//   The notice goes to NOTIFY_EMAIL; a failed email never loses a lead.

import { corsHeaders, db, emailLayout, escapeHtml, json, NOTIFY_EMAIL, sendEmail } from "../_shared/booking.ts";

const LEADS_PER_HOUR = 5;
const DEDUPE_MINUTES = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Must match LeadWidget.jsx
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function validPhone(phone: string) {
  return PHONE_RE.test(phone) && phone.replace(/\D/g, "").length >= 7;
}

// ---------- Rate limit (shares agent_rate_limits with the analyzer and booking) ----------

async function allowLead(ip: string) {
  const key = `lead:${ip}`;
  try {
    const rows = await (await db(`agent_rate_limits?ip=eq.${encodeURIComponent(key)}&select=window_start,count`)).json();
    const now = Date.now();
    const fresh = rows.length === 0 || now - new Date(rows[0].window_start).getTime() >= 3600_000;
    if (!fresh && rows[0].count >= LEADS_PER_HOUR) return false;
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
    return true; // never lose a lead because the limiter store is down
  }
}

async function isDuplicate(email: string | null, phone: string | null) {
  const since = encodeURIComponent(new Date(Date.now() - DEDUPE_MINUTES * 60_000).toISOString());
  const checks = [email && `email=eq.${encodeURIComponent(email)}`, phone && `phone=eq.${encodeURIComponent(phone)}`]
    .filter(Boolean)
    .map(async (filter) => {
      const res = await db(`leads?select=id&created_at=gte.${since}&${filter}&limit=1`);
      return res.ok && (await res.json()).length > 0;
    });
  return (await Promise.all(checks)).some(Boolean);
}

// ---------- Email ----------

type Lead = { name: string; email: string | null; phone: string | null; message: string | null; lang: string; page: string | null };

function sendNotification(lead: Lead) {
  const row = (label: string, html: string) => `<p style="margin:0 0 8px"><strong>${label}:</strong> ${html}</p>`;
  const email = lead.email ? escapeHtml(lead.email) : "";
  const tel = lead.phone ? lead.phone.replace(/[^\d+]/g, "") : "";
  const body = `
${row("Name", escapeHtml(lead.name))}
${lead.email ? row("Email", `<a href="mailto:${email}">${email}</a>`) : ""}
${lead.phone ? row("Phone", `<a href="tel:${escapeHtml(tel)}">${escapeHtml(lead.phone)}</a>`) : ""}
${row("Language", lead.lang === "fr" ? "French" : "English")}
${lead.page ? row("Page", escapeHtml(lead.page)) : ""}
${lead.message ? `<p style="margin:16px 0 6px"><strong>Message:</strong></p>
<p style="margin:0;padding:12px 14px;background:#f7f9fc;border-radius:8px;white-space:pre-line">${escapeHtml(lead.message)}</p>` : ""}
<p style="margin:16px 0 0;color:#6b7a90;font-size:13px">${lead.email ? "Reply to this email to answer them directly." : "No email given: call or text them back."}</p>`;
  return sendEmail(
    NOTIFY_EMAIL,
    `New lead: ${lead.name}${lead.email ? ` — ${lead.email}` : ""}${lead.phone ? ` · ${lead.phone}` : ""}`,
    emailLayout("New lead from the website", body),
    undefined,
    lead.email ?? undefined,
  );
}

// ---------- HTTP handler ----------

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
    // Honeypot: bots fill every field; pretend success.
    if (str(body?.website, 200)) return json({ ok: true }, 200, origin);

    const name = str(body.name, 80);
    const email = str(body.email, 254).toLowerCase() || null;
    const phone = str(body.phone, 40) || null;
    if (name.length < 2) return json({ error: "invalid_name" }, 400, origin);
    if (!email && !phone) return json({ error: "contact_required" }, 400, origin);
    if (email && !EMAIL_RE.test(email)) return json({ error: "invalid_email" }, 400, origin);
    if (phone && !validPhone(phone)) return json({ error: "invalid_phone" }, 400, origin);

    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    if (!(await allowLead(ip))) return json({ error: "rate_limited" }, 429, origin);

    if (await isDuplicate(email, phone)) return json({ ok: true }, 200, origin);

    const lead: Lead = {
      name,
      email,
      phone,
      message: str(body.message, 1000) || null,
      lang: body.lang === "fr" ? "fr" : "en",
      page: str(body.page, 200) || null,
    };
    const res = await db("leads", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ ...lead, source: "widget" }),
    });
    if (!res.ok) {
      console.error("insert failed", res.status, (await res.text()).slice(0, 300));
      return json({ error: "internal_error" }, 500, origin);
    }

    await sendNotification(lead);
    return json({ ok: true }, 200, origin);
  } catch (err) {
    console.error("submit-lead failed", err);
    return json({ error: "internal_error" }, 500, origin);
  }
});
