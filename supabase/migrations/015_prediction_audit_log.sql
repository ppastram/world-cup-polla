-- Migration 015: Audit log for all prediction tables
-- Automatically logs every INSERT, UPDATE, DELETE on prediction tables.
-- Provides recovery capability and dispute resolution evidence.

-- 1. Create the audit log table
CREATE TABLE IF NOT EXISTS prediction_audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name text NOT NULL,
  operation text NOT NULL,  -- INSERT, UPDATE, DELETE
  user_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by user and time
CREATE INDEX idx_audit_log_user_id ON prediction_audit_log (user_id);
CREATE INDEX idx_audit_log_created_at ON prediction_audit_log (created_at);
CREATE INDEX idx_audit_log_table_op ON prediction_audit_log (table_name, operation);

-- 2. Generic audit trigger function
CREATE OR REPLACE FUNCTION prediction_audit_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO prediction_audit_log (table_name, operation, user_id, new_data)
    VALUES (TG_TABLE_NAME, 'INSERT', NEW.user_id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO prediction_audit_log (table_name, operation, user_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, 'UPDATE', NEW.user_id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO prediction_audit_log (table_name, operation, user_id, old_data)
    VALUES (TG_TABLE_NAME, 'DELETE', OLD.user_id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 3. Attach triggers to all three prediction tables

-- match_predictions
DROP TRIGGER IF EXISTS audit_match_predictions ON match_predictions;
CREATE TRIGGER audit_match_predictions
  AFTER INSERT OR UPDATE OR DELETE ON match_predictions
  FOR EACH ROW EXECUTE FUNCTION prediction_audit_trigger();

-- advancing_predictions
DROP TRIGGER IF EXISTS audit_advancing_predictions ON advancing_predictions;
CREATE TRIGGER audit_advancing_predictions
  AFTER INSERT OR UPDATE OR DELETE ON advancing_predictions
  FOR EACH ROW EXECUTE FUNCTION prediction_audit_trigger();

-- award_predictions
DROP TRIGGER IF EXISTS audit_award_predictions ON award_predictions;
CREATE TRIGGER audit_award_predictions
  AFTER INSERT OR UPDATE OR DELETE ON award_predictions
  FOR EACH ROW EXECUTE FUNCTION prediction_audit_trigger();

-- 4. RLS: only admins can read the audit log directly
ALTER TABLE prediction_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
  ON prediction_audit_log FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- No INSERT/UPDATE/DELETE policies for users — only the trigger (SECURITY DEFINER) writes to it.
