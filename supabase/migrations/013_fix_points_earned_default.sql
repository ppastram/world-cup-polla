-- Migration 013: Fix points_earned default from 0 to NULL
-- The DEFAULT 0 causes freshly inserted predictions to show "+0" badges
-- before admin has scored them. NULL means "not yet scored".

ALTER TABLE advancing_predictions ALTER COLUMN points_earned SET DEFAULT NULL;
ALTER TABLE award_predictions ALTER COLUMN points_earned SET DEFAULT NULL;

-- Also fix any existing unscored rows that have 0 instead of NULL.
-- Only reset rows in rounds that have NOT been scored yet
-- (i.e., rounds without actual_advancing data).
UPDATE advancing_predictions
SET points_earned = NULL
WHERE round NOT IN (SELECT DISTINCT round FROM actual_advancing);

UPDATE award_predictions
SET points_earned = NULL
WHERE award_type NOT IN (
  SELECT DISTINCT award_type FROM actual_awards
  WHERE player_name IS NOT NULL OR total_goals IS NOT NULL
);
