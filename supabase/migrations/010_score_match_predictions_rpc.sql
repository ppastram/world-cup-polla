-- Migration 010: Server-side match prediction scoring function
-- Scores all match predictions for finished matches, bypassing RLS.
-- This fixes the bug where admin could only score their own predictions
-- due to client-side RLS restrictions.

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
END;
$$;

COMMENT ON FUNCTION score_match_predictions() IS
  'Scores all match predictions by comparing with actual match results. Runs as SECURITY DEFINER to bypass RLS.';
