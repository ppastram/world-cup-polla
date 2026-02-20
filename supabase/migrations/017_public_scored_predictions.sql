-- Migration 017: Allow all authenticated users to see scored predictions
-- Previously, users could only see other players' predictions after tournament start (June 11).
-- This relaxes the SELECT policies so that any prediction with points_earned IS NOT NULL
-- is visible to all authenticated users, enabling the PointsBreakdown popup for everyone.

-- match_predictions: allow viewing scored predictions
DROP POLICY IF EXISTS "match_predictions_select" ON match_predictions;
CREATE POLICY "match_predictions_select"
    ON match_predictions FOR SELECT
    USING (
        auth.uid() = user_id
        OR now() >= '2026-06-11T00:00:00-05:00'::timestamptz
        OR points_earned IS NOT NULL
    );

-- advancing_predictions: allow viewing scored predictions
DROP POLICY IF EXISTS "advancing_predictions_select" ON advancing_predictions;
CREATE POLICY "advancing_predictions_select"
    ON advancing_predictions FOR SELECT
    USING (
        auth.uid() = user_id
        OR now() >= '2026-06-11T00:00:00-05:00'::timestamptz
        OR points_earned IS NOT NULL
    );

-- award_predictions: allow viewing scored predictions
DROP POLICY IF EXISTS "award_predictions_select" ON award_predictions;
CREATE POLICY "award_predictions_select"
    ON award_predictions FOR SELECT
    USING (
        auth.uid() = user_id
        OR now() >= '2026-06-11T00:00:00-05:00'::timestamptz
        OR points_earned IS NOT NULL
    );
