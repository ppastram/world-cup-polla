-- ============================================================================
-- Migration 016: Add country_code to profiles
-- ============================================================================

-- 1. Add column
ALTER TABLE profiles ADD COLUMN country_code TEXT;

-- 2. Update handle_new_user() to read country_code from metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, display_name, avatar_url, country_code)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'country_code'
    );
    RETURN NEW;
END;
$$;
