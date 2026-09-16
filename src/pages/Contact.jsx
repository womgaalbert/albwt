import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, Send, CheckCircle, Globe, CalendarDays } from "lucide-react";
import { MAX_INPUT_LENGTHS } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";

const RATE_LIMIT_MS = 10000; // 10 seconds between submissions

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [rateLimitError, setRateLimitError] = useState("");

  const services = [
    "Machine Learning Solutions",
    "Predictive Analytics & Forecasting",
    "NLP & Text Analytics",
    "Computer Vision",
    "Data Analysis & Visualization",
    "AI Strategy Consulting",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side rate limiting
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const waitSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
      setRateLimitError(`Please wait ${waitSeconds} second${waitSeconds !== 1 ? 's' : ''} before sending again.`);
      return;
    }
    setRateLimitError("");

    setSending(true);
    setLastSubmitTime(now);
    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({
          name: form.name,
          email: form.email,
          company: form.company,
          service: form.service,
          message: form.message,
        });
      if (insertError) throw insertError;
      setSent(true);
    } catch (err) {
      setRateLimitError("Failed to send message. Please try again later.");
    }
    setSending(false);
  };

  // Build a mailto: fallback URL from form data
  const mailtoUrl = `mailto:contact@albwt.com?subject=${encodeURIComponent(`Project Inquiry from ${form.name} — ${form.service}`)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nService: ${form.service}\n\nMessage:\n${form.message}`)}`;

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"#00d4b8"}}>Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-white">Let's Work Together</h1>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Ready to transform your data into competitive advantage? I'm available for projects across North America and Africa.
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
            <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Contact Info</h3>
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{color:"#00d4b8"}} />
                  <span>contact@albwt.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 flex-shrink-0" style={{color:"#00d4b8"}} />
                  <span>Ottawa, Canada (Remote Worldwide)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 flex-shrink-0" style={{color:"#00d4b8"}} />
                  <span>North America & Africa</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Connect</h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/womgaalbert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#0a0f1e] border border-[#1e2a3a] rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm"
                >
                  <Github className="w-5 h-5" /> github.com/womgaalbert
                </a>
                <a
                  href="https://www.linkedin.com/in/albert-womga-009a7931/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#0a0f1e] border border-[#1e2a3a] rounded-xl text-gray-300 hover:text-white hover:border-gray-600 transition-colors text-sm"
                >
                  <Linkedin className="w-5 h-5" style={{color:"#0a66c2"}} /> albert-womga-009a7931
                </a>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">Availability</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Available for new projects</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Response time: within 24 hours</p>
              <a
                href="https://calendly.com/womga-albert"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
                style={{background: "linear-gradient(135deg, #00d4b8, #0066ff)"}}
              >
                <CalendarDays className="w-4 h-4" />
                Schedule a Meeting
              </a>
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
              <div className="bg-[#111827] border border-teal-500/30 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <CheckCircle className="w-16 h-16 mb-4" style={{color:"#00d4b8"}} />
                <h3 className="text-white font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thank you for reaching out. I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-[#0a0f1e] border border-[#1e2a3a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                      placeholder="John Doe"
                      maxLength={MAX_INPUT_LENGTHS.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-[#0a0f1e] border border-[#1e2a3a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                      placeholder="john@company.com"
                      maxLength={MAX_INPUT_LENGTHS.email}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Company / Organization</label>
                  <input
                    value={form.company}
                    onChange={e => setForm({...form, company: e.target.value})}
                    className="w-full bg-[#0a0f1e] border border-[#1e2a3a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Your company name"
                    maxLength={MAX_INPUT_LENGTHS.company}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Service Needed</label>
                  <select
                    value={form.service}
                    onChange={e => setForm({...form, service: e.target.value})}
                    className="w-full bg-[#0a0f1e] border border-[#1e2a3a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                  >
                    <option value="">Select a service...</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    rows={5}
                    className="w-full bg-[#0a0f1e] border border-[#1e2a3a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors resize-none"
                    placeholder="Describe your project, goals, and timeline..."
                    maxLength={MAX_INPUT_LENGTHS.contactMessage}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white disabled:opacity-70"
                >
                  {sending ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</span>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
                {rateLimitError && (
                  <p className="text-red-400 text-sm text-center mt-2">{rateLimitError}</p>
                )}
                <div className="text-center">
                  <a
                    href={mailtoUrl}
                    className="text-teal-400 text-sm hover:underline"
                  >
                    Or send directly via email →
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
