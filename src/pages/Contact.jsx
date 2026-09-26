import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, Send, CheckCircle, Globe, CalendarDays } from "lucide-react";
import { XLogo, GoogleLogo } from "@/components/SocialIcons";
import { GoogleReviewButton } from "@/components/portfolio/GoogleReviews";
import { GOOGLE_PROFILE_URL } from "@/lib/google";
import { MAX_INPUT_LENGTHS } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import Seo from "@/components/Seo";

const RATE_LIMIT_MS = 10000; // 10 seconds between submissions

export default function Contact() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "", website: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [rateLimitError, setRateLimitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const waitSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
      setRateLimitError(t.contact.rateLimit.replace("{s}", waitSeconds));
      return;
    }
    setRateLimitError("");

    setSending(true);
    setLastSubmitTime(now);
    try {
      const { error: fnError } = await supabase.functions.invoke("submit-contact", {
        body: {
          name: form.name,
          email: form.email,
          company: form.company,
          service: form.service,
          message: form.message,
          lang,
          website: form.website, // honeypot — always empty for humans
        },
      });
      if (fnError) {
        const status = fnError.context?.status;
        setRateLimitError(status === 429 ? t.contact.rateLimited : t.contact.failed);
        return;
      }
      trackEvent("contact_submitted");
      setSent(true);
    } catch {
      setRateLimitError(t.contact.failed);
    } finally {
      setSending(false);
    }
  };

  // Build a mailto: fallback URL from form data
  const mailtoUrl = `mailto:contact@albwt.com?subject=${encodeURIComponent(t.contact.mailtoSubject.replace("{name}", form.name || "—").replace("{service}", form.service || "—"))}&body=${encodeURIComponent(`${t.contact.fullName}: ${form.name}\n${t.contact.email}: ${form.email}\n${t.contact.company}: ${form.company}\n${t.contact.service}: ${form.service}\n\n${t.contact.message}:\n${form.message}`)}`;

  return (
    <div className="pt-24 pb-20">
      <Seo
        title={{ en: "Hire Me — Start an AI Project", fr: "Me contacter — Lancer un projet IA" }}
        description={{
          en: "Tell me about your AI, machine learning or data project. Freelance engagements in Canada, Cameroon and remote.",
          fr: "Parlez-moi de votre projet d'IA, de machine learning ou de données. Missions indépendantes au Canada, au Cameroun et à distance.",
        }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"hsl(var(--primary))"}}>{t.contact.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-foreground">{t.contact.title}</h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-foreground font-bold mb-4">{t.contact.info}</h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{color:"hsl(var(--primary))"}} />
                  <span>contact@albwt.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{color:"hsl(var(--primary))"}} />
                  <span>{t.contact.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 flex-shrink-0" style={{color:"hsl(var(--primary))"}} />
                  <span>{t.contact.regions}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-foreground font-bold mb-4">{t.contact.connect}</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/womgaalbert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl text-foreground/80 hover:text-foreground hover:border-primary/50 transition-colors text-sm"
                >
                  <Github className="w-5 h-5" /> github.com/womgaalbert
                </a>
                <a
                  href="https://www.linkedin.com/in/albert-womga-009a7931/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl text-foreground/80 hover:text-foreground hover:border-primary/50 transition-colors text-sm"
                >
                  <Linkedin className="w-5 h-5" style={{color:"#0a66c2"}} /> albert-womga-009a7931
                </a>
                <a
                  href="https://x.com/albtchap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl text-foreground/80 hover:text-foreground hover:border-primary/50 transition-colors text-sm"
                >
                  <XLogo className="w-5 h-5" /> @albtchap
                </a>
                {GOOGLE_PROFILE_URL && (
                  <a
                    href={GOOGLE_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl text-foreground/80 hover:text-foreground hover:border-primary/50 transition-colors text-sm"
                  >
                    <GoogleLogo className="w-5 h-5" /> {t.contact.googleProfile}
                  </a>
                )}
                <GoogleReviewButton className="w-full" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-foreground font-bold mb-3">{t.contact.availability}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-700 dark:text-green-400 text-sm font-medium">{t.contact.available}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{t.contact.response}</p>
              <Link
                to="/booking"
                onClick={() => trackEvent("cta_click", { source: "contact_sidebar" })}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                style={{background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))"}}
              >
                <CalendarDays className="w-4 h-4" />
                {t.contact.scheduleMeeting}
              </Link>
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div className="bg-card border border-primary/30 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <CheckCircle className="w-16 h-16 mb-4" style={{color:"hsl(var(--primary))"}} />
                <h3 className="text-foreground font-bold text-xl mb-2">{t.contact.successTitle}</h3>
                <p className="text-muted-foreground">{t.contact.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
                {/* Honeypot — invisible to humans, bots fill it */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
                  <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({...form, website: e.target.value})} /></label>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm text-muted-foreground mb-2">{t.contact.fullName} *</label>
                    <input
                      id="contact-name"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors"
                      placeholder={t.contact.placeholderName}
                      maxLength={MAX_INPUT_LENGTHS.name}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm text-muted-foreground mb-2">{t.contact.email} *</label>
                    <input
                      id="contact-email"
                      autoComplete="email"
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors"
                      placeholder={t.contact.placeholderEmail}
                      maxLength={MAX_INPUT_LENGTHS.email}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-company" className="block text-sm text-muted-foreground mb-2">{t.contact.company}</label>
                  <input
                    id="contact-company"
                    value={form.company}
                    onChange={e => setForm({...form, company: e.target.value})}
                    className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors"
                    placeholder={t.contact.placeholderCompany}
                    maxLength={MAX_INPUT_LENGTHS.company}
                  />
                </div>
                <div>
                  <label htmlFor="contact-service" className="block text-sm text-muted-foreground mb-2">{t.contact.service}</label>
                  <select
                    id="contact-service"
                    value={form.service}
                    onChange={e => setForm({...form, service: e.target.value})}
                    className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors"
                  >
                    <option value="">{t.contact.selectService}</option>
                    {t.contact.serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm text-muted-foreground mb-2">{t.contact.message} *</label>
                  <textarea
                    id="contact-message"
                    required
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    rows={5}
                    className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors resize-none"
                    placeholder={t.contact.placeholderMessage}
                    maxLength={MAX_INPUT_LENGTHS.contactMessage}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white disabled:opacity-70"
                >
                  {sending ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t.contact.sending}</span>
                  ) : (
                    <><Send className="w-4 h-4" /> {t.contact.send}</>
                  )}
                </button>
                {rateLimitError && (
                  <p className="text-red-700 dark:text-red-400 text-sm text-center mt-2">{rateLimitError}</p>
                )}
                <div className="text-center">
                  <a
                    href={mailtoUrl}
                    className="text-primary text-sm hover:underline"
                  >
                    {t.contact.orEmail}
                  </a>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
