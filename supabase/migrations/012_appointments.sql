-- ============================================================
-- 012: Discovery-call booking (replaces Calendly)
-- ============================================================
-- Visitors never read or write these tables directly: the
-- book-appointment Edge Function (service role) lists free slots
-- and inserts bookings; admins manage them via is_admin() (007).

CREATE TABLE IF NOT EXISTS appointments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at     TIMESTAMPTZ NOT NULL,
  duration_min  INT NOT NULL DEFAULT 30,
  name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email         TEXT NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  company       TEXT CHECK (char_length(company) <= 160),
  phone         TEXT CHECK (char_length(phone) <= 40),
  topic         TEXT NOT NULL CHECK (char_length(topic) <= 80),
  message       TEXT CHECK (char_length(message) <= 1000),
  format        TEXT NOT NULL DEFAULT 'video' CHECK (format IN ('video', 'phone')),
  lang          TEXT NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'fr')),
  timezone      TEXT CHECK (char_length(timezone) <= 64),
  status        TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'done')),
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One active booking per slot: the database is the final double-booking guard.
CREATE UNIQUE INDEX IF NOT EXISTS appointments_one_per_slot
  ON appointments (starts_at) WHERE status <> 'cancelled';
CREATE INDEX IF NOT EXISTS appointments_reminders
  ON appointments (starts_at) WHERE status = 'confirmed' AND reminder_sent = false;

CREATE TABLE IF NOT EXISTS blocked_dates (
  date   DATE PRIMARY KEY,
  reason TEXT
);

ALTER TABLE appointments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies except admins.
DROP POLICY IF EXISTS "Admins read appointments" ON appointments;
CREATE POLICY "Admins read appointments" ON appointments FOR SELECT USING (is_admin());
DROP POLICY IF EXISTS "Admins update appointments" ON appointments;
CREATE POLICY "Admins update appointments" ON appointments FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "Admins manage blocked dates" ON blocked_dates;
CREATE POLICY "Admins manage blocked dates" ON blocked_dates FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ------------------------------------------------------------
-- Daily 24h reminders at 12:00 UTC (08:00 Ottawa in summer, 07:00 in winter).
-- The function checks an x-cron-secret header; its value lives in Vault:
--   select vault.create_secret('<same value as the CRON_SECRET function secret>', 'cron_secret');
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $cron$
BEGIN
  PERFORM cron.unschedule('appointment-reminders-daily')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'appointment-reminders-daily');
END
$cron$;

SELECT cron.schedule(
  'appointment-reminders-daily',
  '0 12 * * *',
  $job$
  SELECT net.http_post(
    url     := 'https://ljjmgxhqohbkpmcbklxw.supabase.co/functions/v1/appointment-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
    ),
    body    := '{}'::jsonb
  );
  $job$
);
