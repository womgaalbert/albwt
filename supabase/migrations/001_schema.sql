-- ============================================================
-- ALBWT Portfolio — Supabase Database Schema
-- ============================================================
-- Run this migration in the Supabase SQL Editor to create
-- all tables, RLS policies, and indexes.

-- 1. BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  excerpt     TEXT NOT NULL,
  content     TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'Tutorials',
  tags        TEXT[] DEFAULT '{}',
  cover_image TEXT,
  read_time   INT DEFAULT 5,
  published   BOOLEAN DEFAULT false,
  published_date DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blog_posts_published ON blog_posts (published, published_date DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts (slug);

-- RLS: Public read, no anonymous write
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can insert"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true);

-- 2. PROJECT COMMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS project_comments (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_slug TEXT NOT NULL,
  author_name  TEXT NOT NULL,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_project_comments_slug ON project_comments (project_slug, created_at DESC);

-- RLS: Public read + insert
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read comments"
  ON project_comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON project_comments FOR INSERT
  WITH CHECK (true);

-- 3. CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name      TEXT NOT NULL,
  email     TEXT NOT NULL,
  company   TEXT,
  service   TEXT,
  message   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Public insert only (no read for anonymous)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);
