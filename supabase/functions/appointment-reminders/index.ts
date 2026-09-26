// Daily 24h reminder for booked discovery calls.
// Called by pg_cron (migration 012) with the x-cron-secret header.
// Picks confirmed bookings starting 20–28 h from now that have not been
// reminded yet, emails them in their language, then sets reminder_sent,
// so a second run on the same day never sends duplicates.

import {
  type Appointment,
  corsHeaders,
  db,
  emailLayout,
  escapeHtml,
  json,
  sendEmail,
  whenBlock,
} from "../_shared/booking.ts";

const CRON_SECRET = Deno.env.get("CRON_SECRET") || "";

function reminderHtml(appt: Appointment) {
  const fr = appt.lang === "fr";
  const first = escapeHtml(appt.name.split(" ")[0] || appt.name);
  const body = `
<p style="margin:0 0 16px">${fr ? `Bonjour ${first},` : `Hi ${first},`}</p>
<p style="margin:0 0 16px">${fr
    ? "Petit rappel : notre appel découverte a lieu demain."
    : "A quick reminder: our discovery call is tomorrow."}</p>
${whenBlock(appt)}
<p style="margin:0 0 8px"><strong>${fr ? "Sujet" : "Topic"}:</strong> ${escapeHtml(appt.topic)}</p>
<p style="margin:16px 0 0">${fr
    ? "Un empêchement ? Répondez à ce courriel et nous trouverons un autre moment."
    : "Something came up? Reply to this email and we'll find another time."}</p>
<p style="margin:16px 0 0">— Albert</p>`;
  return emailLayout(fr ? "À demain !" : "See you tomorrow!", body);
}

Deno.serve({ port: Number(Deno.env.get("SERVE_PORT") || 8000) }, async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (!CRON_SECRET || req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return json({ error: "unauthorized" }, 401, origin);
  }

  try {
    const now = Date.now();
    const from = new Date(now + 20 * 3600_000).toISOString();
    const to = new Date(now + 28 * 3600_000).toISOString();
    const res = await db(
      `appointments?select=*&status=eq.confirmed&reminder_sent=eq.false` +
        `&starts_at=gte.${encodeURIComponent(from)}&starts_at=lt.${encodeURIComponent(to)}`,
    );
    if (!res.ok) throw new Error(`lookup failed ${res.status}`);
    const due = (await res.json()) as Appointment[];

    let sent = 0;
    for (const appt of due) {
      const fr = appt.lang === "fr";
      const ok = await sendEmail(
        appt.email,
        fr ? "Rappel : notre appel de demain" : "Reminder: our call tomorrow",
        reminderHtml(appt),
      );
      if (!ok) continue; // retried by tomorrow's run only if still inside the window
      await db(`appointments?id=eq.${appt.id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ reminder_sent: true }),
      });
      sent++;
    }
    return json({ due: due.length, sent }, 200, origin);
  } catch (err) {
    console.error("reminders error", err);
    return json({ error: "internal_error" }, 500, origin);
  }
});
