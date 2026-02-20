-- Add penalty_winner_id to matches for knockout ties decided by penalties
ALTER TABLE matches ADD COLUMN IF NOT EXISTS penalty_winner_id uuid REFERENCES teams(id);
