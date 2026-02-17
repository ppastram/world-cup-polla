-- 003: Third place prediction round, admin RLS policies, manual_override
-- Idempotent: safe to run multiple times

-- 1. Add manual_override column to matches
ALTER TABLE matches ADD COLUMN IF NOT EXISTS manual_override BOOLEAN DEFAULT FALSE;

-- 2. Update advancing_predictions round CHECK constraint to include 'third_place'
ALTER TABLE advancing_predictions DROP CONSTRAINT IF EXISTS advancing_predictions_round_check;
ALTER TABLE advancing_predictions ADD CONSTRAINT advancing_predictions_round_check
  CHECK (round IN ('round_32', 'round_16', 'quarter', 'semi', 'final', 'third_place', 'champion'));

-- 3. Insert third_place scoring setting
INSERT INTO scoring_settings (key, value, description)
VALUES ('third_place', 10, 'Points for correctly predicting the third place winner')
ON CONFLICT (key) DO NOTHING;

-- 4. Admin UPDATE policy on matches (allows admins to update scores)
DROP POLICY IF EXISTS "Admins can update matches" ON matches;
CREATE POLICY "Admins can update matches" ON matches
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 5. Admin UPDATE policy on match_predictions (allows admins to update points_earned)
DROP POLICY IF EXISTS "Admins can update match predictions" ON match_predictions;
CREATE POLICY "Admins can update match predictions" ON match_predictions
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 6. DELETE policy on advancing_predictions (allows users to delete their own before deadline)
DROP POLICY IF EXISTS "advancing_predictions_delete" ON advancing_predictions;
CREATE POLICY "advancing_predictions_delete"
  ON advancing_predictions FOR DELETE
  USING (
    auth.uid() = user_id
    AND now() < '2026-06-04T23:59:59-05:00'::timestamptz
  );
