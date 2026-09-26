// GitHub Project Analyzer — live agentic pipeline
// LangGraph.js graph running on Supabase Edge Functions (Deno).
//
// Graph: START → checkCache →(hit)→ END
//                          └→ rateLimit →(blocked)→ END
//                                    └→ fetchRepo → analyzeStructure → synthesizeReport → saveCache → END
// Cache hits cost nothing, so they are served before (and never count toward) the rate limit.
//
// Secrets (supabase secrets set):
//   LLM_API_KEY           — primary provider key (OpenAI-compatible; Groq by default)
//   LLM_BASE_URL          — default: https://api.groq.com/openai/v1
//   LLM_MODEL             — default: openai/gpt-oss-120b; if the provider retires it,
//                           the first available model in MODEL_FALLBACKS is used
//   LLM_FALLBACK_API_KEY  — optional backup provider, tried when the primary fails
//   LLM_FALLBACK_BASE_URL — default: https://integrate.api.nvidia.com/v1 (NVIDIA NIM)
//   LLM_FALLBACK_MODEL    — default: openai/gpt-oss-120b
//   RATE_LIMIT_PER_HOUR   — fresh analyses per visitor IP per hour, default 10
//   GITHUB_TOKEN          — optional, raises GitHub rate limit 60/hr → 5000/hr
//
// Resilience: if every LLM provider is unavailable the graph still returns the
// deterministic structural analysis — the public demo never hard-fails.

import { StateGraph, StateSchema, START, END } from "npm:@langchain/langgraph@1.4.17";
import { z } from "npm:zod@3.25.76";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN") || "";

type LlmProvider = { name: string; apiKey: string; baseUrl: string; model: string };

// Primary first, then the optional backup; providers without a key are skipped.
const LLM_PROVIDERS: LlmProvider[] = [
  {
    name: "primary",
    apiKey: Deno.env.get("LLM_API_KEY") || "",
    baseUrl: (Deno.env.get("LLM_BASE_URL") || "https://api.groq.com/openai/v1").replace(/\/$/, ""),
    model: Deno.env.get("LLM_MODEL") || "openai/gpt-oss-120b",
  },
  {
    name: "fallback",
    apiKey: Deno.env.get("LLM_FALLBACK_API_KEY") || "",
    baseUrl: (Deno.env.get("LLM_FALLBACK_BASE_URL") || "https://integrate.api.nvidia.com/v1").replace(/\/$/, ""),
    model: Deno.env.get("LLM_FALLBACK_MODEL") || "openai/gpt-oss-120b",
  },
].filter((p) => p.apiKey);

// Tried in order when a provider's model is unavailable (providers retire models often).
const MODEL_FALLBACKS = [
  "openai/gpt-oss-120b",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "moonshotai/kimi-k2-instruct",
  "qwen/qwen3-32b",
  "openai/gpt-oss-20b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "llama-3.1-8b-instant",
];
// Model ids that are not chat models and must never be auto-selected.
const NON_CHAT_MODEL = /whisper|tts|guard|embed|orpheus|playai|compound|prompt-guard/i;

const CACHE_TTL_HOURS = 24;
const RATE_LIMIT_PER_HOUR = Math.max(1, Number(Deno.env.get("RATE_LIMIT_PER_HOUR")) || 10);
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

const ALLOWED_ORIGINS = new Set([
  "https://albwt.com",
  "https://www.albwt.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

// ---------- Supabase REST helpers (service role) ----------

async function dbGet(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (!res.ok) throw new Error(`dbGet ${path}: ${res.status}`);
  return res.json();
}

async function dbUpsert(table: string, row: Record<string, unknown>, onConflict: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`dbUpsert ${table}: ${res.status}`);
}

// ---------- Rate limiting ----------

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfterMin: number }> {
  try {
    const rows = await dbGet(`agent_rate_limits?ip=eq.${encodeURIComponent(ip)}&select=window_start,count`);
    const now = Date.now();
    if (rows.length === 0) {
      await dbUpsert("agent_rate_limits", { ip, window_start: new Date(now).toISOString(), count: 1 }, "ip");
      return { allowed: true, retryAfterMin: 0 };
    }
    const windowStart = new Date(rows[0].window_start).getTime();
    const ageMin = (now - windowStart) / 60000;
    if (ageMin >= 60) {
      await dbUpsert("agent_rate_limits", { ip, window_start: new Date(now).toISOString(), count: 1 }, "ip");
      return { allowed: true, retryAfterMin: 0 };
    }
    if (rows[0].count >= RATE_LIMIT_PER_HOUR) {
      return { allowed: false, retryAfterMin: Math.ceil(60 - ageMin) };
    }
    await dbUpsert("agent_rate_limits", { ip, window_start: rows[0].window_start, count: rows[0].count + 1 }, "ip");
    return { allowed: true, retryAfterMin: 0 };
  } catch {
    // If the rate-limit store is down, allow but do not crash the demo.
    return { allowed: true, retryAfterMin: 0 };
  }
}

// ---------- GitHub fetch ----------

function ghHeaders() {
  const h: Record<string, string> = {
    "User-Agent": "albwt-agent",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (GITHUB_TOKEN) h.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return h;
}

async function fetchRepoData(repo: string) {
  const base = `https://api.github.com/repos/${repo}`;
  const metaRes = await fetch(base, { headers: ghHeaders() });
  if (metaRes.status === 404) return { error: "repo_not_found" };
  if (metaRes.status === 403 || metaRes.status === 429) return { error: "github_rate_limit" };
  if (!metaRes.ok) return { error: "github_error" };
  const meta = await metaRes.json();

  const [languages, readmeRes, treeRes] = await Promise.all([
    fetch(`${base}/languages`, { headers: ghHeaders() }).then((r) => (r.ok ? r.json() : {})),
    fetch(`${base}/readme`, { headers: { ...ghHeaders(), Accept: "application/vnd.github.raw" } }),
    fetch(`${base}/git/trees/${meta.default_branch}?recursive=1`, { headers: ghHeaders() }).then((r) => (r.ok ? r.json() : null)),
  ]);

  const readme = readmeRes.ok ? (await readmeRes.text()).slice(0, 6000) : "";
  const paths: string[] = treeRes?.tree
    ? treeRes.tree.filter((f: any) => f.type === "blob").map((f: any) => f.path).slice(0, 800)
    : [];

  return { meta, languages, readme, paths };
}

// ---------- Deterministic analysis ----------

function analyzeStructure(data: any) {
  const { meta, languages, paths, readme } = data;
  const totalBytes = Object.values(languages as Record<string, number>).reduce((a: number, b: number) => a + b, 0) || 1;
  const langShares = Object.entries(languages as Record<string, number>)
    .map(([name, bytes]) => ({ name, share: Math.round(((bytes as number) / totalBytes) * 100) }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 4);

  const lower = paths.map((p: string) => p.toLowerCase());
  const has = (pred: (p: string) => boolean) => lower.some(pred);

  const signals = {
    hasTests: has((p) => /(^|\/)(test|tests|__tests__|spec|specs)(\/|\.)/.test(p) || p.endsWith("_test.py") || p.endsWith(".test.js")),
    hasCI: has((p) => p.startsWith(".github/workflows/") || p.includes("gitlab-ci") || p.startsWith(".circleci/")),
    hasLicense: !!meta.license,
    hasDocker: has((p) => p === "dockerfile" || p.startsWith("docker/")),
    hasDocs: readme.length > 800 || has((p) => p.startsWith("docs/")),
    hasNotebooks: lower.filter((p) => p.endsWith(".ipynb")).length,
    hasLockfile: has((p) => ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock", "requirements.txt", "pyproject.toml"].includes(p)),
  };

  const depFiles = paths.filter((p: string) =>
    ["package.json", "requirements.txt", "pyproject.toml", "environment.yml", "Dockerfile", "docker-compose.yml", "tsconfig.json", "vite.config.js"].includes(p)
  );

  const extCounts: Record<string, number> = {};
  for (const p of lower) {
    const ext = p.includes(".") ? p.split(".").pop()! : "";
    if (ext) extCounts[ext] = (extCounts[ext] || 0) + 1;
  }
  const topExtensions = Object.entries(extCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([ext, n]) => `${ext} (${n})`);

  return {
    name: meta.name,
    fullName: meta.full_name,
    description: meta.description || "",
    topics: meta.topics || [],
    stars: meta.stargazers_count,
    forks: meta.forks_count,
    license: meta.license?.spdx_id || null,
    primaryLanguage: meta.language || langShares[0]?.name || "Unknown",
    langShares,
    fileCount: paths.length,
    topExtensions,
    depFiles,
    signals,
    pushedAt: meta.pushed_at,
    createdAt: meta.created_at,
    readme,
  };
}

// ---------- LLM synthesis (OpenAI-compatible: Groq / NVIDIA NIM) ----------

function buildPrompt(analysis: any, lang: string) {
  const s = analysis.signals;
  const signalsText = [
    `tests: ${s.hasTests ? "present" : "MISSING"}`,
    `CI/CD: ${s.hasCI ? "present" : "MISSING"}`,
    `license: ${analysis.license || "MISSING"}`,
    `docs: ${s.hasDocs ? "present" : "thin"}`,
    `docker: ${s.hasDocker ? "present" : "absent"}`,
    `notebooks: ${s.hasNotebooks}`,
  ].join("; ");

  const instructions = lang === "fr"
    ? `Tu es un analyste technique senior. Rédige en FRANÇAIS un rapport exécutif sur ce dépôt GitHub, en JSON strict avec les clés: "summary" (3-4 phrases), "stack" (liste de 4-8 technologies réelles détectées), "strengths" (3-5 points forts factuels), "risks" (2-4 risques ou faiblesses), "recommendations" (3-5 recommandations concrètes et actionnables). Réponds UNIQUEMENT avec le JSON, sans markdown.`
    : `You are a senior technical analyst. Write an executive report on this GitHub repository in ENGLISH, as strict JSON with keys: "summary" (3-4 sentences), "stack" (list of 4-8 real detected technologies), "strengths" (3-5 factual strengths), "risks" (2-4 risks or weaknesses), "recommendations" (3-5 concrete, actionable recommendations). Reply with ONLY the JSON, no markdown.`;

  return [
    { role: "system", content: instructions },
    {
      role: "user",
      content: `Repository: ${analysis.fullName}
Description: ${analysis.description || "(none)"}
Primary language: ${analysis.primaryLanguage}
Languages: ${analysis.langShares.map((l: any) => `${l.name} ${l.share}%`).join(", ")}
Topics: ${analysis.topics.join(", ") || "(none)"}
Stars: ${analysis.stars}, Forks: ${analysis.forks}
Files (sampled): ${analysis.fileCount}; top extensions: ${analysis.topExtensions.join(", ")}
Dependency/config files: ${analysis.depFiles.join(", ") || "(none found)"}
Quality signals: ${signalsText}
Created: ${analysis.createdAt}; Last push: ${analysis.pushedAt}

README excerpt:
${analysis.readme.slice(0, 4000)}`,
    },
  ];
}

function buildDeterministicReport(analysis: any, lang: string) {
  const s = analysis.signals;
  const strengths: string[] = [];
  const risks: string[] = [];
  const recommendations: string[] = [];
  const fr = lang === "fr";

  if (s.hasDocs) strengths.push(fr ? "Documentation de projet présente (README détaillé)" : "Project documentation present (detailed README)");
  if (s.hasTests) strengths.push(fr ? "Suite de tests incluse" : "Test suite included");
  if (s.hasCI) strengths.push(fr ? "Pipeline CI/CD configuré" : "CI/CD pipeline configured");
  if (analysis.license) strengths.push(fr ? `Licence ${analysis.license} clairement définie` : `${analysis.license} license clearly defined`);
  if (s.hasLockfile) strengths.push(fr ? "Dépendances épinglées (reproductibilité)" : "Pinned dependencies (reproducibility)");
  if (s.hasNotebooks > 0) strengths.push(fr ? `${s.hasNotebooks} notebook(s) Jupyter — analyse exploratoire reproductible` : `${s.hasNotebooks} Jupyter notebook(s) — reproducible exploratory analysis`);
  if (strengths.length === 0) strengths.push(fr ? "Base de code focalisée sur le domaine métier" : "Domain-focused codebase");

  if (!s.hasTests) risks.push(fr ? "Aucune suite de tests détectée" : "No test suite detected");
  if (!s.hasCI) risks.push(fr ? "Pas d'intégration continue (CI)" : "No continuous integration (CI)");
  if (!analysis.license) risks.push(fr ? "Licence absente — réutilisation juridiquement incertaine" : "No license — legal reuse unclear");
  if (!s.hasDocs) risks.push(fr ? "Documentation minimale" : "Minimal documentation");

  if (!s.hasTests) recommendations.push(fr ? "Ajouter des tests unitaires (pytest / vitest) sur les modules critiques" : "Add unit tests (pytest / vitest) on critical modules");
  if (!s.hasCI) recommendations.push(fr ? "Mettre en place GitHub Actions (lint + tests à chaque push)" : "Set up GitHub Actions (lint + tests on every push)");
  if (!analysis.license) recommendations.push(fr ? "Ajouter une licence (MIT ou Apache-2.0)" : "Add a license (MIT or Apache-2.0)");
  if (!s.hasLockfile) recommendations.push(fr ? "Épingler les dépendances (lockfile ou requirements.txt)" : "Pin dependencies (lockfile or requirements.txt)");
  recommendations.push(fr ? "Documenter l'architecture et les décisions techniques dans le README" : "Document architecture and technical decisions in the README");

  const summary = fr
    ? `${analysis.fullName} est un projet ${analysis.primaryLanguage} ${analysis.description ? `dédié à : ${analysis.description}.` : "sans description fournie."} Le code est principalement composé de ${analysis.langShares.map((l: any) => `${l.name} (${l.share}%)`).join(", ")}. L'analyse structurelle porte sur ${analysis.fileCount} fichiers échantillonnés avec les signaux de qualité listés ci-dessous.`
    : `${analysis.fullName} is a ${analysis.primaryLanguage} project ${analysis.description ? `focused on: ${analysis.description}.` : "with no description provided."} The codebase is primarily ${analysis.langShares.map((l: any) => `${l.name} (${l.share}%)`).join(", ")}. This structural analysis covers ${analysis.fileCount} sampled files with the quality signals listed below.`;

  return {
    summary,
    stack: analysis.langShares.map((l: any) => l.name).concat(analysis.depFiles.map((f: string) => f.replace(/\..*$/, ""))),
    strengths,
    risks,
    recommendations,
  };
}

async function resolveFallbackModel(p: LlmProvider): Promise<string | null> {
  try {
    const res = await fetch(`${p.baseUrl}/models`, {
      headers: { Authorization: `Bearer ${p.apiKey}` },
    });
    if (!res.ok) return null;
    const ids: string[] = ((await res.json()).data || [])
      .filter((m: any) => m.active !== false)
      .map((m: any) => String(m.id));
    const preferred = MODEL_FALLBACKS.find((m) => m !== p.model && ids.includes(m));
    return preferred ?? ids.find((id) => id !== p.model && !NON_CHAT_MODEL.test(id)) ?? null;
  } catch {
    return null;
  }
}

function callLlm(p: LlmProvider, analysis: any, lang: string) {
  return fetch(`${p.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${p.apiKey}` },
    body: JSON.stringify({
      model: p.model,
      messages: buildPrompt(analysis, lang),
      temperature: 0.3,
      max_tokens: 2500,
    }),
    signal: AbortSignal.timeout(45_000),
  });
}

/** One provider attempt → a validated report, or null (the reason is logged). */
async function tryProvider(p: LlmProvider, analysis: any, lang: string) {
  try {
    let res = await callLlm(p, analysis, lang);
    if (res.status === 404) {
      await res.body?.cancel();
      const fallback = await resolveFallbackModel(p);
      console.warn(`llm ${p.name}: model ${p.model} unavailable, switching to ${fallback}`);
      if (!fallback) return null;
      p.model = fallback; // remembered for later requests on this instance
      res = await callLlm(p, analysis, lang);
    }
    if (!res.ok) {
      console.error(`llm ${p.name} http error`, res.status, (await res.text()).slice(0, 300));
      return null;
    }
    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`llm ${p.name} returned no JSON`, text.slice(0, 300));
      return null;
    }
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.summary || !Array.isArray(parsed.strengths)) {
      console.error(`llm ${p.name} returned an incomplete report`);
      return null;
    }
    return {
      summary: String(parsed.summary),
      stack: (parsed.stack || []).map(String).slice(0, 8),
      strengths: (parsed.strengths || []).map(String).slice(0, 5),
      risks: (parsed.risks || []).map(String).slice(0, 4),
      recommendations: (parsed.recommendations || []).map(String).slice(0, 5),
    };
  } catch (err) {
    console.error(`llm ${p.name} call failed`, err);
    return null;
  }
}

async function synthesizeWithLlm(analysis: any, lang: string) {
  for (const p of LLM_PROVIDERS) {
    const report = await tryProvider(p, analysis, lang);
    if (report) return { report, llmUsed: true, model: p.model };
  }
  return { report: buildDeterministicReport(analysis, lang), llmUsed: false, model: null };
}

// ---------- LangGraph state & nodes ----------

const Step = z.object({ id: z.string(), ms: z.number() });

const AgentState = new StateSchema({
  repo: z.string(),
  lang: z.string().default("en"),
  ip: z.string().default("unknown"),
  cached: z.boolean().default(false),
  retryAfterMin: z.number().default(0),
  github: z.any().optional(),
  analysis: z.any().optional(),
  report: z.any().optional(),
  llmUsed: z.boolean().default(false),
  model: z.string().nullable().default(null),
  steps: z.array(Step).default(() => []),
  error: z.string().nullable().default(null),
});

function timed(state: typeof AgentState.State, id: string, startedAt: number) {
  return { steps: [...state.steps, { id, ms: Math.round(performance.now() - startedAt) }] };
}

const checkCache = async (state: typeof AgentState.State) => {
  const t0 = performance.now();
  try {
    const since = new Date(Date.now() - CACHE_TTL_HOURS * 3600_000).toISOString();
    const rows = await dbGet(
      `repo_analyses?repo=eq.${encodeURIComponent(state.repo)}&lang=eq.${state.lang}&created_at=gte.${encodeURIComponent(since)}&select=result,model&limit=1`
    );
    if (rows.length > 0) {
      return {
        cached: true,
        report: rows[0].result,
        model: rows[0].model,
        llmUsed: !!rows[0].model,
        ...timed(state, "cache", t0),
      };
    }
  } catch { /* cache miss on error */ }
  return { cached: false, ...timed(state, "cache", t0) };
};

// Only fresh runs (which spend GitHub + LLM quota) count toward the per-IP limit.
const rateLimit = async (state: typeof AgentState.State) => {
  const limit = await checkRateLimit(state.ip);
  return limit.allowed ? {} : { error: "rate_limited", retryAfterMin: limit.retryAfterMin };
};

const fetchRepo = async (state: typeof AgentState.State) => {
  const t0 = performance.now();
  const data = await fetchRepoData(state.repo);
  if ("error" in data) {
    return { error: data.error, ...timed(state, "fetch", t0) };
  }
  return { github: data, ...timed(state, "fetch", t0) };
};

const analyze = async (state: typeof AgentState.State) => {
  const t0 = performance.now();
  const analysis = analyzeStructure(state.github);
  return { analysis, ...timed(state, "analyze", t0) };
};

const synthesize = async (state: typeof AgentState.State) => {
  const t0 = performance.now();
  const { report, llmUsed, model } = await synthesizeWithLlm(state.analysis, state.lang);
  return { report, llmUsed, model, ...timed(state, "synthesize", t0) };
};

const saveCache = async (state: typeof AgentState.State) => {
  // Don't pin a deterministic fallback for 24h; retry the LLM on the next call.
  if (!state.llmUsed) return {};
  try {
    await dbUpsert("repo_analyses", {
      repo: state.repo,
      lang: state.lang,
      result: state.report,
      model: state.model,
      // Upsert keeps the original row, so refresh the TTL anchor explicitly.
      created_at: new Date().toISOString(),
    }, "repo,lang");
  } catch { /* caching is best-effort */ }
  return {};
};

const graph = new StateGraph(AgentState)
  .addNode("checkCache", checkCache)
  .addNode("rateLimit", rateLimit)
  .addNode("fetchRepo", fetchRepo)
  .addNode("analyze", analyze)
  .addNode("synthesize", synthesize)
  .addNode("saveCache", saveCache)
  .addEdge(START, "checkCache")
  .addConditionalEdges("checkCache", (state) => (state.cached ? END : "rateLimit"), {
    [END]: END,
    rateLimit: "rateLimit",
  })
  .addConditionalEdges("rateLimit", (state) => (state.error ? END : "fetchRepo"), {
    [END]: END,
    fetchRepo: "fetchRepo",
  })
  .addConditionalEdges("fetchRepo", (state) => (state.error ? END : "analyze"), {
    [END]: END,
    analyze: "analyze",
  })
  .addEdge("analyze", "synthesize")
  .addEdge("synthesize", "saveCache")
  .addEdge("saveCache", END)
  .compile();

// ---------- HTTP handler ----------

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : null;
  return {
    "Access-Control-Allow-Origin": allowed ?? "https://albwt.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

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

  const repo = String(body?.repo || "").trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "");
  const lang = body?.lang === "fr" ? "fr" : "en";
  if (!REPO_RE.test(repo) || repo.length > 120) {
    return json({ error: "invalid_repo" }, 400, origin);
  }

  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();

  const startedAt = performance.now();
  try {
    const result = await graph.invoke({ repo, lang, ip });
    if (result.error === "rate_limited") {
      return json({ error: "rate_limited", retryAfterMin: result.retryAfterMin }, 429, origin);
    }
    if (result.error === "repo_not_found") return json({ error: "repo_not_found" }, 404, origin);
    if (result.error === "github_rate_limit") return json({ error: "github_rate_limit" }, 503, origin);
    if (result.error) return json({ error: "github_error" }, 502, origin);

    return json(
      {
        report: result.report,
        meta: {
          cached: result.cached,
          llmUsed: result.llmUsed,
          model: result.model,
          steps: result.steps,
          durationMs: Math.round(performance.now() - startedAt),
        },
      },
      200,
      origin
    );
  } catch (err) {
    console.error("agent error", err);
    return json({ error: "internal_error" }, 500, origin);
  }
});
