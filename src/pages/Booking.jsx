import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CalendarPlus, CheckCircle, ChevronLeft, ChevronRight, Clock, Globe, Phone, Star, Video, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import { testimonials } from "@/components/portfolio/Testimonials";
import Seo from "@/components/Seo";

const OTTAWA_TZ = "America/Toronto";
const visitorTz = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || OTTAWA_TZ;
  } catch {
    return OTTAWA_TZ;
  }
})();

const inputClass =
  "w-full bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors";

/** YYYY-MM-DD of an instant in the visitor's time zone. */
const dayKey = (iso) => new Intl.DateTimeFormat("en-CA", { timeZone: visitorTz }).format(new Date(iso));

/** Client-side .ics so the visitor can add the call right away. */
function downloadIcs(startsAt, title) {
  const stamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + 30 * 60_000);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//albwt.com//Booking//EN", "BEGIN:VEVENT",
    `UID:${stamp(start)}-albwt@albwt.com`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${title}`,
    "URL:https://albwt.com/booking", "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "albwt-call.ics" });
  a.click();
  URL.revokeObjectURL(url);
}

export default function Booking() {
  const { t, lang } = useLang();
  const b = t.booking;
  const locale = lang === "fr" ? "fr-CA" : "en-CA";

  // Mini social proof next to the booking form (CM Avocats — most recent consulting client).
  const testimonial = testimonials[1];
  const tr = (v) => (v && typeof v === "object" ? v[lang] || v.en : v);

  const [slots, setSlots] = useState(/** @type {string[]} */ ([]));
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");
  const [month, setMonth] = useState(null); // { y, m } (m: 0-11)
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", topic: "", format: "video", message: "", website: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(null);

  const loadSlots = async () => {
    setStatus("loading");
    const { data, error: fnError } = await supabase.functions.invoke("book-appointment", { body: { action: "slots" } });
    if (fnError || !Array.isArray(data?.slots)) {
      setStatus("error");
      return;
    }
    setSlots(data.slots);
    setStatus("ready");
    if (data.slots[0]) {
      const [y, m] = dayKey(data.slots[0]).split("-").map(Number);
      setMonth((cur) => cur ?? { y, m: m - 1 });
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const byDay = useMemo(() => {
    /** @type {Record<string, string[]>} */
    const map = {};
    for (const s of slots) (map[dayKey(s)] ||= []).push(s);
    return map;
  }, [slots]);

  const monthBounds = useMemo(() => {
    const keys = Object.keys(byDay).sort();
    if (!keys.length) return null;
    const toYm = (k) => { const [y, m] = k.split("-").map(Number); return y * 12 + (m - 1); };
    return { min: toYm(keys[0]), max: toYm(keys[keys.length - 1]) };
  }, [byDay]);

  const fmtTime = (iso, tz = visitorTz) => new Intl.DateTimeFormat(locale, { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(new Date(iso));
  const fmtDay = (key) => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${key}T12:00:00Z`));
  const fmtFull = (iso, tz = visitorTz) => new Intl.DateTimeFormat(locale, { timeZone: tz, dateStyle: "full", timeStyle: "short" }).format(new Date(iso));

  // Monday-first grid for the visible month.
  const cells = useMemo(() => {
    if (!month) return [];
    const first = new Date(Date.UTC(month.y, month.m, 1));
    const lead = (first.getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
    const out = Array(lead).fill(null);
    for (let d = 1; d <= days; d++) {
      out.push(`${month.y}-${String(month.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return out;
  }, [month]);

  const shiftMonth = (delta) => setMonth(({ y, m }) => {
    const n = y * 12 + m + delta;
    return { y: Math.floor(n / 12), m: n % 12 };
  });
  const ym = month ? month.y * 12 + month.m : 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!slot) return;
    setSubmitting(true);
    setError("");
    const { data, error: fnError } = await supabase.functions.invoke("book-appointment", {
      body: { action: "book", startsAt: slot, ...form, lang, timezone: visitorTz },
    });
    setSubmitting(false);
    if (fnError) {
      let code = "";
      try {
        code = (await fnError.context?.json())?.error || "";
      } catch { /* non-JSON error */ }
      if (code === "slot_taken") {
        setError(b.errors.slotTaken);
        setSlot("");
        loadSlots();
      } else if (code === "rate_limited") setError(b.errors.rateLimited);
      else if (code === "invalid_email") setError(b.errors.invalidEmail);
      else setError(b.errors.generic);
      return;
    }
    setBooked({ startsAt: data.startsAt, email: form.email });
    trackEvent("booking_confirmed");
  };

  const stepTitle = (n, label) => (
    <h2 className="flex items-center gap-2 text-foreground font-bold mb-4">
      <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs text-white" style={{ background: "hsl(var(--primary))" }}>{n}</span>
      {label}
    </h2>
  );

  return (
    <div className="pt-24 pb-20">
      <Seo
        title={b.seoTitle}
        description={b.seoDescription}
      />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>{b.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-foreground">{b.title}</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">{b.subtitle}</p>
        </motion.div>

        {!booked && (
          <div className="grid md:grid-cols-2 gap-6 mb-10 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-foreground font-bold mb-4">{b.agendaTitle}</h2>
              <ul className="space-y-2.5">
                {b.agenda.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--primary))" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-700 dark:text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{tr(testimonial.quote)}"</p>
              <div className="mt-auto">
                <p className="text-foreground font-semibold text-sm">{tr(testimonial.name)}</p>
                <p className="text-muted-foreground text-xs">{tr(testimonial.title)} · {tr(testimonial.company)}</p>
              </div>
            </div>
          </div>
        )}

        {booked ? (
          <div className="max-w-xl mx-auto bg-card border border-primary/30 rounded-2xl p-10 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "hsl(var(--primary))" }} />
            <h2 className="text-foreground font-bold text-2xl mb-2">{b.successTitle}</h2>
            <p className="text-foreground font-semibold">{fmtFull(booked.startsAt)}</p>
            {visitorTz !== OTTAWA_TZ && (
              <p className="text-muted-foreground text-sm mt-1">{fmtFull(booked.startsAt, OTTAWA_TZ)} ({b.ottawaTime})</p>
            )}
            <p className="text-muted-foreground mt-4">{b.successDesc.replace("{email}", booked.email)}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => downloadIcs(booked.startsAt, b.icsTitle)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white text-sm hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))" }}
              >
                <CalendarPlus className="w-4 h-4" /> {b.addToCalendar}
              </button>
              <button
                type="button"
                onClick={() => { setBooked(null); setSlot(""); setDay(""); loadSlots(); }}
                className="px-5 py-3 rounded-xl border border-border text-foreground text-sm font-semibold hover:border-primary/50"
              >
                {b.bookAnother}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Day + time */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                {stepTitle(1, b.step1)}
                <p className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Globe className="w-3.5 h-3.5" /> {b.yourTimezone.replace("{tz}", visitorTz)}
                </p>

                {status === "loading" && <p className="text-sm text-muted-foreground" role="status">{b.loadingSlots}</p>}
                {status === "error" && (
                  <div className="text-sm">
                    <p className="text-destructive mb-2">{b.slotsError}</p>
                    <button type="button" onClick={loadSlots} className="text-primary hover:underline">{b.retry}</button>
                  </div>
                )}
                {status === "ready" && !slots.length && <p className="text-sm text-muted-foreground">{b.noSlots}</p>}

                {status === "ready" && month && monthBounds && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <button type="button" onClick={() => shiftMonth(-1)} disabled={ym <= monthBounds.min} aria-label={b.prevMonth}
                        className="p-2 rounded-lg hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-semibold text-foreground capitalize">
                        {new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(month.y, month.m, 15)))}
                      </span>
                      <button type="button" onClick={() => shiftMonth(1)} disabled={ym >= monthBounds.max} aria-label={b.nextMonth}
                        className="p-2 rounded-lg hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
                      {b.weekdays.map((w) => <span key={w}>{w}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {cells.map((key, i) => {
                        if (!key) return <span key={`e${i}`} />;
                        const available = !!byDay[key];
                        const active = key === day;
                        return (
                          <button
                            key={key}
                            type="button"
                            disabled={!available}
                            aria-pressed={active}
                            aria-label={fmtDay(key)}
                            onClick={() => { setDay(key); setSlot(""); setError(""); }}
                            className={`aspect-square rounded-lg text-sm transition-colors ${
                              active
                                ? "text-white font-bold"
                                : available
                                  ? "text-foreground font-semibold bg-primary/10 hover:bg-primary/20"
                                  : "text-muted-foreground/40 cursor-not-allowed"
                            }`}
                            style={active ? { background: "hsl(var(--primary))" } : undefined}
                          >
                            {Number(key.slice(8))}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                {stepTitle(2, b.step2)}
                {!day ? (
                  <p className="text-sm text-muted-foreground">{b.noDay}</p>
                ) : (
                  <>
                    <p className="text-sm text-foreground font-medium mb-3 capitalize">{fmtDay(day)}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {(byDay[day] || []).map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={s === slot}
                          onClick={() => { setSlot(s); setError(""); }}
                          title={`${fmtTime(s, OTTAWA_TZ)} (${b.ottawaTime})`}
                          className={`py-2 rounded-lg border text-sm transition-colors ${
                            s === slot ? "text-white border-transparent font-semibold" : "border-border text-foreground hover:border-primary/50"
                          }`}
                          style={s === slot ? { background: "hsl(var(--primary))" } : undefined}
                        >
                          {fmtTime(s)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Details */}
            <form onSubmit={submit} className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5">
              {stepTitle(3, b.step3)}

              {slot && (
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-semibold capitalize">{fmtFull(slot)}</span>
                  {visitorTz !== OTTAWA_TZ && (
                    <span className="text-muted-foreground">· {fmtTime(slot, OTTAWA_TZ)} {b.ottawaTime}</span>
                  )}
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 30 min</span>
                </div>
              )}

              {/* Honeypot: hidden from people, filled by bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
                <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></label>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="bk-name" className="block text-sm text-muted-foreground mb-2">{b.name} *</label>
                  <input id="bk-name" required maxLength={120} autoComplete="name" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="bk-email" className="block text-sm text-muted-foreground mb-2">{b.email} *</label>
                  <input id="bk-email" required type="email" maxLength={254} autoComplete="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="bk-company" className="block text-sm text-muted-foreground mb-2">{b.company}</label>
                  <input id="bk-company" maxLength={160} autoComplete="organization" value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="bk-phone" className="block text-sm text-muted-foreground mb-2">{b.phone}</label>
                  <input id="bk-phone" type="tel" maxLength={40} autoComplete="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="bk-topic" className="block text-sm text-muted-foreground mb-2">{b.topic} *</label>
                <select id="bk-topic" required value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className={inputClass}>
                  <option value="">{t.contact.selectService}</option>
                  {t.contact.serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <fieldset>
                <legend className="block text-sm text-muted-foreground mb-2">{b.format}</legend>
                <div className="grid grid-cols-2 gap-3">
                  {[["video", b.video, Video], ["phone", b.phoneCall, Phone]].map(([value, label, Icon]) => (
                    <label key={value}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                        form.format === value ? "border-primary bg-primary/5 text-foreground font-semibold" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}>
                      <input type="radio" name="format" value={value} checked={form.format === value}
                        onChange={() => setForm({ ...form, format: value })} className="sr-only" />
                      <Icon className="w-4 h-4" /> {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="bk-message" className="block text-sm text-muted-foreground mb-2">{b.message}</label>
                <textarea id="bk-message" rows={4} maxLength={1000} value={form.message} placeholder={b.messagePlaceholder}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} />
              </div>

              {error && (
                <p role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!slot || submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))" }}
              >
                <CalendarDays className="w-4 h-4" />
                {submitting ? b.submitting : b.submit}
              </button>
              {!slot && <p className="text-xs text-muted-foreground text-center">{b.noDay}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
