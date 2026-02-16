-- =============================================================================
-- FIFA World Cup 2026 - Seed Matches (104 total)
-- =============================================================================
-- 72 group stage matches (12 groups x 6 matches each)
-- 16 round of 32 matches
--  8 round of 16 matches
--  4 quarterfinal matches
--  2 semifinal matches
--  1 third-place match
--  1 final
-- =============================================================================
-- Knockout matches have NULL team IDs (TBD after group stage).
-- All times are in UTC-5 (Colombia / Eastern US time).
-- =============================================================================

WITH team_ids AS (
    SELECT id, code FROM teams
)
INSERT INTO matches (id, stage, group_letter, match_number, home_team_id, away_team_id, status, match_date, venue)

-- =============================================================================
-- GROUP STAGE: 72 matches (June 11 - June 26, 2026)
-- =============================================================================
-- Match day pattern per group:
--   MD1: Team1 vs Team2, Team3 vs Team4
--   MD2: Team1 vs Team3, Team2 vs Team4
--   MD3: Team1 vs Team4, Team2 vs Team3
-- =============================================================================

-- ---- Group A: MEX, RSA, KOR, DEN ----
-- MD1 (June 11)
SELECT gen_random_uuid(), 'group', 'A', 1,
    (SELECT id FROM team_ids WHERE code = 'MEX'),
    (SELECT id FROM team_ids WHERE code = 'RSA'),
    'scheduled', '2026-06-11 12:00:00-05:00'::timestamptz, 'Estadio Azteca (Mexico City)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'A', 2,
    (SELECT id FROM team_ids WHERE code = 'KOR'),
    (SELECT id FROM team_ids WHERE code = 'DEN'),
    'scheduled', '2026-06-11 15:00:00-05:00'::timestamptz, 'SoFi Stadium (Inglewood)'
UNION ALL
-- MD2 (June 16)
SELECT gen_random_uuid(), 'group', 'A', 3,
    (SELECT id FROM team_ids WHERE code = 'MEX'),
    (SELECT id FROM team_ids WHERE code = 'KOR'),
    'scheduled', '2026-06-16 12:00:00-05:00'::timestamptz, 'NRG Stadium (Houston)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'A', 4,
    (SELECT id FROM team_ids WHERE code = 'RSA'),
    (SELECT id FROM team_ids WHERE code = 'DEN'),
    'scheduled', '2026-06-16 15:00:00-05:00'::timestamptz, 'Estadio Azteca (Mexico City)'
UNION ALL
-- MD3 (June 21)
SELECT gen_random_uuid(), 'group', 'A', 5,
    (SELECT id FROM team_ids WHERE code = 'MEX'),
    (SELECT id FROM team_ids WHERE code = 'DEN'),
    'scheduled', '2026-06-21 12:00:00-05:00'::timestamptz, 'Estadio Azteca (Mexico City)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'A', 6,
    (SELECT id FROM team_ids WHERE code = 'RSA'),
    (SELECT id FROM team_ids WHERE code = 'KOR'),
    'scheduled', '2026-06-21 12:00:00-05:00'::timestamptz, 'AT&T Stadium (Arlington)'
UNION ALL

-- ---- Group B: CAN, SUI, QAT, ITA ----
-- MD1 (June 11)
SELECT gen_random_uuid(), 'group', 'B', 7,
    (SELECT id FROM team_ids WHERE code = 'CAN'),
    (SELECT id FROM team_ids WHERE code = 'SUI'),
    'scheduled', '2026-06-11 18:00:00-05:00'::timestamptz, 'BMO Field (Toronto)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'B', 8,
    (SELECT id FROM team_ids WHERE code = 'QAT'),
    (SELECT id FROM team_ids WHERE code = 'ITA'),
    'scheduled', '2026-06-11 21:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL
-- MD2 (June 16)
SELECT gen_random_uuid(), 'group', 'B', 9,
    (SELECT id FROM team_ids WHERE code = 'CAN'),
    (SELECT id FROM team_ids WHERE code = 'QAT'),
    'scheduled', '2026-06-16 18:00:00-05:00'::timestamptz, 'BC Place (Vancouver)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'B', 10,
    (SELECT id FROM team_ids WHERE code = 'SUI'),
    (SELECT id FROM team_ids WHERE code = 'ITA'),
    'scheduled', '2026-06-16 21:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
UNION ALL
-- MD3 (June 21)
SELECT gen_random_uuid(), 'group', 'B', 11,
    (SELECT id FROM team_ids WHERE code = 'CAN'),
    (SELECT id FROM team_ids WHERE code = 'ITA'),
    'scheduled', '2026-06-21 15:00:00-05:00'::timestamptz, 'BMO Field (Toronto)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'B', 12,
    (SELECT id FROM team_ids WHERE code = 'SUI'),
    (SELECT id FROM team_ids WHERE code = 'QAT'),
    'scheduled', '2026-06-21 15:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL

-- ---- Group C: BRA, MAR, HAI, SCO ----
-- MD1 (June 12)
SELECT gen_random_uuid(), 'group', 'C', 13,
    (SELECT id FROM team_ids WHERE code = 'BRA'),
    (SELECT id FROM team_ids WHERE code = 'MAR'),
    'scheduled', '2026-06-12 12:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'C', 14,
    (SELECT id FROM team_ids WHERE code = 'HAI'),
    (SELECT id FROM team_ids WHERE code = 'SCO'),
    'scheduled', '2026-06-12 15:00:00-05:00'::timestamptz, 'Lincoln Financial Field (Philadelphia)'
UNION ALL
-- MD2 (June 17)
SELECT gen_random_uuid(), 'group', 'C', 15,
    (SELECT id FROM team_ids WHERE code = 'BRA'),
    (SELECT id FROM team_ids WHERE code = 'HAI'),
    'scheduled', '2026-06-17 12:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'C', 16,
    (SELECT id FROM team_ids WHERE code = 'MAR'),
    (SELECT id FROM team_ids WHERE code = 'SCO'),
    'scheduled', '2026-06-17 15:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
UNION ALL
-- MD3 (June 22)
SELECT gen_random_uuid(), 'group', 'C', 17,
    (SELECT id FROM team_ids WHERE code = 'BRA'),
    (SELECT id FROM team_ids WHERE code = 'SCO'),
    'scheduled', '2026-06-22 12:00:00-05:00'::timestamptz, 'Lincoln Financial Field (Philadelphia)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'C', 18,
    (SELECT id FROM team_ids WHERE code = 'MAR'),
    (SELECT id FROM team_ids WHERE code = 'HAI'),
    'scheduled', '2026-06-22 12:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL

-- ---- Group D: USA, PAR, AUS, TUR ----
-- MD1 (June 12)
SELECT gen_random_uuid(), 'group', 'D', 19,
    (SELECT id FROM team_ids WHERE code = 'USA'),
    (SELECT id FROM team_ids WHERE code = 'PAR'),
    'scheduled', '2026-06-12 18:00:00-05:00'::timestamptz, 'SoFi Stadium (Inglewood)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'D', 20,
    (SELECT id FROM team_ids WHERE code = 'AUS'),
    (SELECT id FROM team_ids WHERE code = 'TUR'),
    'scheduled', '2026-06-12 21:00:00-05:00'::timestamptz, 'Lumen Field (Seattle)'
UNION ALL
-- MD2 (June 17)
SELECT gen_random_uuid(), 'group', 'D', 21,
    (SELECT id FROM team_ids WHERE code = 'USA'),
    (SELECT id FROM team_ids WHERE code = 'AUS'),
    'scheduled', '2026-06-17 18:00:00-05:00'::timestamptz, 'AT&T Stadium (Arlington)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'D', 22,
    (SELECT id FROM team_ids WHERE code = 'PAR'),
    (SELECT id FROM team_ids WHERE code = 'TUR'),
    'scheduled', '2026-06-17 21:00:00-05:00'::timestamptz, 'Levi''s Stadium (Santa Clara)'
UNION ALL
-- MD3 (June 22)
SELECT gen_random_uuid(), 'group', 'D', 23,
    (SELECT id FROM team_ids WHERE code = 'USA'),
    (SELECT id FROM team_ids WHERE code = 'TUR'),
    'scheduled', '2026-06-22 15:00:00-05:00'::timestamptz, 'SoFi Stadium (Inglewood)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'D', 24,
    (SELECT id FROM team_ids WHERE code = 'PAR'),
    (SELECT id FROM team_ids WHERE code = 'AUS'),
    'scheduled', '2026-06-22 15:00:00-05:00'::timestamptz, 'Lumen Field (Seattle)'
UNION ALL

-- ---- Group E: GER, ECU, CIV, CUW ----
-- MD1 (June 13)
SELECT gen_random_uuid(), 'group', 'E', 25,
    (SELECT id FROM team_ids WHERE code = 'GER'),
    (SELECT id FROM team_ids WHERE code = 'ECU'),
    'scheduled', '2026-06-13 12:00:00-05:00'::timestamptz, 'Mercedes-Benz Stadium (Atlanta)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'E', 26,
    (SELECT id FROM team_ids WHERE code = 'CIV'),
    (SELECT id FROM team_ids WHERE code = 'CUW'),
    'scheduled', '2026-06-13 15:00:00-05:00'::timestamptz, 'NRG Stadium (Houston)'
UNION ALL
-- MD2 (June 18)
SELECT gen_random_uuid(), 'group', 'E', 27,
    (SELECT id FROM team_ids WHERE code = 'GER'),
    (SELECT id FROM team_ids WHERE code = 'CIV'),
    'scheduled', '2026-06-18 12:00:00-05:00'::timestamptz, 'Lincoln Financial Field (Philadelphia)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'E', 28,
    (SELECT id FROM team_ids WHERE code = 'ECU'),
    (SELECT id FROM team_ids WHERE code = 'CUW'),
    'scheduled', '2026-06-18 15:00:00-05:00'::timestamptz, 'Mercedes-Benz Stadium (Atlanta)'
UNION ALL
-- MD3 (June 23)
SELECT gen_random_uuid(), 'group', 'E', 29,
    (SELECT id FROM team_ids WHERE code = 'GER'),
    (SELECT id FROM team_ids WHERE code = 'CUW'),
    'scheduled', '2026-06-23 12:00:00-05:00'::timestamptz, 'NRG Stadium (Houston)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'E', 30,
    (SELECT id FROM team_ids WHERE code = 'ECU'),
    (SELECT id FROM team_ids WHERE code = 'CIV'),
    'scheduled', '2026-06-23 12:00:00-05:00'::timestamptz, 'Mercedes-Benz Stadium (Atlanta)'
UNION ALL

-- ---- Group F: NED, JPN, TUN, UKR ----
-- MD1 (June 13)
SELECT gen_random_uuid(), 'group', 'F', 31,
    (SELECT id FROM team_ids WHERE code = 'NED'),
    (SELECT id FROM team_ids WHERE code = 'JPN'),
    'scheduled', '2026-06-13 18:00:00-05:00'::timestamptz, 'Arrowhead Stadium (Kansas City)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'F', 32,
    (SELECT id FROM team_ids WHERE code = 'TUN'),
    (SELECT id FROM team_ids WHERE code = 'UKR'),
    'scheduled', '2026-06-13 21:00:00-05:00'::timestamptz, 'Gillette Stadium (Foxborough)'
UNION ALL
-- MD2 (June 18)
SELECT gen_random_uuid(), 'group', 'F', 33,
    (SELECT id FROM team_ids WHERE code = 'NED'),
    (SELECT id FROM team_ids WHERE code = 'TUN'),
    'scheduled', '2026-06-18 18:00:00-05:00'::timestamptz, 'Levi''s Stadium (Santa Clara)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'F', 34,
    (SELECT id FROM team_ids WHERE code = 'JPN'),
    (SELECT id FROM team_ids WHERE code = 'UKR'),
    'scheduled', '2026-06-18 21:00:00-05:00'::timestamptz, 'Arrowhead Stadium (Kansas City)'
UNION ALL
-- MD3 (June 23)
SELECT gen_random_uuid(), 'group', 'F', 35,
    (SELECT id FROM team_ids WHERE code = 'NED'),
    (SELECT id FROM team_ids WHERE code = 'UKR'),
    'scheduled', '2026-06-23 15:00:00-05:00'::timestamptz, 'Gillette Stadium (Foxborough)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'F', 36,
    (SELECT id FROM team_ids WHERE code = 'JPN'),
    (SELECT id FROM team_ids WHERE code = 'TUN'),
    'scheduled', '2026-06-23 15:00:00-05:00'::timestamptz, 'Levi''s Stadium (Santa Clara)'
UNION ALL

-- ---- Group G: BEL, EGY, IRN, NZL ----
-- MD1 (June 14)
SELECT gen_random_uuid(), 'group', 'G', 37,
    (SELECT id FROM team_ids WHERE code = 'BEL'),
    (SELECT id FROM team_ids WHERE code = 'EGY'),
    'scheduled', '2026-06-14 12:00:00-05:00'::timestamptz, 'BMO Field (Toronto)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'G', 38,
    (SELECT id FROM team_ids WHERE code = 'IRN'),
    (SELECT id FROM team_ids WHERE code = 'NZL'),
    'scheduled', '2026-06-14 15:00:00-05:00'::timestamptz, 'BC Place (Vancouver)'
UNION ALL
-- MD2 (June 19)
SELECT gen_random_uuid(), 'group', 'G', 39,
    (SELECT id FROM team_ids WHERE code = 'BEL'),
    (SELECT id FROM team_ids WHERE code = 'IRN'),
    'scheduled', '2026-06-19 12:00:00-05:00'::timestamptz, 'Estadio BBVA (Monterrey)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'G', 40,
    (SELECT id FROM team_ids WHERE code = 'EGY'),
    (SELECT id FROM team_ids WHERE code = 'NZL'),
    'scheduled', '2026-06-19 15:00:00-05:00'::timestamptz, 'BMO Field (Toronto)'
UNION ALL
-- MD3 (June 24)
SELECT gen_random_uuid(), 'group', 'G', 41,
    (SELECT id FROM team_ids WHERE code = 'BEL'),
    (SELECT id FROM team_ids WHERE code = 'NZL'),
    'scheduled', '2026-06-24 12:00:00-05:00'::timestamptz, 'BC Place (Vancouver)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'G', 42,
    (SELECT id FROM team_ids WHERE code = 'EGY'),
    (SELECT id FROM team_ids WHERE code = 'IRN'),
    'scheduled', '2026-06-24 12:00:00-05:00'::timestamptz, 'Estadio BBVA (Monterrey)'
UNION ALL

-- ---- Group H: ESP, CPV, KSA, URU ----
-- MD1 (June 14)
SELECT gen_random_uuid(), 'group', 'H', 43,
    (SELECT id FROM team_ids WHERE code = 'ESP'),
    (SELECT id FROM team_ids WHERE code = 'CPV'),
    'scheduled', '2026-06-14 18:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'H', 44,
    (SELECT id FROM team_ids WHERE code = 'KSA'),
    (SELECT id FROM team_ids WHERE code = 'URU'),
    'scheduled', '2026-06-14 21:00:00-05:00'::timestamptz, 'Estadio Guadalajara'
UNION ALL
-- MD2 (June 19)
SELECT gen_random_uuid(), 'group', 'H', 45,
    (SELECT id FROM team_ids WHERE code = 'ESP'),
    (SELECT id FROM team_ids WHERE code = 'KSA'),
    'scheduled', '2026-06-19 18:00:00-05:00'::timestamptz, 'AT&T Stadium (Arlington)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'H', 46,
    (SELECT id FROM team_ids WHERE code = 'CPV'),
    (SELECT id FROM team_ids WHERE code = 'URU'),
    'scheduled', '2026-06-19 21:00:00-05:00'::timestamptz, 'Estadio Guadalajara'
UNION ALL
-- MD3 (June 24)
SELECT gen_random_uuid(), 'group', 'H', 47,
    (SELECT id FROM team_ids WHERE code = 'ESP'),
    (SELECT id FROM team_ids WHERE code = 'URU'),
    'scheduled', '2026-06-24 15:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'H', 48,
    (SELECT id FROM team_ids WHERE code = 'CPV'),
    (SELECT id FROM team_ids WHERE code = 'KSA'),
    'scheduled', '2026-06-24 15:00:00-05:00'::timestamptz, 'AT&T Stadium (Arlington)'
UNION ALL

-- ---- Group I: FRA, SEN, NOR, BOL ----
-- MD1 (June 15)
SELECT gen_random_uuid(), 'group', 'I', 49,
    (SELECT id FROM team_ids WHERE code = 'FRA'),
    (SELECT id FROM team_ids WHERE code = 'SEN'),
    'scheduled', '2026-06-15 12:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'I', 50,
    (SELECT id FROM team_ids WHERE code = 'NOR'),
    (SELECT id FROM team_ids WHERE code = 'BOL'),
    'scheduled', '2026-06-15 15:00:00-05:00'::timestamptz, 'Gillette Stadium (Foxborough)'
UNION ALL
-- MD2 (June 20)
SELECT gen_random_uuid(), 'group', 'I', 51,
    (SELECT id FROM team_ids WHERE code = 'FRA'),
    (SELECT id FROM team_ids WHERE code = 'NOR'),
    'scheduled', '2026-06-20 12:00:00-05:00'::timestamptz, 'SoFi Stadium (Inglewood)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'I', 52,
    (SELECT id FROM team_ids WHERE code = 'SEN'),
    (SELECT id FROM team_ids WHERE code = 'BOL'),
    'scheduled', '2026-06-20 15:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
UNION ALL
-- MD3 (June 25)
SELECT gen_random_uuid(), 'group', 'I', 53,
    (SELECT id FROM team_ids WHERE code = 'FRA'),
    (SELECT id FROM team_ids WHERE code = 'BOL'),
    'scheduled', '2026-06-25 12:00:00-05:00'::timestamptz, 'Gillette Stadium (Foxborough)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'I', 54,
    (SELECT id FROM team_ids WHERE code = 'SEN'),
    (SELECT id FROM team_ids WHERE code = 'NOR'),
    'scheduled', '2026-06-25 12:00:00-05:00'::timestamptz, 'SoFi Stadium (Inglewood)'
UNION ALL

-- ---- Group J: ARG, ALG, AUT, JOR ----
-- MD1 (June 15)
SELECT gen_random_uuid(), 'group', 'J', 55,
    (SELECT id FROM team_ids WHERE code = 'ARG'),
    (SELECT id FROM team_ids WHERE code = 'ALG'),
    'scheduled', '2026-06-15 18:00:00-05:00'::timestamptz, 'NRG Stadium (Houston)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'J', 56,
    (SELECT id FROM team_ids WHERE code = 'AUT'),
    (SELECT id FROM team_ids WHERE code = 'JOR'),
    'scheduled', '2026-06-15 21:00:00-05:00'::timestamptz, 'Lincoln Financial Field (Philadelphia)'
UNION ALL
-- MD2 (June 20)
SELECT gen_random_uuid(), 'group', 'J', 57,
    (SELECT id FROM team_ids WHERE code = 'ARG'),
    (SELECT id FROM team_ids WHERE code = 'AUT'),
    'scheduled', '2026-06-20 18:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'J', 58,
    (SELECT id FROM team_ids WHERE code = 'ALG'),
    (SELECT id FROM team_ids WHERE code = 'JOR'),
    'scheduled', '2026-06-20 21:00:00-05:00'::timestamptz, 'NRG Stadium (Houston)'
UNION ALL
-- MD3 (June 25)
SELECT gen_random_uuid(), 'group', 'J', 59,
    (SELECT id FROM team_ids WHERE code = 'ARG'),
    (SELECT id FROM team_ids WHERE code = 'JOR'),
    'scheduled', '2026-06-25 15:00:00-05:00'::timestamptz, 'Mercedes-Benz Stadium (Atlanta)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'J', 60,
    (SELECT id FROM team_ids WHERE code = 'ALG'),
    (SELECT id FROM team_ids WHERE code = 'AUT'),
    'scheduled', '2026-06-25 15:00:00-05:00'::timestamptz, 'NRG Stadium (Houston)'
UNION ALL

-- ---- Group K: POR, COL, UZB, COD ----
-- MD1 (June 16)
SELECT gen_random_uuid(), 'group', 'K', 61,
    (SELECT id FROM team_ids WHERE code = 'POR'),
    (SELECT id FROM team_ids WHERE code = 'COL'),
    'scheduled', '2026-06-16 09:00:00-05:00'::timestamptz, 'Estadio BBVA (Monterrey)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'K', 62,
    (SELECT id FROM team_ids WHERE code = 'UZB'),
    (SELECT id FROM team_ids WHERE code = 'COD'),
    'scheduled', '2026-06-16 06:00:00-05:00'::timestamptz, 'Estadio Guadalajara'
UNION ALL
-- MD2 (June 21)
SELECT gen_random_uuid(), 'group', 'K', 63,
    (SELECT id FROM team_ids WHERE code = 'POR'),
    (SELECT id FROM team_ids WHERE code = 'UZB'),
    'scheduled', '2026-06-21 18:00:00-05:00'::timestamptz, 'Levi''s Stadium (Santa Clara)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'K', 64,
    (SELECT id FROM team_ids WHERE code = 'COL'),
    (SELECT id FROM team_ids WHERE code = 'COD'),
    'scheduled', '2026-06-21 21:00:00-05:00'::timestamptz, 'Estadio BBVA (Monterrey)'
UNION ALL
-- MD3 (June 26)
SELECT gen_random_uuid(), 'group', 'K', 65,
    (SELECT id FROM team_ids WHERE code = 'POR'),
    (SELECT id FROM team_ids WHERE code = 'COD'),
    'scheduled', '2026-06-26 12:00:00-05:00'::timestamptz, 'Estadio Guadalajara'
UNION ALL
SELECT gen_random_uuid(), 'group', 'K', 66,
    (SELECT id FROM team_ids WHERE code = 'COL'),
    (SELECT id FROM team_ids WHERE code = 'UZB'),
    'scheduled', '2026-06-26 12:00:00-05:00'::timestamptz, 'Estadio BBVA (Monterrey)'
UNION ALL

-- ---- Group L: ENG, CRO, GHA, PAN ----
-- MD1 (June 16)
SELECT gen_random_uuid(), 'group', 'L', 67,
    (SELECT id FROM team_ids WHERE code = 'ENG'),
    (SELECT id FROM team_ids WHERE code = 'CRO'),
    'scheduled', '2026-06-16 11:00:00-05:00'::timestamptz, 'Lumen Field (Seattle)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'L', 68,
    (SELECT id FROM team_ids WHERE code = 'GHA'),
    (SELECT id FROM team_ids WHERE code = 'PAN'),
    'scheduled', '2026-06-16 08:00:00-05:00'::timestamptz, 'Arrowhead Stadium (Kansas City)'
UNION ALL
-- MD2 (June 21)
SELECT gen_random_uuid(), 'group', 'L', 69,
    (SELECT id FROM team_ids WHERE code = 'ENG'),
    (SELECT id FROM team_ids WHERE code = 'GHA'),
    'scheduled', '2026-06-21 09:00:00-05:00'::timestamptz, 'BC Place (Vancouver)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'L', 70,
    (SELECT id FROM team_ids WHERE code = 'CRO'),
    (SELECT id FROM team_ids WHERE code = 'PAN'),
    'scheduled', '2026-06-21 06:00:00-05:00'::timestamptz, 'Lumen Field (Seattle)'
UNION ALL
-- MD3 (June 26)
SELECT gen_random_uuid(), 'group', 'L', 71,
    (SELECT id FROM team_ids WHERE code = 'ENG'),
    (SELECT id FROM team_ids WHERE code = 'PAN'),
    'scheduled', '2026-06-26 15:00:00-05:00'::timestamptz, 'Arrowhead Stadium (Kansas City)'
UNION ALL
SELECT gen_random_uuid(), 'group', 'L', 72,
    (SELECT id FROM team_ids WHERE code = 'CRO'),
    (SELECT id FROM team_ids WHERE code = 'GHA'),
    'scheduled', '2026-06-26 15:00:00-05:00'::timestamptz, 'BC Place (Vancouver)'
UNION ALL

-- =============================================================================
-- ROUND OF 32: 16 matches (June 28 - July 1, 2026)
-- Teams TBD after group stage
-- =============================================================================
SELECT gen_random_uuid(), 'round_32', NULL, 73, NULL, NULL,
    'scheduled', '2026-06-28 12:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 74, NULL, NULL,
    'scheduled', '2026-06-28 15:00:00-05:00'::timestamptz, 'SoFi Stadium (Inglewood)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 75, NULL, NULL,
    'scheduled', '2026-06-28 18:00:00-05:00'::timestamptz, 'Estadio Azteca (Mexico City)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 76, NULL, NULL,
    'scheduled', '2026-06-28 21:00:00-05:00'::timestamptz, 'AT&T Stadium (Arlington)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 77, NULL, NULL,
    'scheduled', '2026-06-29 12:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 78, NULL, NULL,
    'scheduled', '2026-06-29 15:00:00-05:00'::timestamptz, 'NRG Stadium (Houston)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 79, NULL, NULL,
    'scheduled', '2026-06-29 18:00:00-05:00'::timestamptz, 'Lumen Field (Seattle)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 80, NULL, NULL,
    'scheduled', '2026-06-29 21:00:00-05:00'::timestamptz, 'BMO Field (Toronto)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 81, NULL, NULL,
    'scheduled', '2026-06-30 12:00:00-05:00'::timestamptz, 'Mercedes-Benz Stadium (Atlanta)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 82, NULL, NULL,
    'scheduled', '2026-06-30 15:00:00-05:00'::timestamptz, 'Lincoln Financial Field (Philadelphia)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 83, NULL, NULL,
    'scheduled', '2026-06-30 18:00:00-05:00'::timestamptz, 'Estadio BBVA (Monterrey)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 84, NULL, NULL,
    'scheduled', '2026-06-30 21:00:00-05:00'::timestamptz, 'Gillette Stadium (Foxborough)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 85, NULL, NULL,
    'scheduled', '2026-07-01 12:00:00-05:00'::timestamptz, 'BC Place (Vancouver)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 86, NULL, NULL,
    'scheduled', '2026-07-01 15:00:00-05:00'::timestamptz, 'Arrowhead Stadium (Kansas City)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 87, NULL, NULL,
    'scheduled', '2026-07-01 18:00:00-05:00'::timestamptz, 'Levi''s Stadium (Santa Clara)'
UNION ALL
SELECT gen_random_uuid(), 'round_32', NULL, 88, NULL, NULL,
    'scheduled', '2026-07-01 21:00:00-05:00'::timestamptz, 'Estadio Guadalajara'
UNION ALL

-- =============================================================================
-- ROUND OF 16: 8 matches (July 3-5, 2026)
-- =============================================================================
SELECT gen_random_uuid(), 'round_16', NULL, 89, NULL, NULL,
    'scheduled', '2026-07-03 12:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
UNION ALL
SELECT gen_random_uuid(), 'round_16', NULL, 90, NULL, NULL,
    'scheduled', '2026-07-03 16:00:00-05:00'::timestamptz, 'SoFi Stadium (Inglewood)'
UNION ALL
SELECT gen_random_uuid(), 'round_16', NULL, 91, NULL, NULL,
    'scheduled', '2026-07-03 20:00:00-05:00'::timestamptz, 'AT&T Stadium (Arlington)'
UNION ALL
SELECT gen_random_uuid(), 'round_16', NULL, 92, NULL, NULL,
    'scheduled', '2026-07-04 12:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL
SELECT gen_random_uuid(), 'round_16', NULL, 93, NULL, NULL,
    'scheduled', '2026-07-04 16:00:00-05:00'::timestamptz, 'Estadio Azteca (Mexico City)'
UNION ALL
SELECT gen_random_uuid(), 'round_16', NULL, 94, NULL, NULL,
    'scheduled', '2026-07-04 20:00:00-05:00'::timestamptz, 'NRG Stadium (Houston)'
UNION ALL
SELECT gen_random_uuid(), 'round_16', NULL, 95, NULL, NULL,
    'scheduled', '2026-07-05 12:00:00-05:00'::timestamptz, 'Lumen Field (Seattle)'
UNION ALL
SELECT gen_random_uuid(), 'round_16', NULL, 96, NULL, NULL,
    'scheduled', '2026-07-05 16:00:00-05:00'::timestamptz, 'Mercedes-Benz Stadium (Atlanta)'
UNION ALL

-- =============================================================================
-- QUARTERFINALS: 4 matches (July 8-9, 2026)
-- =============================================================================
SELECT gen_random_uuid(), 'quarter', NULL, 97, NULL, NULL,
    'scheduled', '2026-07-08 12:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
UNION ALL
SELECT gen_random_uuid(), 'quarter', NULL, 98, NULL, NULL,
    'scheduled', '2026-07-08 17:00:00-05:00'::timestamptz, 'SoFi Stadium (Inglewood)'
UNION ALL
SELECT gen_random_uuid(), 'quarter', NULL, 99, NULL, NULL,
    'scheduled', '2026-07-09 12:00:00-05:00'::timestamptz, 'AT&T Stadium (Arlington)'
UNION ALL
SELECT gen_random_uuid(), 'quarter', NULL, 100, NULL, NULL,
    'scheduled', '2026-07-09 17:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL

-- =============================================================================
-- SEMIFINALS: 2 matches (July 12-13, 2026)
-- =============================================================================
SELECT gen_random_uuid(), 'semi', NULL, 101, NULL, NULL,
    'scheduled', '2026-07-12 15:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
UNION ALL
SELECT gen_random_uuid(), 'semi', NULL, 102, NULL, NULL,
    'scheduled', '2026-07-13 15:00:00-05:00'::timestamptz, 'AT&T Stadium (Arlington)'
UNION ALL

-- =============================================================================
-- THIRD-PLACE MATCH (July 16, 2026)
-- =============================================================================
SELECT gen_random_uuid(), 'third_place', NULL, 103, NULL, NULL,
    'scheduled', '2026-07-16 15:00:00-05:00'::timestamptz, 'Hard Rock Stadium (Miami)'
UNION ALL

-- =============================================================================
-- FINAL (July 19, 2026)
-- =============================================================================
SELECT gen_random_uuid(), 'final', NULL, 104, NULL, NULL,
    'scheduled', '2026-07-19 15:00:00-05:00'::timestamptz, 'MetLife Stadium (East Rutherford)'
;
