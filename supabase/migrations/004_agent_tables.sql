-- ============================================================
-- 004: Agent infrastructure for the live GitHub Analyzer
-- Cache table (24h TTL enforced at read time) + per-IP rate limits.
-- Both tables are service-role only: the Edge Function accesses them
-- with SUPABASE_SERVICE_ROLE_KEY (bypasses RLS); anon/public get nothing.
-- ============================================================

-- Cached agent analyses (one row per repo + language)
CREATE TABLE IF NOT EXISTS repo_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  repo text NOT NULL,
  lang text NOT NULL DEFAULT 'en',
  result jsonb NOT NULL,
  model text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (repo, lang)
);

ALTER TABLE repo_analyses ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: reads and writes happen via service role only.

-- Per-IP sliding-window rate limit for public agent calls
CREATE TABLE IF NOT EXISTS agent_rate_limits (
  ip text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0
);

ALTER TABLE agent_rate_limits ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: service role only.
