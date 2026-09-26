import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import { sanitizeUrl, MAX_INPUT_LENGTHS } from "@/lib/sanitize";
import { useLang } from "@/lib/LanguageContext";
import { createPageUrl } from "@/utils";
import { trackEvent } from "@/lib/analytics";
import { getMockResponse } from "@/components/sandbox/consultantAnswers";

// Pages that already have their own contact form.
const HIDDEN_ON = new Set(["Contact", "Booking"]);

const LEAD_KEY = "albwt_lead"; // { name, capturedAt } — skips the form for 30 days
const LEAD_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const TEASER_KEY = "albwt_teaser_dismissed"; // teaser shows once per visitor
const TEASER_DELAY_MS = 25_000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Must match supabase/functions/submit-lead
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function getStoredLead() {
  try {
    const d = JSON.parse(readStorage(LEAD_KEY) || "{}");
    if (d?.capturedAt && Date.now() - d.capturedAt < LEAD_TTL_MS) return d;
  } catch {}
  return null;
}

const firstName = (name) => (name || "").trim().split(/\s+/)[0];

const EMPTY_FORM = { name: "", email: "", phone: "", message: "", website: "" };

export default function LeadWidget({ currentPageName }) {
  const { t, lang } = useLang();
  const w = t.leadWidget;
  const reduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("lead");
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);

  const initializedRef = useRef(false);
  const firstFieldRef = useRef(null);
  const chatInputRef = useRef(null);
  const bottomRef = useRef(null);
  const buttonRef = useRef(null);

  const hidden = HIDDEN_ON.has(currentPageName);

  // First open decides the step: returning leads go straight to chat.
  useEffect(() => {
    if (!isOpen || initializedRef.current) return;
    initializedRef.current = true;
    const stored = getStoredLead();
    if (stored) {
      setStep("chat");
      setMessages([{ role: "assistant", content: w.welcomeBack.replace("{name}", firstName(stored.name)) }]);
    } else {
      setMessages([{ role: "assistant", content: w.greeting }]);
    }
  }, [isOpen, w]);

  // Focus the first useful control whenever the panel opens or the step changes.
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => (step === "lead" ? firstFieldRef.current : chatInputRef.current)?.focus(), 150);
    return () => clearTimeout(id);
  }, [isOpen, step]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "end" });
  }, [messages, loading, step, reduceMotion]);

  // Esc closes the panel and returns focus to the button.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Any CTA on the site can open the widget: window.dispatchEvent(new Event("open-lead-widget"))
  useEffect(() => {
    const open = () => openWidget();
    window.addEventListener("open-lead-widget", open);
    return () => window.removeEventListener("open-lead-widget", open);
  }, []);

  // Teaser: after TEASER_DELAY_MS or half-page scroll, once per visitor.
  useEffect(() => {
    if (hidden || isOpen || readStorage(TEASER_KEY) || getStoredLead()) return;
    const show = () => setTeaserVisible(true);
    const timer = setTimeout(show, TEASER_DELAY_MS);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hidden, isOpen]);

  const dismissTeaser = () => {
    setTeaserVisible(false);
    writeStorage(TEASER_KEY, "1");
  };

  function openWidget() {
    trackEvent("widget_open");
    setIsOpen(true);
    setTeaserVisible(false);
    writeStorage(TEASER_KEY, "1");
  }

  const toggle = () => (isOpen ? setIsOpen(false) : openWidget());

  const submitLead = async (e) => {
    e.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (name.length < 2) return setFormError(w.errName);
    if (!email && !phone) return setFormError(w.errContact);
    if (email && !EMAIL_RE.test(email)) return setFormError(w.errEmail);
    if (phone && !(PHONE_RE.test(phone) && phone.replace(/\D/g, "").length >= 7)) return setFormError(w.errPhone);

    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          name,
          email,
          phone,
          message: form.message.trim(),
          lang,
          page: window.location.pathname,
          website: form.website, // honeypot — always empty for humans
        },
      });
      if (error) {
        const status = error.context?.status;
        setFormError(status === 429 ? w.errRate : w.errGeneric);
        return;
      }
      writeStorage(LEAD_KEY, JSON.stringify({ name, capturedAt: Date.now() }));
      trackEvent("lead_submitted");
      setForm(EMPTY_FORM);
      setStep("chat");
      setMessages((prev) => [...prev, { role: "assistant", content: w.thanks.replace("{name}", firstName(name)) }]);
    } catch {
      setFormError(w.errGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const skipLead = () => {
    setStep("chat");
    setMessages((prev) => [...prev, { role: "assistant", content: w.chatIntro }]);
  };

  const sendMessage = async (text) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500 + Math.random() * 700));
    setMessages((prev) => [...prev, { role: "assistant", content: getMockResponse(userText, lang) }]);
    setLoading(false);
  };

  if (hidden) return null;

  const hasUserMessage = messages.some((m) => m.role === "user");
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.98 } };
  const inputClass =
    "w-full bg-background border border-border text-foreground rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            {...panelMotion}
            transition={{ duration: 0.22, ease: "easeOut" }}
            role="dialog"
            aria-label={w.title}
            className="fixed z-40 bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:w-[370px] flex flex-col bg-card border border-border rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden origin-bottom-right"
            style={{ maxHeight: "min(580px, calc(100vh - 120px))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--brand-blue) / 0.12))" }}>
              <div className="flex items-center gap-3">
                <img src="/logo-awt-96.webp" alt="" width="36" height="36" className="w-9 h-9 rounded-full bg-background object-contain border border-border" />
                <div>
                  <p className="text-foreground font-bold text-sm leading-tight">{w.title}</p>
                  <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70 inline-block" />
                    {w.status}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label={w.close} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-brand-blue/10 border border-brand-blue/25 text-foreground rounded-br-sm"
                        : "bg-background border border-border text-foreground/85 rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1">
                        <ReactMarkdown
                          components={{
                            a: ({ children, href }) => (
                              <a href={sanitizeUrl(href) || "#"} target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--primary))" }}>
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {step === "lead" && (
                <form onSubmit={submitLead} noValidate className="bg-background border border-border rounded-xl p-3.5 space-y-2.5">
                  <p className="text-sm font-semibold text-foreground">{w.formTitle}</p>
                  <input ref={firstFieldRef} type="text" autoComplete="name" value={form.name} maxLength={80}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={w.namePlaceholder} aria-label={w.name} className={inputClass} />
                  <input type="email" autoComplete="email" inputMode="email" value={form.email} maxLength={254}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={w.emailPlaceholder} aria-label={w.email} className={inputClass} />
                  <input type="tel" autoComplete="tel" inputMode="tel" value={form.phone} maxLength={20}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={w.phonePlaceholder} aria-label={w.phone} className={inputClass} />
                  <p className="text-xs text-muted-foreground -mt-1">{w.contactHint}</p>
                  <textarea rows={2} value={form.message} maxLength={1000}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={w.messagePlaceholder} aria-label={w.message} className={`${inputClass} resize-none`} />

                  {/* Honeypot — invisible to humans, bots fill it */}
                  <input type="text" name="website" value={form.website} tabIndex={-1} autoComplete="off" aria-hidden="true"
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="absolute -left-[9999px] w-px h-px opacity-0" />

                  {formError && (
                    <div role="alert" className="text-xs text-red-700 dark:text-red-400 [&_a]:underline">
                      <ReactMarkdown>{formError}</ReactMarkdown>
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    className="btn-primary w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? (
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{w.submitting}</>
                    ) : (
                      <><Send className="w-4 h-4" />{w.submit}</>
                    )}
                  </button>
                  <button type="button" onClick={skipLead} className="w-full text-xs text-muted-foreground hover:text-primary underline underline-offset-2 transition-colors">
                    {w.skip}
                  </button>
                  <p className="text-[11px] text-muted-foreground/80 text-center">{w.privacy}</p>
                </form>
              )}

              {step === "chat" && !hasUserMessage && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {t.consultant.suggested.slice(3, 6).map((q) => (
                    <button key={q} type="button" onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-left">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-background border border-border px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Footer: chat input + booking CTA */}
            {step === "chat" && (
              <div className="border-t border-border px-3 pt-3 pb-2 flex-shrink-0 bg-card">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                  <input ref={chatInputRef} type="text" value={input} maxLength={MAX_INPUT_LENGTHS.chatMessage}
                    onChange={(e) => setInput(e.target.value)} placeholder={w.placeholder} aria-label={w.placeholder}
                    disabled={loading} className={`${inputClass} flex-1 disabled:opacity-60`} />
                  <button type="submit" aria-label={w.send} disabled={loading || !input.trim()}
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))" }}>
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
                <Link
                  to={createPageUrl("Booking")}
                  onClick={() => {
                    trackEvent("cta_click", { source: "widget" });
                    setIsOpen(false);
                  }}
                  className="block text-center text-xs font-semibold mt-2 hover:underline"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {w.bookCall}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaser bubble */}
      <AnimatePresence>
        {teaserVisible && !isOpen && (
          <motion.div
            key="teaser"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed z-40 bottom-24 right-6 max-w-[260px] flex items-start gap-2 bg-card border border-border rounded-2xl rounded-br-sm shadow-xl shadow-black/10 dark:shadow-black/40 pl-4 pr-2 py-3"
          >
            <button type="button" onClick={openWidget} className="text-sm text-foreground text-left leading-snug">
              <Sparkles className="w-3.5 h-3.5 inline -mt-0.5 mr-1" style={{ color: "hsl(var(--primary))" }} />
              {w.teaser}
            </button>
            <button type="button" onClick={dismissTeaser} aria-label={w.dismissTeaser} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? w.close : w.open}
        className="btn-primary fixed z-40 bottom-6 right-6 w-14 h-14 rounded-full shadow-xl shadow-black/15 flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
      >
        <span className="sr-only">{isOpen ? w.close : w.open}</span>
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && teaserVisible && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-red-500 border-2 border-background" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
