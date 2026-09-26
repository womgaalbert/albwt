-- ============================================================
-- 009: French versions of blog posts
-- ============================================================
-- Nullable: the English columns remain the fallback when a
-- translation is missing (see localizePost in src/lib/blog.js).

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS title_fr     TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt_fr   TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_fr   TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_alt_fr TEXT;
