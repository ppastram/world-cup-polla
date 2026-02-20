-- Migration 018: Lone Wolf x2 Bonus
-- If a user is the ONLY person to get a prediction right, their points are doubled.
-- Applies to: exact score (5pts), advancing teams, and award predictions.

-- ============================================================================
-- 1. ADD is_lone_wolf COLUMN TO ALL PREDICTION TABLES
-- ============================================================================

ALTER TABLE match_predictions ADD COLUMN IF NOT EXISTS is_lone_wolf BOOLEAN DEFAULT FALSE;
ALTER TABLE advancing_predictions ADD COLUMN IF NOT EXISTS is_lone_wolf BOOLEAN DEFAULT FALSE;
ALTER TABLE award_predictions ADD COLUMN IF NOT EXISTS is_lone_wolf BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- 2. UPDATE score_match_predictions() — add lone wolf detection
-- ============================================================================

CREATE OR REPLACE FUNCTION score_match_predictions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Score all predictions for finished matches (where both scores are set)
  UPDATE match_predictions mp
  SET points_earned = CASE
    -- Exact score: 5 points
    WHEN mp.home_score = m.home_score AND mp.away_score = m.away_score THEN 5
    -- Same result + same goal difference: 3 points
    WHEN SIGN(mp.home_score - mp.away_score) = SIGN(m.home_score - m.away_score)
     AND (mp.home_score - mp.away_score) = (m.home_score - m.away_score) THEN 3
    -- Same result (win/draw/loss): 2 points
    WHEN SIGN(mp.home_score - mp.away_score) = SIGN(m.home_score - m.away_score) THEN 2
    -- Wrong result: 0 points
    ELSE 0
  END
  FROM matches m
  WHERE mp.match_id = m.id
    AND m.home_score IS NOT NULL
    AND m.away_score IS NOT NULL;

  -- Reset all lone wolf flags for match predictions
  UPDATE match_predictions SET is_lone_wolf = false WHERE is_lone_wolf = true;

  -- Set lone wolf for exact scores where only 1 user got it right
  UPDATE match_predictions mp
  SET is_lone_wolf = true
  WHERE mp.points_earned = 5
    AND (SELECT COUNT(*) FROM match_predictions mp2
         WHERE mp2.match_id = mp.match_id AND mp2.points_earned = 5) = 1;
END;
$$;

COMMENT ON FUNCTION score_match_predictions() IS
  'Scores all match predictions and flags lone wolf exact scores. Runs as SECURITY DEFINER to bypass RLS.';

-- ============================================================================
-- 3. UPDATE score_advancing_predictions() — add lone wolf detection
-- ============================================================================

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

  -- Reset all lone wolf flags for advancing predictions
  UPDATE advancing_predictions SET is_lone_wolf = false WHERE is_lone_wolf = true;

  -- Set lone wolf: only 1 user predicted that team for that round correctly
  UPDATE advancing_predictions ap
  SET is_lone_wolf = true
  WHERE ap.points_earned > 0
    AND (SELECT COUNT(*) FROM advancing_predictions ap2
         WHERE ap2.team_id = ap.team_id AND ap2.round = ap.round AND ap2.points_earned > 0) = 1;
END;
$$;

-- ============================================================================
-- 4. UPDATE score_award_predictions() — add lone wolf detection
-- ============================================================================

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

  -- Reset all lone wolf flags for award predictions
  UPDATE award_predictions SET is_lone_wolf = false WHERE is_lone_wolf = true;

  -- Set lone wolf: only 1 user got this award type right
  UPDATE award_predictions ap
  SET is_lone_wolf = true
  WHERE ap.points_earned > 0
    AND (SELECT COUNT(*) FROM award_predictions ap2
         WHERE ap2.award_type = ap.award_type AND ap2.points_earned > 0) = 1;
END;
$$;

-- ============================================================================
-- 5. UPDATE recalculate_leaderboard() — double points for lone wolves
-- ============================================================================

CREATE OR REPLACE FUNCTION recalculate_leaderboard()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Upsert leaderboard rows for every user in profiles
    INSERT INTO leaderboard (user_id, match_points, advancing_points, award_points, total_points, updated_at)
    SELECT
        p.id AS user_id,
        COALESCE(mp.pts, 0) AS match_points,
        COALESCE(ap.pts, 0) AS advancing_points,
        COALESCE(aw.pts, 0) AS award_points,
        COALESCE(mp.pts, 0) + COALESCE(ap.pts, 0) + COALESCE(aw.pts, 0) AS total_points,
        now() AS updated_at
    FROM profiles p
    LEFT JOIN (
        SELECT user_id, SUM(CASE WHEN is_lone_wolf THEN points_earned * 2 ELSE points_earned END) AS pts
        FROM match_predictions
        GROUP BY user_id
    ) mp ON mp.user_id = p.id
    LEFT JOIN (
        SELECT user_id, SUM(CASE WHEN is_lone_wolf THEN points_earned * 2 ELSE points_earned END) AS pts
        FROM advancing_predictions
        GROUP BY user_id
    ) ap ON ap.user_id = p.id
    LEFT JOIN (
        SELECT user_id, SUM(CASE WHEN is_lone_wolf THEN points_earned * 2 ELSE points_earned END) AS pts
        FROM award_predictions
        GROUP BY user_id
    ) aw ON aw.user_id = p.id
    ON CONFLICT (user_id) DO UPDATE SET
        match_points     = EXCLUDED.match_points,
        advancing_points = EXCLUDED.advancing_points,
        award_points     = EXCLUDED.award_points,
        total_points     = EXCLUDED.total_points,
        updated_at       = EXCLUDED.updated_at;

    -- Update rankings (dense rank by total_points descending)
    UPDATE leaderboard
    SET rank = ranked.new_rank
    FROM (
        SELECT id, DENSE_RANK() OVER (ORDER BY total_points DESC) AS new_rank
        FROM leaderboard
    ) ranked
    WHERE leaderboard.id = ranked.id;
END;
$$;
