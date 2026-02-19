-- Migration 009: Allow admins to read all match_predictions
-- Fixes scoring bug where admin could only score their own predictions
-- because the SELECT policy restricted visibility before tournament start.

-- Admin can read ALL match predictions (needed for scoring)
DROP POLICY IF EXISTS "Admins can select match predictions" ON match_predictions;
CREATE POLICY "Admins can select match predictions" ON match_predictions
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Also allow admin to read all advancing_predictions and award_predictions
-- (needed for the scoring RPCs to work correctly from admin context)
DROP POLICY IF EXISTS "Admins can select advancing predictions" ON advancing_predictions;
CREATE POLICY "Admins can select advancing predictions" ON advancing_predictions
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "Admins can select award predictions" ON award_predictions;
CREATE POLICY "Admins can select award predictions" ON award_predictions
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
