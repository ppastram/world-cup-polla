-- 005: Fix scoring functions to only score rounds/awards that have actual data
-- Previously, all predictions were reset to points_earned=0 even for rounds
-- the admin hadn't entered yet. Now only rounds with actual_advancing entries
-- (and award types with actual_awards entries) are scored.

-- ----------------------------------------------------------------------------
-- score_advancing_predictions(): only score rounds present in actual_advancing
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION score_advancing_predictions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only reset points for rounds that have actual results entered by admin
  UPDATE advancing_predictions ap
  SET points_earned = 0
  WHERE ap.round IN (SELECT DISTINCT round FROM actual_advancing)
    AND ap.points_earned IS DISTINCT FROM 0;

  -- Reset points to NULL for rounds that do NOT have actual results
  UPDATE advancing_predictions ap
  SET points_earned = NULL
  WHERE ap.round NOT IN (SELECT DISTINCT round FROM actual_advancing)
    AND ap.points_earned IS NOT NULL;

  -- Award points where user predicted a team that actually advanced in that round
  UPDATE advancing_predictions ap
  SET points_earned = COALESCE(ss.value, 0)
  FROM actual_advancing aa
  JOIN scoring_settings ss ON ss.key = aa.round
  WHERE ap.team_id = aa.team_id
    AND ap.round = aa.round;
END;
$$;

-- ----------------------------------------------------------------------------
-- score_award_predictions(): only score award types present in actual_awards
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION score_award_predictions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only reset points for award types that have actual results entered by admin
  UPDATE award_predictions ap
  SET points_earned = 0
  WHERE ap.award_type IN (
    SELECT DISTINCT award_type FROM actual_awards
    WHERE player_name IS NOT NULL OR total_goals IS NOT NULL
  )
    AND ap.points_earned IS DISTINCT FROM 0;

  -- Reset points to NULL for award types that do NOT have actual results
  UPDATE award_predictions ap
  SET points_earned = NULL
  WHERE ap.award_type NOT IN (
    SELECT DISTINCT award_type FROM actual_awards
    WHERE player_name IS NOT NULL OR total_goals IS NOT NULL
  )
    AND ap.points_earned IS NOT NULL;

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
