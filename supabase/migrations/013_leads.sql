-- ============================================================
-- 013: Leads from the floating contact widget
-- ============================================================
-- Visitors never read or write this table directly: the
-- submit-lead Edge Function (service role) validates, dedupes and
-- inserts; admins review leads via is_admin() (007).

CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  email       TEXT CHECK (char_length(email) BETWEEN 3 AND 254),
  phone       TEXT CHECK (char_length(phone) <= 40),
  message     TEXT CHECK (char_length(message) <= 1000),
  lang        TEXT NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'fr')),
  page        TEXT CHECK (char_length(page) <= 200),
  source      TEXT NOT NULL DEFAULT 'widget' CHECK (char_length(source) <= 40),
  status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT leads_contact_required CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_recent ON leads (email, created_at) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS leads_phone_recent ON leads (phone, created_at) WHERE phone IS NOT NULL;

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies except admins.
DROP POLICY IF EXISTS "Admins read leads" ON leads;
CREATE POLICY "Admins read leads" ON leads FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admins update leads" ON leads;
CREATE POLICY "Admins update leads" ON leads FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
