-- Migration 019: Tiebreaker system based on tournament outcome predictions
-- Tiebreak order: 1) Champion, 2) Runner-up, 3) Third place
-- If tie persists after all tiebreakers, positions share prizes equally.

-- ============================================================================
-- 1. ADD TIEBREAKER COLUMNS TO LEADERBOARD
-- ============================================================================

ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS tb_champion BOOLEAN DEFAULT FALSE;
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS tb_runner_up BOOLEAN DEFAULT FALSE;
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS tb_third_place BOOLEAN DEFAULT FALSE;

-- ============================================================================
-- 2. UPDATE recalculate_leaderboard() — compute tiebreakers + multi-column rank
-- ============================================================================

CREATE OR REPLACE FUNCTION recalculate_leaderboard()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Upsert leaderboard rows for every user in profiles
    INSERT INTO leaderboard (
        user_id, match_points, advancing_points, award_points, total_points,
        tb_champion, tb_runner_up, tb_third_place, updated_at
    )
    SELECT
        p.id AS user_id,
        COALESCE(mp.pts, 0) AS match_points,
        COALESCE(ap.pts, 0) AS advancing_points,
        COALESCE(aw.pts, 0) AS award_points,
        COALESCE(mp.pts, 0) + COALESCE(ap.pts, 0) + COALESCE(aw.pts, 0) AS total_points,
        -- tb_champion: user predicted the correct champion
        EXISTS (
            SELECT 1
            FROM advancing_predictions up_champ
            JOIN actual_advancing aa_champ ON aa_champ.round = 'champion' AND aa_champ.team_id = up_champ.team_id
            WHERE up_champ.user_id = p.id AND up_champ.round = 'champion'
        ) AS tb_champion,
        -- tb_runner_up: user's finalist that ISN'T their champion pick matches the actual runner-up
        -- Actual runner-up = team in actual_advancing round 'final' that isn't in round 'champion'
        EXISTS (
            SELECT 1
            FROM advancing_predictions up_final
            WHERE up_final.user_id = p.id
              AND up_final.round = 'final'
              AND up_final.team_id NOT IN (
                  SELECT up_champ2.team_id FROM advancing_predictions up_champ2
                  WHERE up_champ2.user_id = p.id AND up_champ2.round = 'champion'
              )
              AND up_final.team_id IN (
                  SELECT aa_final.team_id FROM actual_advancing aa_final
                  WHERE aa_final.round = 'final'
                    AND aa_final.team_id NOT IN (
                        SELECT aa_champ2.team_id FROM actual_advancing aa_champ2
                        WHERE aa_champ2.round = 'champion'
                    )
              )
        ) AS tb_runner_up,
        -- tb_third_place: user predicted the correct third place winner
        EXISTS (
            SELECT 1
            FROM advancing_predictions up_third
            JOIN actual_advancing aa_third ON aa_third.round = 'third_place' AND aa_third.team_id = up_third.team_id
            WHERE up_third.user_id = p.id AND up_third.round = 'third_place'
        ) AS tb_third_place,
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
        tb_champion      = EXCLUDED.tb_champion,
        tb_runner_up     = EXCLUDED.tb_runner_up,
        tb_third_place   = EXCLUDED.tb_third_place,
        updated_at       = EXCLUDED.updated_at;

    -- Update rankings with tiebreakers
    UPDATE leaderboard
    SET rank = ranked.new_rank
    FROM (
        SELECT id, DENSE_RANK() OVER (
            ORDER BY total_points DESC,
                     tb_champion DESC,
                     tb_runner_up DESC,
                     tb_third_place DESC
        ) AS new_rank
        FROM leaderboard
    ) ranked
    WHERE leaderboard.id = ranked.id;
END;
$$;
