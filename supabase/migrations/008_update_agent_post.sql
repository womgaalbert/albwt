-- ============================================================
-- 008: Update the AI agent post — cache-first rate limiting,
--      Groq → NVIDIA NIM failover, retired-model recovery, diagrams
-- ============================================================

UPDATE blog_posts SET
  excerpt = $md$My live AI agent broke in production this week, and the model was not the problem: the provider retired it and my code swallowed the error. Here is how I rebuilt it for the failures that actually happen in 2026 — rate limits, retired models and provider outages — with cache-first rate limiting, Groq → NVIDIA NIM failover and a deterministic backstop, still at $0/month.$md$,
  read_time = 10,
  tags = ARRAY['LangGraph', 'AI Agents', 'Serverless', 'Supabase', 'Rate Limiting', 'LLM Failover', 'Groq', 'NVIDIA NIM'],
  updated_at = now(),
  content = $md$# How I Shipped a Production AI Agent on Serverless

Everyone demos agents. Almost nobody ships one that strangers can use, that never breaks, and that costs $0/month.

I shipped one. It lives on my portfolio, on the [Sandbox page](/Sandbox). You can point it at any public GitHub repository and watch a real agent pipeline run: cache check → rate limit → repo fetch → structural analysis → LLM synthesis. This post is about the unglamorous 80% — the decisions that separate a demo from something you can put in front of clients.

And this week, it taught me the most important lesson of all.

## It broke — and the model was not the problem

I clicked **Analyze** on my own site and got a report without the AI summary. No error page, no crash: the deterministic fallback did its job. But the LLM had silently stopped working.

The cause took minutes to find once I could see it, and it had nothing to do with prompts or model quality. My provider had **retired the model** my code was pinned to. Every call came back `404 model_not_found`, and a bare `catch {}` swallowed it.

That is exactly what the industry data says. Datadog's *State of AI Engineering* report (July 2026) found that teams are quick to test new models but "slower to retire older models already running in production" — and providers are not waiting for them. If your agent hard-codes a model name, it has an expiry date you do not control.

## The architecture

The whole thing runs on **Supabase Edge Functions** (Deno), orchestrated by **LangGraph.js**. The graph now has six nodes:

![The agent graph: checkCache, rateLimit, fetchRepo, analyze, synthesize, saveCache. Only synthesize calls an LLM.](/images/blog/agent-serverless/pipeline.svg)

Five of the six steps are plain code. Only one calls an LLM. That ratio is deliberate:

1. **checkCache** — a 24-hour cache in Postgres. Repeated analyses cost nothing and return in about 0.6 s.
2. **rateLimit** — a per-IP limit, applied only to fresh runs (more on this below).
3. **fetchRepo** — four parallel GitHub API calls: metadata, languages, README, file tree.
4. **analyzeStructure** — pure code: language distribution, dependency files and quality signals (tests? CI? license? docs? lockfiles?). Zero tokens.
5. **synthesizeReport** — the only LLM call, with a two-provider failover.
6. **saveCache** — stores AI reports only, so a fallback report is never pinned for 24 hours.

Because only one node needs an LLM, the system is fast (about 2.5 s for a fresh AI report), cheap and resilient — the three properties demos rarely have.

## Rate limits are the real failure mode

Here is the number that changed how I think about agents in production:

![Datadog, State of AI Engineering 2026: in February 2026, 5% of LLM calls returned an error and 60% of those errors were rate limits.](/images/blog/agent-serverless/rate-limit-errors.svg)

In February 2026, Datadog saw 5% of all LLM call spans return an error, and **60% of those errors were caused by exceeded rate limits** — the provider saying "too many requests".

Rate limits bite you from two sides. Upstream, your provider throttles you. Downstream, your own public endpoint needs a limit, or one bot can burn your whole free quota.

My first version got the downstream side wrong. I capped visitors at 3 runs per hour and checked the limit *before* the cache — so re-opening a report that was already cached, which costs nothing, still used up one of your three tries. I hit my own limit while testing.

The fix is one of those small ideas that matters a lot: **check the cheap thing first.**

![Cache-first rate limiting: cache hits return immediately and are not counted; only fresh runs go through the limiter.](/images/blog/agent-serverless/cache-first-rate-limit.svg)

- Cache hits are served before the limiter and never count.
- Only fresh runs, the ones that spend GitHub and LLM quota, count toward the limit.
- The limit is now **10 fresh runs per hour per IP**, and it is a setting (`RATE_LIMIT_PER_HOUR`), not a constant — I can tune it from the dashboard without redeploying.

In LangGraph terms, the rate limiter simply became a node *after* `checkCache`. The graph shape does the policy work.

## Two providers, zero lock-in

The post-mortem left me with two rules: never depend on one provider, and never depend on one model name.

![LLM failover chain: Groq first, then NVIDIA NIM, then a deterministic structural report. A retired model triggers a lookup of available models and one retry.](/images/blog/agent-serverless/llm-failover.svg)

1. **Groq is the primary** — fast, with a free tier that resets daily.
2. **NVIDIA NIM is the backup**, running on free credits. It is only called when Groq fails, so the credits last.
3. **The deterministic structural report is the backstop.** If both providers are down, the visitor still gets a useful report — never an error page.

On top of that, each provider recovers from retired models on its own: on a `404`, the agent asks the provider for its current model list, picks the next available model from a preference list and retries once. The model name in my config became a *preference*, not a single point of failure.

This matches what practitioners are converging on. As a recent piece on provider outages put it: "Tiered fallback chain is the most resilient. Primary, secondary, and a self-hosted or open-weight model as a final backstop" — and for most teams, "dual-provider active-passive is the right place to start." It is also where the market already is: Datadog reports that more than 70% of organizations now use three or more models.

## Observability is not optional

The fallback made the outage invisible to visitors — which is good — but it also made it invisible to *me*, which is not. My `catch {}` blocks were so polite that they hid a total LLM failure.

Now every failed call logs the provider, the HTTP status and the first part of the error body (never the key). The retired model showed up in the logs as a one-line explanation:

```
llm http error 404 {"error":{"message":"The model `llama-3.3-70b-versatile` does not exist ..."}}
```

That is the part of the "agents in production" debate I now agree with most: "Most production AI agents don't fail because the model is bad. They fail because the infrastructure around them is invisible." Graceful degradation without logging just means you find out last.

## The decisions nobody writes about

**The demo must never break publicly.** Any LLM failure degrades to the deterministic report. A visitor should never see "internal error" because of a vendor.

**Abuse is a design constraint.** Strict `owner/repo` validation, a per-IP limit on fresh runs, CORS locked to my domain, and JWT verification so only my site's anon key can call the function.

**Caching is a cost feature — and now a rate-limit feature.** Cached reports are free, instant and never counted, so real visitors almost never hit the limit.

**Configuration beats constants.** The model, the providers and the rate limit are all secrets I can change in the dashboard. The next model retirement is a settings change, not an incident.

**Traceability is a feature.** The function returns real per-step timings and the UI renders them as an agent trace. Visitors don't just read a report — they watch the pipeline run.

## What this taught me

1. **Shrink the scope until it ships.** One real graph is worth more than five planned sub-agents.
2. **Deterministic steps are underrated.** Most of what makes an agent useful is plain code with good structure.
3. **Rate limits are the main production failure mode.** Design for them on both sides: cache first, count only what costs money.
4. **Model names expire.** Treat them as preferences, and let the agent discover what is available.
5. **Two providers plus plain code** beats any single model's uptime.
6. **Fallbacks without logs hide outages.** Degrade gracefully, and log loudly.
7. **Serverless + free-tier LLMs is a legitimate production stack** for agent pipelines with caching — still at $0/month.

## Try it

Head to the [Sandbox page](/Sandbox), pick one of my repositories or paste any public repo. Watch the trace, then run the same repo again — the second run is instant, comes from the cache, and doesn't count toward your limit.

The code is on [GitHub](https://github.com/womgaalbert). If you want this kind of system for your own product — an AI pipeline with real guardrails, failover and observability — [let's talk](/Contact).

---

**Sources**

- Datadog, [State of AI Engineering](https://www.datadoghq.com/state-of-ai-engineering/) (July 2026)
- Chanl, [When your LLM provider goes down, your agent shouldn't](https://www.channel.tel/blog/llm-provider-failover-agent-reliability) (June 2026)
- Hadil Ben Abdallah, [Why AI Agents Fail in Production (And How Engineering Teams Are Fixing It in 2026)](https://dev.to/hadil/why-ai-agents-fail-in-production-and-how-engineering-teams-are-fixing-it-in-2026-job) (June 2026)
$md$
WHERE slug = 'production-ai-agent-serverless';
