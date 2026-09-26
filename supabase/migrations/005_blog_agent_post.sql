-- ============================================================
-- 005: Blog post documenting the live GitHub Analyzer agent
-- ============================================================

INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, cover_image, read_time, published, published_date) VALUES
(
  'How I Shipped a Production AI Agent on Serverless',
  'production-ai-agent-serverless',
  'Everyone demos agents. Almost nobody ships one that strangers can use, that never breaks, and that costs $0/month. Here is exactly how I built and deployed a live LangGraph.js agent on Supabase Edge Functions — caching, rate limits, deterministic fallbacks, and all the unglamorous decisions that make the difference.',
  $md$# How I Shipped a Production AI Agent on Serverless

Everyone demos agents. Almost nobody ships one that strangers can use, that never breaks, and that costs $0/month.

I just shipped one. It lives on my portfolio, on the [Sandbox page](/Sandbox). You can point it at any public GitHub repository and watch a real agent pipeline run: cache check → repo fetch → structural analysis → LLM synthesis. This post is about the unglamorous 80% — the decisions that separate a demo from something you can actually put in front of clients.

## The gap I was tired of

For months my sandbox page described an "AI Executive Dashboard" — orchestrator agents, LangGraph, content studios. All concept, zero code. That is the classic trap: the architecture looks impressive and the deliverable does not exist.

The fix was to shrink the ambition to something shippable. Instead of five sub-agents, I built **one** real pipeline: a GitHub Project Analyzer. A graph with four nodes is still a real agent system — and a shipped one beats an imaginary one every time.

## The architecture

The whole thing runs on **Supabase Edge Functions** (Deno), with the orchestration done by **LangGraph.js**:

```
START → checkCache ──(hit)→ END
              └──(miss)→ fetchRepo → analyzeStructure → synthesizeReport → saveCache → END
```

Three of the five steps are deterministic code. Only one calls an LLM. That ratio is deliberate:

1. **checkCache** — a 24-hour cache lookup in Postgres. Repeated analyses cost nothing and return instantly.
2. **fetchRepo** — parallel GitHub API calls: metadata, languages, README, file tree. A `GITHUB_TOKEN` secret raises the rate limit from 60 to 5,000 requests/hour.
3. **analyzeStructure** — pure code: language distribution, dependency files, and quality signals (tests? CI? license? docs? lockfiles?). No tokens burned.
4. **synthesizeReport** — the only LLM call, via any OpenAI-compatible endpoint. I wired it for the **Groq** and **NVIDIA NIM** free tiers — swap two secrets and it works with either.
5. **saveCache** — persists the result so the next visitor gets the cached version.

Because only one node needs an LLM, the system is fast, cheap, and resilient — the three properties demos never have.

## The decisions nobody writes about

**The demo must never break publicly.** If the LLM key is missing, expired, or out of quota, the graph returns a deterministic structural report instead of failing. A visitor on my site should never see "internal error" because of a vendor outage.

**Abuse is a design constraint.** The endpoint is public. So: strict `owner/repo` validation, a per-IP rate limit (3 runs/hour) backed by a Postgres sliding window, CORS locked to my domain, and JWT verification so only my site's anon key can call it.

**Caching is a cost feature.** The 24-hour cache means a busy month costs approximately nothing. The free tiers of Groq and NVIDIA NIM are genuinely enough for this workload.

**Traceability is a feature, not a luxury.** The function returns real per-step timings, and the UI renders them as an agent trace. Visitors don't just read a report — they watch the pipeline run. That is the honest version of the "chain-of-thought" theater.

## What this taught me

1. **Shrink the scope until it ships.** One real graph node is worth more than five planned sub-agents.
2. **Deterministic steps are underrated.** Most of what makes an agent useful is plain code with good structure.
3. **Fallbacks are the difference between a demo and a product.** The LLM is the garnish, not the meal.
4. **Serverless + free-tier LLMs is a legitimate production stack** for agent pipelines with caching — at $0/month.

## Try it

Head to the [Sandbox page](/Sandbox), pick one of my repositories, or paste any public repo. Watch the trace, then try the same repo twice — the second run is instant, from cache.

The code is on [GitHub](https://github.com/womgaalbert). And if you want this kind of system for your own product — a pipeline that fetches, analyzes, and reports on data with real guardrails — [let's talk](/Contact).$md$,
  'Case Studies',
  ARRAY['LangGraph', 'AI Agents', 'Serverless', 'Supabase', 'Edge Functions', 'Groq', 'NVIDIA NIM'],
  '/images/blog/production-ai-agent-serverless.svg',
  8,
  true,
  now()
)
ON CONFLICT (slug) DO NOTHING;
