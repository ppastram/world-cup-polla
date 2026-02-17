-- ============================================================================
-- Migration 002: Blog posts + Avatar on registration
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Update handle_new_user() to read avatar_url from metadata
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 2. Blog posts table
-- ----------------------------------------------------------------------------
CREATE TABLE blog_posts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id   UUID REFERENCES profiles(id),
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE blog_posts IS 'Admin blog posts / updates for participants';

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read
CREATE POLICY "blog_posts_select_all"
    ON blog_posts FOR SELECT
    USING (true);

-- Only admins can insert
CREATE POLICY "blog_posts_insert_admin"
    ON blog_posts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.is_admin = true
        )
    );

-- Only admins can update
CREATE POLICY "blog_posts_update_admin"
    ON blog_posts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.is_admin = true
        )
    );

-- Only admins can delete
CREATE POLICY "blog_posts_delete_admin"
    ON blog_posts FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.is_admin = true
        )
    );

-- Auto-update updated_at
CREATE TRIGGER on_blog_posts_updated
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Blog reads tracking table
-- ----------------------------------------------------------------------------
CREATE TABLE blog_reads (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
    last_read_at  TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

COMMENT ON TABLE blog_reads IS 'Tracks when each user last viewed the blog section';

ALTER TABLE blog_reads ENABLE ROW LEVEL SECURITY;

-- Users can read their own record
CREATE POLICY "blog_reads_select_own"
    ON blog_reads FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own record
CREATE POLICY "blog_reads_insert_own"
    ON blog_reads FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own record
CREATE POLICY "blog_reads_update_own"
    ON blog_reads FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Enable realtime for blog_posts so navbar can detect new posts
ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;
