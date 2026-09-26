import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sanitizeUrl, MAX_INPUT_LENGTHS } from "@/lib/sanitize";
import { useLang } from "@/lib/LanguageContext";
import { getMockResponse } from "./consultantAnswers";

export default function AIConsultantChat() {
  const { t, lang } = useLang();
  const c = t.consultant;
  const [messages, setMessages] = useState([{ role: "assistant", content: c.welcome }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Re-render the greeting in the new language while the chat is untouched.
  useEffect(() => {
    setMessages((prev) => (prev.length === 1 ? [{ role: "assistant", content: c.welcome }] : prev));
  }, [c.welcome]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    setError(null);

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      const response = getMockResponse(userText, lang);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      setError(c.error);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reset = () => {
    setMessages([{ role: "assistant", content: c.welcome }]);
    setInput("");
    setError(null);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col" style={{ height: "600px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border" style={{ background: "hsl(var(--background))" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.13)" }}>
            <Bot className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
          </div>
          <div>
            <p className="text-foreground font-bold text-sm">{c.name}</p>
            <p className="text-muted-foreground text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              {c.demoMode}
            </p>
          </div>
        </div>
        <button type="button" onClick={reset} aria-label={c.reset} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted" title={c.reset}>
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {c.suggested.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all bg-background"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: msg.role === "user" ? "hsl(var(--brand-blue) / 0.13)" : "hsl(var(--primary) / 0.13)",
                }}
              >
                {msg.role === "user"
                  ? <User className="w-4 h-4" style={{ color: "hsl(var(--brand-blue))" }} />
                  : <Sparkles className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                }
              </div>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-brand-blue/10 border border-brand-blue/25 text-foreground/80 rounded-tr-sm"
                    : "bg-background border border-border text-foreground/80 rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant"
                  ? <ReactMarkdown
                      className="prose prose-sm max-w-none"
                      components={{
                        a: ({ children, href }) => (
                          <a href={sanitizeUrl(href) || "#"} target="_blank" rel="noopener noreferrer" style={{color: "hsl(var(--primary))"}}>
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  : msg.content
                }
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {error && (
          <div className="text-red-700 dark:text-red-400 text-xs text-center py-2">{error}</div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--primary) / 0.13)" }}>
              <Sparkles className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div className="bg-background border border-border px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-border" style={{ background: "hsl(var(--background))" }}>
        <div className="flex gap-3 items-end">
          <textarea
            aria-label={c.messageLabel}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={c.placeholder}
            rows={1}
            className="flex-1 bg-card border border-border text-foreground rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors resize-none placeholder-muted-foreground/60"
            maxLength={MAX_INPUT_LENGTHS.chatMessage}
            style={{ maxHeight: "100px" }}
          />
          <button
            type="button"
            aria-label={c.send}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-muted-foreground/70 text-xs mt-2 text-center">{c.hint}</p>
      </div>
    </div>
  );
}
