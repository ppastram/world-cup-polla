-- Migration 014: SECURITY DEFINER RPCs for estadisticas page
-- These bypass RLS to return aggregate statistics from all users' predictions.

-- 1. Champion picks: how many users picked each team as champion
CREATE OR REPLACE FUNCTION get_champion_picks()
RETURNS TABLE (
  team_id uuid,
  team_name text,
  team_code text,
  flag_url text,
  pick_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id AS team_id,
    t.name AS team_name,
    t.code AS team_code,
    t.flag_url,
    count(*) AS pick_count
  FROM advancing_predictions ap
  JOIN teams t ON t.id = ap.team_id
  WHERE ap.round = 'champion'
  GROUP BY t.id, t.name, t.code, t.flag_url
  ORDER BY pick_count DESC;
$$;

-- 2. Round 32 picks: how many users picked each team to advance (for group favorites)
CREATE OR REPLACE FUNCTION get_round32_picks()
RETURNS TABLE (
  team_id uuid,
  team_name text,
  team_code text,
  flag_url text,
  group_letter text,
  pick_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id AS team_id,
    t.name AS team_name,
    t.code AS team_code,
    t.flag_url,
    t.group_letter,
    count(*) AS pick_count
  FROM advancing_predictions ap
  JOIN teams t ON t.id = ap.team_id
  WHERE ap.round = 'round_32'
  GROUP BY t.id, t.name, t.code, t.flag_url, t.group_letter
  ORDER BY t.group_letter, pick_count DESC;
$$;

-- 3. Average total goals guess
CREATE OR REPLACE FUNCTION get_avg_total_goals()
RETURNS TABLE (avg_goals numeric)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT round(avg(total_goals_guess)::numeric) AS avg_goals
  FROM award_predictions
  WHERE award_type = 'total_goals'
    AND total_goals_guess IS NOT NULL;
$$;

-- 4. Consensus scores for given match IDs
CREATE OR REPLACE FUNCTION get_consensus_scores(match_ids uuid[])
RETURNS TABLE (
  match_id uuid,
  avg_home numeric,
  avg_away numeric,
  total_predictions bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    mp.match_id,
    round(avg(mp.home_score)::numeric, 1) AS avg_home,
    round(avg(mp.away_score)::numeric, 1) AS avg_away,
    count(*) AS total_predictions
  FROM match_predictions mp
  WHERE mp.match_id = ANY(match_ids)
  GROUP BY mp.match_id;
$$;
