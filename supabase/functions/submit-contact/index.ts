// Contact-form messages — writes to contact_messages and notifies by email.
//
// POST { name, email, company?, service?, message, lang, website (honeypot) }
//   → 200 { ok: true } | 400 invalid_* | 429 rate_limited
//   Length limits mirror the contact_messages DB constraint (007_tighten_rls).
//   A notice goes to NOTIFY_EMAIL (reply-to: the visitor, so Albert can answer
//   directly) and an acknowledgement goes to the visitor.
//   A failed email never loses the message.

import { corsHeaders, db, emailLayout, escapeHtml, json, NOTIFY_EMAIL, sendEmail } from "../_shared/booking.ts";

const CONTACTS_PER_HOUR = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

// ---------- Rate limit (shares agent_rate_limits with the analyzer, booking and leads) ----------

async function allowContact(ip: string) {
  const key = `contact:${ip}`;
  try {
    const rows = await (await db(`agent_rate_limits?ip=eq.${encodeURIComponent(key)}&select=window_start,count`)).json();
    const now = Date.now();
    const fresh = rows.length === 0 || now - new Date(rows[0].window_start).getTime() >= 3600_000;
    if (!fresh && rows[0].count >= CONTACTS_PER_HOUR) return false;
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
    return true; // never lose a message because the limiter store is down
  }
}

// ---------- Emails ----------

type ContactMessage = {
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  message: string;
  lang: string;
};

function row(label: string, html: string) {
  return `<p style="margin:0 0 8px"><strong>${label}:</strong> ${html}</p>`;
}

function sendNotification(msg: ContactMessage) {
  const body = `
${row("Name", escapeHtml(msg.name))}
${row("Email", `<a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a>`)}
${msg.company ? row("Company", escapeHtml(msg.company)) : ""}
${msg.service ? row("Service", escapeHtml(msg.service)) : ""}
${row("Language", msg.lang === "fr" ? "French" : "English")}
<p style="margin:16px 0 6px"><strong>Message:</strong></p>
<p style="margin:0;padding:12px 14px;background:#f7f9fc;border-radius:8px;white-space:pre-line">${escapeHtml(msg.message)}</p>
<p style="margin:16px 0 0;color:#6b7a90;font-size:13px">Reply to this email to answer them directly.</p>`;
  return sendEmail(
    NOTIFY_EMAIL,
    `New message: ${msg.name} — ${msg.service || "contact form"}`,
    emailLayout("New message from the website", body),
    undefined,
    msg.email, // reply-to the visitor
  );
}

function sendAcknowledgement(msg: ContactMessage) {
  const fr = msg.lang === "fr";
  const first = escapeHtml(msg.name.split(" ")[0] || msg.name);
  const body = `
<p style="margin:0 0 16px">${fr ? `Bonjour ${first},` : `Hi ${first},`}</p>
<p style="margin:0 0 16px">${fr
    ? "Merci pour votre message — je l'ai bien reçu et je vous répondrai personnellement sous 24 heures."
    : "Thanks for your message — I've received it and will reply to you personally within 24 hours."}</p>
<p style="margin:0 0 16px">${fr
    ? "Vous pouvez aussi réserver un appel découverte gratuit de 30 minutes ici : https://albwt.com/booking"
    : "You can also book a free 30-minute discovery call here: https://albwt.com/booking"}</p>
<p style="margin:0">— Albert</p>`;
  return sendEmail(
    msg.email,
    fr ? "Votre message est bien reçu — Albert Womga" : "Your message was received — Albert Womga",
    emailLayout(fr ? "Message reçu" : "Message received", body),
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

    const name = str(body.name, 100);
    const email = str(body.email, 254).toLowerCase();
    const company = str(body.company, 200) || null;
    const service = str(body.service, 100) || null;
    const message = str(body.message, 5000);
    if (!name) return json({ error: "invalid_name" }, 400, origin);
    if (!EMAIL_RE.test(email)) return json({ error: "invalid_email" }, 400, origin);
    if (!message) return json({ error: "invalid_message" }, 400, origin);

    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    if (!(await allowContact(ip))) return json({ error: "rate_limited" }, 429, origin);

    const msg: ContactMessage = {
      name,
      email,
      company,
      service,
      message,
      lang: body.lang === "fr" ? "fr" : "en",
    };
    const res = await db("contact_messages", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ name, email, company, service, message }),
    });
    if (!res.ok) {
      console.error("insert failed", res.status, (await res.text()).slice(0, 300));
      return json({ error: "internal_error" }, 500, origin);
    }

    // Emails are best-effort: the message is already stored.
    await Promise.all([sendNotification(msg), sendAcknowledgement(msg)]);
    return json({ ok: true }, 200, origin);
  } catch (err) {
    console.error("submit-contact failed", err);
    return json({ error: "internal_error" }, 500, origin);
  }
});
