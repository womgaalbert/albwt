import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database, Github, ScanSearch, Sparkles, CheckCircle,
  AlertTriangle, ArrowRight, Loader2, Play, Clock, Zap,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageContext";

const MY_REPOS = [
  "womgaalbert/Energy-ARIMA-Forecasting",
  "womgaalbert/Detect-Behavior-with-Sensor-Data",
  "womgaalbert/transformer-time-series-prediction",
  "womgaalbert/Convnet-On-CIFAR-10",
  "womgaalbert/Student-Plurilingual-Representation-French-Learning",
  "womgaalbert/albert.womga.io",
];

const STEP_DEFS = [
  { id: "cache", Icon: Database, color: "hsl(var(--brand-blue))" },
  { id: "fetch", Icon: Github, color: "hsl(var(--primary))" },
  { id: "analyze", Icon: ScanSearch, color: "#8b5cf6" },
  { id: "synthesize", Icon: Sparkles, color: "#f59e0b" },
];

export default function RepoAnalyzer() {
  const { t, lang } = useLang();
  const [repo, setRepo] = useState("");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 100), 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  // Which trace node is "active" while waiting (staged animation)
  const activeIdx = !running ? -1 : elapsed < 400 ? 0 : elapsed < 1500 ? 1 : elapsed < 3000 ? 2 : 3;

  const analyze = async (target) => {
    const value = (target ?? repo).trim();
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) {
      setError({ code: "invalidRepo" });
      setResult(null);
      return;
    }
    setRepo(value);
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("github-analyzer", {
        body: { repo: value, lang },
      });
      if (fnError) {
        let code = "generic";
        let retryAfterMin = null;
        try {
          const body = await fnError.context?.json();
          if (body?.error === "rate_limited") { code = "rateLimited"; retryAfterMin = body.retryAfterMin; }
          else if (body?.error === "repo_not_found") code = "repoNotFound";
          else if (body?.error === "github_rate_limit") code = "githubRateLimit";
          else if (body?.error === "invalid_repo") code = "invalidRepo";
        } catch { /* non-JSON error body */ }
        setError({ code, retryAfterMin });
        return;
      }
      setResult(data);
    } catch {
      setError({ code: "generic" });
    } finally {
      setRunning(false);
    }
  };

  const stepMs = (id) => result?.meta?.steps?.find((s) => s.id === id)?.ms;
  const errorText = error
    ? (error.code === "rateLimited"
        ? t.sandbox.errors.rateLimited.replace("{m}", error.retryAfterMin ?? "60")
        : t.sandbox.errors[error.code] || t.sandbox.errors.generic)
    : null;

  return (
    <div className="bg-card border border-primary/30 rounded-2xl overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.15)" }}>
            <Github className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-bold text-sm">{t.sandbox.title}</p>
            <p className="text-muted-foreground text-xs">{t.sandbox.poweredBy}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {t.sandbox.badge}
        </span>
      </div>

      <div className="p-6">
        {/* Input row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            aria-label={t.sandbox.placeholder}
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !running && analyze()}
            placeholder={t.sandbox.placeholder}
            disabled={running}
            className="flex-1 bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors disabled:opacity-60 font-mono"
            maxLength={120}
          />
          <button
            onClick={() => analyze()}
            disabled={running || !repo.trim()}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-50 flex-shrink-0"
          >
            {running ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {t.sandbox.analyzing}</>
            ) : (
              <><Play className="w-4 h-4" /> {t.sandbox.analyze}</>
            )}
          </button>
        </div>

        {/* Quick select */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-2">{t.sandbox.quickSelect}</p>
          <div className="flex flex-wrap gap-2">
            {MY_REPOS.map((r) => (
              <button
                key={r}
                onClick={() => !running && analyze(r)}
                disabled={running}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/50 transition-all disabled:opacity-50 font-mono"
              >
                {r.split("/")[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Agent trace */}
        {(running || result || error) && (
          <div className="mb-6 rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center justify-between">
              {STEP_DEFS.map((step, i) => {
                const realMs = result ? stepMs(step.id) : undefined;
                const isDone = result && realMs !== undefined;
                const isActive = running && i === activeIdx;
                const isPending = running ? i > activeIdx : !result;
                const skipped = result && realMs === undefined;
                return (
                  <div key={step.id} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isDone ? "border-transparent" : isActive ? "border-current animate-pulse" : "border-border"
                        } ${isPending || skipped ? "opacity-40" : ""}`}
                        style={{
                          background: isDone ? `color-mix(in srgb, ${step.color} 12%, transparent)` : "transparent",
                          color: isDone || isActive ? step.color : "hsl(var(--muted-foreground))",
                          boxShadow: isActive ? `0 0 16px color-mix(in srgb, ${step.color} 38%, transparent)` : "none",
                        }}
                      >
                        {isDone ? <CheckCircle className="w-4 h-4" /> : <step.Icon className="w-4 h-4" />}
                      </div>
                      <p className={`text-[10px] mt-1.5 font-medium text-center leading-tight ${isDone || isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {t.sandbox.steps[step.id]}
                      </p>
                      {isDone && <p className="text-[10px] text-muted-foreground">{realMs}ms</p>}
                      {isActive && <p className="text-[10px] text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin inline" /></p>}
                    </div>
                    {i < STEP_DEFS.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 rounded ${isDone ? "bg-primary/60" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
            {running && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                <Clock className="w-3 h-3 inline mr-1" />{(elapsed / 1000).toFixed(1)}s
              </p>
            )}
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {errorText && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-2"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {errorText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium border ${
                  result.meta.cached
                    ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30"
                    : "bg-primary/10 text-primary border-primary/30"
                }`}>
                  <Zap className="w-3 h-3" />
                  {result.meta.cached ? t.sandbox.report.cached : t.sandbox.report.live}
                </span>
                {!result.meta.llmUsed && (
                  <span className="px-3 py-1 rounded-full font-medium border bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30">
                    {t.sandbox.report.deterministic}
                  </span>
                )}
                <span className="text-muted-foreground ml-auto">
                  {t.sandbox.report.duration} {(result.meta.durationMs / 1000).toFixed(1)}s
                  {result.meta.model ? ` · ${result.meta.model}` : ""}
                </span>
              </div>

              <div>
                <h4 className="text-foreground font-bold text-sm mb-2 uppercase tracking-wide" style={{ color: "hsl(var(--primary))" }}>
                  {t.sandbox.report.summary}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{result.report.summary}</p>
              </div>

              {result.report.stack?.length > 0 && (
                <div>
                  <h4 className="text-foreground font-bold text-sm mb-2 uppercase tracking-wide" style={{ color: "hsl(var(--primary))" }}>
                    {t.sandbox.report.stack}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.report.stack.map((tech) => (
                      <span key={tech} className="text-xs px-3 py-1 rounded-full bg-background border border-border text-foreground/80">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                {result.report.strengths?.length > 0 && (
                  <ReportList
                    title={t.sandbox.report.strengths}
                    items={result.report.strengths}
                    Icon={CheckCircle}
                    color="#10b981"
                  />
                )}
                {result.report.risks?.length > 0 && (
                  <ReportList
                    title={t.sandbox.report.risks}
                    items={result.report.risks}
                    Icon={AlertTriangle}
                    color="#f59e0b"
                  />
                )}
                {result.report.recommendations?.length > 0 && (
                  <ReportList
                    title={t.sandbox.report.recommendations}
                    items={result.report.recommendations}
                    Icon={ArrowRight}
                    color="hsl(var(--brand-blue))"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReportList({ title, items, Icon, color }) {
  return (
    <div className="bg-background/60 border border-border rounded-xl p-4">
      <h5 className="font-bold text-xs mb-3 uppercase tracking-wide" style={{ color }}>{title}</h5>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
            <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
