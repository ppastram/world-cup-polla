-- 004: Admin RLS for actual_advancing/actual_awards + scoring functions
-- Idempotent: safe to run multiple times

-- ============================================================================
-- 1. RLS POLICIES FOR ADMIN WRITE ACCESS
-- ============================================================================

-- ---- actual_advancing: admin INSERT/UPDATE/DELETE ----
DROP POLICY IF EXISTS "Admins can insert actual_advancing" ON actual_advancing;
CREATE POLICY "Admins can insert actual_advancing" ON actual_advancing
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "Admins can update actual_advancing" ON actual_advancing;
CREATE POLICY "Admins can update actual_advancing" ON actual_advancing
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "Admins can delete actual_advancing" ON actual_advancing;
CREATE POLICY "Admins can delete actual_advancing" ON actual_advancing
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ---- actual_awards: admin INSERT/UPDATE/DELETE ----
DROP POLICY IF EXISTS "Admins can insert actual_awards" ON actual_awards;
CREATE POLICY "Admins can insert actual_awards" ON actual_awards
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "Admins can update actual_awards" ON actual_awards;
CREATE POLICY "Admins can update actual_awards" ON actual_awards
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "Admins can delete actual_awards" ON actual_awards;
CREATE POLICY "Admins can delete actual_awards" ON actual_awards
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ---- advancing_predictions: admin UPDATE (for setting points_earned) ----
DROP POLICY IF EXISTS "Admins can update advancing_predictions" ON advancing_predictions;
CREATE POLICY "Admins can update advancing_predictions" ON advancing_predictions
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ---- award_predictions: admin UPDATE (for setting points_earned) ----
DROP POLICY IF EXISTS "Admins can update award_predictions" ON award_predictions;
CREATE POLICY "Admins can update award_predictions" ON award_predictions
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================================================
-- 2. SCORING FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- score_advancing_predictions(): compares actual_advancing with user predictions
-- and sets points_earned per row based on scoring_settings.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION score_advancing_predictions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reset all advancing prediction points to 0
  UPDATE advancing_predictions SET points_earned = 0 WHERE points_earned IS DISTINCT FROM 0;

  -- Award points where user predicted a team that actually advanced in that round
  UPDATE advancing_predictions ap
  SET points_earned = COALESCE(ss.value, 0)
  FROM actual_advancing aa
  JOIN scoring_settings ss ON ss.key = aa.round
  WHERE ap.team_id = aa.team_id
    AND ap.round = aa.round;
END;
$$;

COMMENT ON FUNCTION score_advancing_predictions() IS
  'Scores all advancing predictions by comparing with actual_advancing results';

-- ----------------------------------------------------------------------------
-- score_award_predictions(): compares actual_awards with user predictions
-- and sets points_earned per row.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION score_award_predictions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Reset all award prediction points to 0
  UPDATE award_predictions SET points_earned = 0 WHERE points_earned IS DISTINCT FROM 0;

  -- Score player-based awards (golden_ball, golden_boot, golden_glove, best_young)
  UPDATE award_predictions ap
  SET points_earned = COALESCE(ss.value, 0)
  FROM actual_awards aa
  JOIN scoring_settings ss ON ss.key = aa.award_type
  WHERE ap.award_type = aa.award_type
    AND aa.award_type IN ('golden_ball', 'golden_boot', 'golden_glove', 'best_young')
    AND LOWER(TRIM(ap.player_name)) = LOWER(TRIM(aa.player_name))
    AND ap.player_name IS NOT NULL
    AND aa.player_name IS NOT NULL;

  -- Score total_goals predictions
  UPDATE award_predictions ap
  SET points_earned = CASE
    WHEN ABS(ap.total_goals_guess - aa.total_goals) = 0 THEN
      COALESCE((SELECT value FROM scoring_settings WHERE key = 'total_goals_exact'), 15)
    WHEN ABS(ap.total_goals_guess - aa.total_goals) <= 3 THEN
      COALESCE((SELECT value FROM scoring_settings WHERE key = 'total_goals_within_3'), 8)
    WHEN ABS(ap.total_goals_guess - aa.total_goals) <= 5 THEN
      COALESCE((SELECT value FROM scoring_settings WHERE key = 'total_goals_within_5'), 4)
    ELSE 0
  END
  FROM actual_awards aa
  WHERE ap.award_type = 'total_goals'
    AND aa.award_type = 'total_goals'
    AND ap.total_goals_guess IS NOT NULL
    AND aa.total_goals IS NOT NULL;
END;
$$;

COMMENT ON FUNCTION score_award_predictions() IS
  'Scores all award predictions by comparing with actual_awards results';
