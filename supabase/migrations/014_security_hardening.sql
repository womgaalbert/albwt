-- ============================================================
-- 014: Security Hardening & Moderation
-- ============================================================
-- 1. contact_messages:
--    Drop legacy anonymous insert policy. Submissions now exclusively flow
--    through the submit-contact Edge Function (which uses the service role key,
--    enforces honeypot, and applies per-IP rate limits).
--
-- 2. project_comments:
--    Drop open anonymous insert policy. Add status column and admin management.
--    Comments are submitted via submit-comment Edge Function with rate-limiting.
--
-- 3. blog_posts:
--    Allow admins to view unpublished/draft posts in SELECT queries.
-- ============================================================

-- 1. CONTACT MESSAGES: Close direct REST inserts
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_messages;

-- 2. PROJECT COMMENTS: Add moderation flag & lock down direct inserts
ALTER TABLE project_comments
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_project_comments_approved
  ON project_comments (project_slug, is_approved, created_at DESC);

-- Drop direct anonymous insert
DROP POLICY IF EXISTS "Anyone can insert comments" ON project_comments;
DROP POLICY IF EXISTS "Anyone can read comments" ON project_comments;

-- Public read only approved comments
CREATE POLICY "Public read approved comments"
  ON project_comments FOR SELECT
  USING (is_approved = true OR is_admin());

-- Admins can update/delete comments (moderation)
CREATE POLICY "Admins manage comments"
  ON project_comments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3. BLOG POSTS: Allow admins to view draft posts
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;

CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true OR is_admin());
