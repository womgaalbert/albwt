-- ============================================================
-- 007: Admin-only writes + server-side input limits
-- ============================================================
-- Magic-link sign-in (members-only images) means anyone can become
-- "authenticated". Blog writes and reading contact messages must
-- therefore be limited to admins, not every signed-in user.
--
-- After running this, make yourself an admin:
--   INSERT INTO admins (user_id) SELECT id FROM auth.users WHERE email = 'you@example.com';

CREATE TABLE IF NOT EXISTS admins (
  user_id    UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
-- No policies: only the service role / SQL editor can manage admins.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$;

-- Blog posts: admins only for writes
DROP POLICY IF EXISTS "Authenticated users can insert" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update their posts" ON blog_posts;

CREATE POLICY "Admins can insert posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Contact messages: admins only for reads
DROP POLICY IF EXISTS "Authenticated users can read messages" ON contact_messages;

CREATE POLICY "Admins can read messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (is_admin());

-- Server-side length limits mirroring MAX_INPUT_LENGTHS in src/lib/sanitize.js
ALTER TABLE project_comments
  DROP CONSTRAINT IF EXISTS project_comments_lengths,
  ADD CONSTRAINT project_comments_lengths CHECK (
    char_length(project_slug) BETWEEN 1 AND 100
    AND char_length(btrim(author_name)) BETWEEN 1 AND 80
    AND char_length(btrim(content)) BETWEEN 1 AND 2000
  ) NOT VALID;

ALTER TABLE contact_messages
  DROP CONSTRAINT IF EXISTS contact_messages_lengths,
  ADD CONSTRAINT contact_messages_lengths CHECK (
    char_length(btrim(name)) BETWEEN 1 AND 100
    AND char_length(email) BETWEEN 3 AND 254
    AND email LIKE '%_@_%'
    AND (company IS NULL OR char_length(company) <= 200)
    AND (service IS NULL OR char_length(service) <= 100)
    AND char_length(btrim(message)) BETWEEN 1 AND 5000
  ) NOT VALID;
