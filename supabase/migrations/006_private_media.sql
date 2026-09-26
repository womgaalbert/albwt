-- ============================================================
-- 006: Accessible image metadata + members-only media bucket
-- ============================================================

-- Optional descriptive alt text for blog covers (falls back to the title in the UI)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_alt TEXT;

-- Private bucket for client-confidential visuals. The site reads these
-- through short-lived signed URLs (InkImage with access="members").
INSERT INTO storage.buckets (id, name, public)
VALUES ('private-media', 'private-media', false)
ON CONFLICT (id) DO NOTHING;

-- Signed-in visitors may read (and therefore sign URLs for) private media.
-- Uploads stay with the dashboard / service role; no write policy is granted.
DROP POLICY IF EXISTS "Members can read private media" ON storage.objects;
CREATE POLICY "Members can read private media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'private-media');
