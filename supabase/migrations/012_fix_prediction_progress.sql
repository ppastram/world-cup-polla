-- Migration 012: Fix admin prediction progress to match /predicciones page formula
-- The old function counted match predictions against ALL matches (104),
-- but users only predict group stage matches (72) + advancing (64) + awards (5) = 141.

CREATE OR REPLACE FUNCTION admin_match_prediction_progress()
RETURNS TABLE (
  user_id uuid,
  completed_matches int,
  total_matches int,
  progress numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
WITH match_counts AS (
  SELECT mp.user_id, count(*) AS cnt
  FROM match_predictions mp
  JOIN matches m ON m.id = mp.match_id AND m.stage = 'group'
  GROUP BY mp.user_id
),
advancing_counts AS (
  SELECT ap.user_id, count(*) AS cnt
  FROM advancing_predictions ap
  GROUP BY ap.user_id
),
award_counts AS (
  SELECT ap.user_id, count(*) AS cnt
  FROM award_predictions ap
  GROUP BY ap.user_id
)
SELECT
  p.id AS user_id,
  (COALESCE(mc.cnt, 0) + COALESCE(ac.cnt, 0) + COALESCE(aw.cnt, 0))::int AS completed_matches,
  141 AS total_matches,
  ((COALESCE(mc.cnt, 0) + COALESCE(ac.cnt, 0) + COALESCE(aw.cnt, 0))::numeric / 141) * 100 AS progress
FROM profiles p
LEFT JOIN match_counts mc ON mc.user_id = p.id
LEFT JOIN advancing_counts ac ON ac.user_id = p.id
LEFT JOIN award_counts aw ON aw.user_id = p.id;
$$;
