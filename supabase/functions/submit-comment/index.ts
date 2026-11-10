// Project comments submission — writes to project_comments and notifies by email.
//
// POST { project_slug, author_name, content, website (honeypot) }
//   → 200 { ok: true } | 400 invalid_* | 429 rate_limited
//   Length limits mirror the project_comments DB constraint (007_tighten_rls).
//   Protected by honeypot and per-IP sliding-window rate limiting.

import { corsHeaders, db, emailLayout, escapeHtml, json, NOTIFY_EMAIL, sendEmail } from "../_shared/booking.ts";

const COMMENTS_PER_HOUR = 10;

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

// ---------- Rate limit (shares agent_rate_limits with contact, lead, booking, analyzer) ----------

async function allowComment(ip: string) {
  const key = `comment:${ip}`;
  try {
    const rows = await (await db(`agent_rate_limits?ip=eq.${encodeURIComponent(key)}&select=window_start,count`)).json();
    const now = Date.now();
    const fresh = rows.length === 0 || now - new Date(rows[0].window_start).getTime() >= 3600_000;
    if (!fresh && rows[0].count >= COMMENTS_PER_HOUR) return false;
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
    return true; // fail-open so comments aren't lost if rate-limit store is down
  }
}

function sendNotification(slug: string, author: string, content: string) {
  const body = `
<p style="margin:0 0 8px"><strong>Project:</strong> ${escapeHtml(slug)}</p>
<p style="margin:0 0 8px"><strong>Author:</strong> ${escapeHtml(author)}</p>
<p style="margin:16px 0 6px"><strong>Comment:</strong></p>
<p style="margin:0;padding:12px 14px;background:#f7f9fc;border-radius:8px;white-space:pre-line">${escapeHtml(content)}</p>`;
  return sendEmail(
    NOTIFY_EMAIL,
    `New project comment on ${slug} by ${author}`,
    emailLayout("New project comment", body),
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

    const project_slug = str(body?.project_slug, 100);
    const author_name = str(body?.author_name, 80);
    const content = str(body?.content, 2000);

    if (!project_slug) return json({ error: "invalid_slug" }, 400, origin);
    if (!author_name) return json({ error: "invalid_author" }, 400, origin);
    if (!content) return json({ error: "invalid_content" }, 400, origin);

    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    if (!(await allowComment(ip))) return json({ error: "rate_limited" }, 429, origin);

    const res = await db("project_comments", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ project_slug, author_name, content, is_approved: true }),
    });

    if (!res.ok) {
      console.error("comment insert failed", res.status, (await res.text()).slice(0, 300));
      return json({ error: "internal_error" }, 500, origin);
    }

    // Notification is best-effort
    sendNotification(project_slug, author_name, content).catch((err) =>
      console.error("comment email notification failed", err)
    );

    return json({ ok: true }, 200, origin);
  } catch (err) {
    console.error("submit-comment failed", err);
    return json({ error: "internal_error" }, 500, origin);
  }
});
