-- ============================================================================
-- Polla Mundialista 2026 - Initial Schema Migration
-- ============================================================================
-- This migration creates the complete database schema for the World Cup 2026
-- betting application, including tables, indexes, RLS policies, functions,
-- triggers, and seed data.
-- ============================================================================

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: extends auth.users with app-specific user data
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url  TEXT,
    is_admin    BOOLEAN DEFAULT FALSE,
    payment_status TEXT DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'uploaded', 'verified')),
    payment_proof_url TEXT,
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';

-- ----------------------------------------------------------------------------
-- teams: participating national teams
-- ----------------------------------------------------------------------------
CREATE TABLE teams (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    code        TEXT NOT NULL,          -- 3-letter FIFA code (e.g. COL, ARG)
    flag_url    TEXT,
    group_letter CHAR(1),
    external_id INT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE teams IS 'World Cup 2026 participating teams';

-- ----------------------------------------------------------------------------
-- matches: tournament matches
-- ----------------------------------------------------------------------------
CREATE TABLE matches (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage          TEXT NOT NULL
        CHECK (stage IN ('group', 'round_32', 'round_16', 'quarter', 'semi', 'third_place', 'final')),
    group_letter   CHAR(1),
    match_number   INT UNIQUE,
    home_team_id   UUID REFERENCES teams(id),
    away_team_id   UUID REFERENCES teams(id),
    home_score     INT,
    away_score     INT,
    status         TEXT DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'live', 'finished', 'postponed')),
    match_date     TIMESTAMPTZ,
    venue          TEXT,
    external_id    INT,
    created_at     TIMESTAMPTZ DEFAULT now(),
    updated_at     TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE matches IS 'All tournament matches from group stage to final';

-- ----------------------------------------------------------------------------
-- match_predictions: user score predictions for each match
-- ----------------------------------------------------------------------------
CREATE TABLE match_predictions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    match_id       UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    home_score     INT NOT NULL,
    away_score     INT NOT NULL,
    points_earned  INT DEFAULT 0,
    created_at     TIMESTAMPTZ DEFAULT now(),
    updated_at     TIMESTAMPTZ DEFAULT now(),

    UNIQUE (user_id, match_id)
);

COMMENT ON TABLE match_predictions IS 'Users'' predicted scores for each match';

-- ----------------------------------------------------------------------------
-- advancing_predictions: user predictions for which teams advance each round
-- ----------------------------------------------------------------------------
CREATE TABLE advancing_predictions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    team_id        UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    round          TEXT NOT NULL
        CHECK (round IN ('round_32', 'round_16', 'quarter', 'semi', 'final', 'champion')),
    points_earned  INT DEFAULT 0,
    created_at     TIMESTAMPTZ DEFAULT now(),

    UNIQUE (user_id, team_id, round)
);

COMMENT ON TABLE advancing_predictions IS 'Users'' predictions for teams advancing through each round';

-- ----------------------------------------------------------------------------
-- award_predictions: user predictions for individual awards and total goals
-- ----------------------------------------------------------------------------
CREATE TABLE award_predictions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    award_type        TEXT NOT NULL
        CHECK (award_type IN ('golden_ball', 'golden_boot', 'golden_glove', 'best_young', 'total_goals')),
    player_name       TEXT,
    total_goals_guess INT,
    points_earned     INT DEFAULT 0,
    created_at        TIMESTAMPTZ DEFAULT now(),
    updated_at        TIMESTAMPTZ DEFAULT now(),

    UNIQUE (user_id, award_type)
);

COMMENT ON TABLE award_predictions IS 'Users'' predictions for tournament awards (Ballon d''Or, Golden Boot, etc.)';

-- ----------------------------------------------------------------------------
-- actual_advancing: records of which teams actually advanced each round
-- ----------------------------------------------------------------------------
CREATE TABLE actual_advancing (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    round       TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now(),

    UNIQUE (team_id, round)
);

COMMENT ON TABLE actual_advancing IS 'Actual results: teams that advanced in each round';

-- ----------------------------------------------------------------------------
-- actual_awards: actual award winners and total goals
-- ----------------------------------------------------------------------------
CREATE TABLE actual_awards (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    award_type   TEXT NOT NULL,
    player_name  TEXT,
    total_goals  INT,
    created_at   TIMESTAMPTZ DEFAULT now(),

    UNIQUE (award_type)
);

COMMENT ON TABLE actual_awards IS 'Actual results: award winners and total goals';

-- ----------------------------------------------------------------------------
-- leaderboard: cached ranking for all users
-- ----------------------------------------------------------------------------
CREATE TABLE leaderboard (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    total_points     INT DEFAULT 0,
    match_points     INT DEFAULT 0,
    advancing_points INT DEFAULT 0,
    award_points     INT DEFAULT 0,
    rank             INT DEFAULT 0,
    updated_at       TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE leaderboard IS 'Cached leaderboard with aggregated points and ranking';

-- ----------------------------------------------------------------------------
-- scoring_settings: configurable point values for each prediction type
-- ----------------------------------------------------------------------------
CREATE TABLE scoring_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         TEXT NOT NULL UNIQUE,
    value       INT NOT NULL,
    description TEXT
);

COMMENT ON TABLE scoring_settings IS 'Configurable scoring rules (points per prediction type)';

-- ----------------------------------------------------------------------------
-- achievements: definitions of available achievements
-- ----------------------------------------------------------------------------
CREATE TABLE achievements (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    description TEXT,
    icon        TEXT
);

COMMENT ON TABLE achievements IS 'Available achievement definitions';

-- ----------------------------------------------------------------------------
-- user_achievements: achievements earned by users
-- ----------------------------------------------------------------------------
CREATE TABLE user_achievements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at      TIMESTAMPTZ DEFAULT now(),

    UNIQUE (user_id, achievement_id)
);

COMMENT ON TABLE user_achievements IS 'Achievements earned by each user';


-- ============================================================================
-- 2. INDEXES
-- ============================================================================

-- matches
CREATE INDEX idx_matches_match_date ON matches (match_date);
CREATE INDEX idx_matches_stage      ON matches (stage);
CREATE INDEX idx_matches_status     ON matches (status);

-- match_predictions
CREATE INDEX idx_match_predictions_user_id  ON match_predictions (user_id);
CREATE INDEX idx_match_predictions_match_id ON match_predictions (match_id);

-- advancing_predictions
CREATE INDEX idx_advancing_predictions_user_id ON advancing_predictions (user_id);
CREATE INDEX idx_advancing_predictions_round   ON advancing_predictions (round);

-- award_predictions
CREATE INDEX idx_award_predictions_user_id ON award_predictions (user_id);

-- leaderboard
CREATE INDEX idx_leaderboard_rank         ON leaderboard (rank);
CREATE INDEX idx_leaderboard_total_points ON leaderboard (total_points DESC);


-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams                ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches              ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_predictions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE advancing_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_predictions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE actual_advancing     ENABLE ROW LEVEL SECURITY;
ALTER TABLE actual_awards        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard          ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements         ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements    ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
-- Anyone can read all profiles
CREATE POLICY "profiles_select_all"
    ON profiles FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ---- teams ----
-- Anyone can read teams
CREATE POLICY "teams_select_all"
    ON teams FOR SELECT
    USING (true);

-- ---- matches ----
-- Anyone can read matches
CREATE POLICY "matches_select_all"
    ON matches FOR SELECT
    USING (true);

-- ---- match_predictions ----
-- Prediction submission deadline: June 4, 2026 at 23:59:59 COT (UTC-5)
-- Predictions become public:     June 11, 2026 (tournament start)

-- Before June 11: users can only see their own predictions.
-- After June 11: everyone can see all predictions.
CREATE POLICY "match_predictions_select"
    ON match_predictions FOR SELECT
    USING (
        auth.uid() = user_id
        OR now() >= '2026-06-11T00:00:00-05:00'::timestamptz
    );

-- Users can insert their own predictions if:
--   1. The match hasn't started yet (match_date > now())
--   2. It's before the global deadline
CREATE POLICY "match_predictions_insert"
    ON match_predictions FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND now() < '2026-06-04T23:59:59-05:00'::timestamptz
        AND EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = match_id
              AND matches.match_date > now()
        )
    );

-- Users can update their own predictions under the same time constraints
CREATE POLICY "match_predictions_update"
    ON match_predictions FOR UPDATE
    USING (
        auth.uid() = user_id
        AND now() < '2026-06-04T23:59:59-05:00'::timestamptz
        AND EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = match_predictions.match_id
              AND matches.match_date > now()
        )
    )
    WITH CHECK (
        auth.uid() = user_id
    );

-- Users can delete their own predictions under the same time constraints
CREATE POLICY "match_predictions_delete"
    ON match_predictions FOR DELETE
    USING (
        auth.uid() = user_id
        AND now() < '2026-06-04T23:59:59-05:00'::timestamptz
        AND EXISTS (
            SELECT 1 FROM matches
            WHERE matches.id = match_predictions.match_id
              AND matches.match_date > now()
        )
    );

-- ---- advancing_predictions ----
-- Same visibility rules as match_predictions
CREATE POLICY "advancing_predictions_select"
    ON advancing_predictions FOR SELECT
    USING (
        auth.uid() = user_id
        OR now() >= '2026-06-11T00:00:00-05:00'::timestamptz
    );

CREATE POLICY "advancing_predictions_insert"
    ON advancing_predictions FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND now() < '2026-06-04T23:59:59-05:00'::timestamptz
    );

CREATE POLICY "advancing_predictions_update"
    ON advancing_predictions FOR UPDATE
    USING (
        auth.uid() = user_id
        AND now() < '2026-06-04T23:59:59-05:00'::timestamptz
    )
    WITH CHECK (
        auth.uid() = user_id
    );

-- ---- award_predictions ----
-- Same visibility and deadline rules
CREATE POLICY "award_predictions_select"
    ON award_predictions FOR SELECT
    USING (
        auth.uid() = user_id
        OR now() >= '2026-06-11T00:00:00-05:00'::timestamptz
    );

CREATE POLICY "award_predictions_insert"
    ON award_predictions FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND now() < '2026-06-04T23:59:59-05:00'::timestamptz
    );

CREATE POLICY "award_predictions_update"
    ON award_predictions FOR UPDATE
    USING (
        auth.uid() = user_id
        AND now() < '2026-06-04T23:59:59-05:00'::timestamptz
    )
    WITH CHECK (
        auth.uid() = user_id
    );

-- ---- actual_advancing ----
-- Anyone can read
CREATE POLICY "actual_advancing_select_all"
    ON actual_advancing FOR SELECT
    USING (true);

-- ---- actual_awards ----
-- Anyone can read
CREATE POLICY "actual_awards_select_all"
    ON actual_awards FOR SELECT
    USING (true);

-- ---- leaderboard ----
-- Anyone can read
CREATE POLICY "leaderboard_select_all"
    ON leaderboard FOR SELECT
    USING (true);

-- ---- scoring_settings ----
-- Anyone can read
CREATE POLICY "scoring_settings_select_all"
    ON scoring_settings FOR SELECT
    USING (true);

-- Admins can update scoring settings
CREATE POLICY "scoring_settings_update_admin"
    ON scoring_settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.is_admin = true
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.is_admin = true
        )
    );

-- ---- achievements ----
-- Anyone can read
CREATE POLICY "achievements_select_all"
    ON achievements FOR SELECT
    USING (true);

-- ---- user_achievements ----
-- Anyone can read
CREATE POLICY "user_achievements_select_all"
    ON user_achievements FOR SELECT
    USING (true);


-- ============================================================================
-- 4. FUNCTIONS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- handle_new_user(): trigger function that creates a profile row when a new
-- user signs up via Supabase Auth.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            SPLIT_PART(NEW.email, '@', 1)
        )
    );
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION handle_new_user() IS 'Creates a profile row automatically when a new user signs up';

-- ----------------------------------------------------------------------------
-- calculate_match_points(): pure scoring function for match predictions.
-- Returns:
--   5 points - exact score predicted
--   3 points - correct result (win/draw/loss) AND correct goal difference
--   2 points - correct result only
--   0 points - wrong prediction
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_match_points(
    predicted_home INT,
    predicted_away INT,
    actual_home INT,
    actual_away INT
)
RETURNS INT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    -- Exact score match
    IF predicted_home = actual_home AND predicted_away = actual_away THEN
        RETURN 5;
    END IF;

    -- Check if the predicted result (win/draw/loss) is correct
    IF SIGN(predicted_home - predicted_away) = SIGN(actual_home - actual_away) THEN
        -- Correct result AND correct goal difference
        IF (predicted_home - predicted_away) = (actual_home - actual_away) THEN
            RETURN 3;
        END IF;
        -- Correct result only
        RETURN 2;
    END IF;

    -- Wrong prediction
    RETURN 0;
END;
$$;

COMMENT ON FUNCTION calculate_match_points(INT, INT, INT, INT) IS
    'Calculates points for a match prediction: exact=5, result+diff=3, result=2, else=0';

-- ----------------------------------------------------------------------------
-- recalculate_leaderboard(): aggregates all earned points across prediction
-- types and updates the leaderboard table with rankings.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION recalculate_leaderboard()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Upsert leaderboard rows for every user in profiles
    INSERT INTO leaderboard (user_id, match_points, advancing_points, award_points, total_points, updated_at)
    SELECT
        p.id AS user_id,
        COALESCE(mp.pts, 0) AS match_points,
        COALESCE(ap.pts, 0) AS advancing_points,
        COALESCE(aw.pts, 0) AS award_points,
        COALESCE(mp.pts, 0) + COALESCE(ap.pts, 0) + COALESCE(aw.pts, 0) AS total_points,
        now() AS updated_at
    FROM profiles p
    LEFT JOIN (
        SELECT user_id, SUM(points_earned) AS pts
        FROM match_predictions
        GROUP BY user_id
    ) mp ON mp.user_id = p.id
    LEFT JOIN (
        SELECT user_id, SUM(points_earned) AS pts
        FROM advancing_predictions
        GROUP BY user_id
    ) ap ON ap.user_id = p.id
    LEFT JOIN (
        SELECT user_id, SUM(points_earned) AS pts
        FROM award_predictions
        GROUP BY user_id
    ) aw ON aw.user_id = p.id
    ON CONFLICT (user_id) DO UPDATE SET
        match_points     = EXCLUDED.match_points,
        advancing_points = EXCLUDED.advancing_points,
        award_points     = EXCLUDED.award_points,
        total_points     = EXCLUDED.total_points,
        updated_at       = EXCLUDED.updated_at;

    -- Update rankings (dense rank by total_points descending)
    UPDATE leaderboard
    SET rank = ranked.new_rank
    FROM (
        SELECT id, DENSE_RANK() OVER (ORDER BY total_points DESC) AS new_rank
        FROM leaderboard
    ) ranked
    WHERE leaderboard.id = ranked.id;
END;
$$;

COMMENT ON FUNCTION recalculate_leaderboard() IS
    'Recalculates the full leaderboard: aggregates points from all prediction types and assigns rankings';


-- ============================================================================
-- 5. TRIGGERS
-- ============================================================================

-- Create profile when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER on_matches_updated
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();


-- ============================================================================
-- 6. SEED DATA
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Scoring settings: default point values
-- ----------------------------------------------------------------------------
INSERT INTO scoring_settings (key, value, description) VALUES
    ('exact_score',             5,  'Puntos por acertar marcador exacto'),
    ('correct_result_and_diff', 3,  'Puntos por acertar resultado y diferencia de goles'),
    ('correct_result',          2,  'Puntos por acertar solo el resultado (victoria/empate/derrota)'),
    ('round_32',                2,  'Puntos por acertar equipo clasificado a ronda de 32'),
    ('round_16',                3,  'Puntos por acertar equipo clasificado a octavos'),
    ('quarter',                 5,  'Puntos por acertar equipo clasificado a cuartos'),
    ('semi',                    8,  'Puntos por acertar equipo clasificado a semifinales'),
    ('final',                  12,  'Puntos por acertar equipo clasificado a la final'),
    ('champion',               20,  'Puntos por acertar al campeón'),
    ('golden_ball',            10,  'Puntos por acertar el Balón de Oro'),
    ('golden_boot',             8,  'Puntos por acertar la Bota de Oro'),
    ('golden_glove',            8,  'Puntos por acertar el Guante de Oro'),
    ('best_young',              8,  'Puntos por acertar al Mejor Jugador Joven'),
    ('total_goals_exact',      15,  'Puntos por acertar el total de goles exacto'),
    ('total_goals_within_3',    8,  'Puntos por acertar total de goles con margen de 3'),
    ('total_goals_within_5',    4,  'Puntos por acertar total de goles con margen de 5');

-- ----------------------------------------------------------------------------
-- Achievements: available badges
-- ----------------------------------------------------------------------------
INSERT INTO achievements (key, name, description, icon) VALUES
    ('prediccion_perfecta', 'Predicción Perfecta', 'Acertaste el marcador exacto',             'target'),
    ('guru_grupos',         'Gurú de Grupos',      'Acertaste todos los clasificados de un grupo', 'brain'),
    ('vidente',             'Vidente',             'Acertaste al campeón',                      'eye'),
    ('racha_ganadora',      'Racha Ganadora',      '5 predicciones correctas seguidas',         'flame'),
    ('goleador',            'Goleador',            'Acertaste al Bota de Oro',                  'award');
