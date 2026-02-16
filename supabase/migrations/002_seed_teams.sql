-- =============================================================================
-- FIFA World Cup 2026 - Seed Teams
-- Official draw held December 5, 2025 at the Kennedy Center, Washington D.C.
--
-- NOTE: 6 teams are still TBD from playoffs (scheduled March 2026).
--       Placeholder teams are marked with comments. Update once playoffs resolve:
--       - UEFA Playoff A winner (Group B): Italy / Wales / N. Ireland / Bosnia
--       - UEFA Playoff B winner (Group F): Ukraine / Poland / Sweden / Albania
--       - UEFA Playoff C winner (Group D): Turkey / Romania / Slovakia / Kosovo
--       - UEFA Playoff D winner (Group A): Denmark / Czechia / N. Macedonia / Ireland
--       - FIFA Playoff 1 winner (Group K): DR Congo / Jamaica / New Caledonia
--       - FIFA Playoff 2 winner (Group I): Bolivia / Iraq / Suriname
-- =============================================================================

INSERT INTO teams (id, name, code, flag_url, group_letter, external_id) VALUES

-- Group A: Mexico, South Africa, Korea Republic, UEFA Playoff D winner
(gen_random_uuid(), 'Mexico',              'MEX', 'https://flagcdn.com/w80/mx.png', 'A', NULL),
(gen_random_uuid(), 'South Africa',        'RSA', 'https://flagcdn.com/w80/za.png', 'A', NULL),
(gen_random_uuid(), 'Korea Republic',      'KOR', 'https://flagcdn.com/w80/kr.png', 'A', NULL),
(gen_random_uuid(), 'Denmark',             'DEN', 'https://flagcdn.com/w80/dk.png', 'A', NULL), -- PLACEHOLDER: UEFA Playoff D winner

-- Group B: Canada, Switzerland, Qatar, UEFA Playoff A winner
(gen_random_uuid(), 'Canada',              'CAN', 'https://flagcdn.com/w80/ca.png', 'B', NULL),
(gen_random_uuid(), 'Switzerland',         'SUI', 'https://flagcdn.com/w80/ch.png', 'B', NULL),
(gen_random_uuid(), 'Qatar',               'QAT', 'https://flagcdn.com/w80/qa.png', 'B', NULL),
(gen_random_uuid(), 'Italy',               'ITA', 'https://flagcdn.com/w80/it.png', 'B', NULL), -- PLACEHOLDER: UEFA Playoff A winner

-- Group C: Brazil, Morocco, Haiti, Scotland
(gen_random_uuid(), 'Brazil',              'BRA', 'https://flagcdn.com/w80/br.png', 'C', NULL),
(gen_random_uuid(), 'Morocco',             'MAR', 'https://flagcdn.com/w80/ma.png', 'C', NULL),
(gen_random_uuid(), 'Haiti',               'HAI', 'https://flagcdn.com/w80/ht.png', 'C', NULL),
(gen_random_uuid(), 'Scotland',            'SCO', 'https://flagcdn.com/w80/gb-sct.png', 'C', NULL),

-- Group D: United States, Paraguay, Australia, UEFA Playoff C winner
(gen_random_uuid(), 'United States',       'USA', 'https://flagcdn.com/w80/us.png', 'D', NULL),
(gen_random_uuid(), 'Paraguay',            'PAR', 'https://flagcdn.com/w80/py.png', 'D', NULL),
(gen_random_uuid(), 'Australia',           'AUS', 'https://flagcdn.com/w80/au.png', 'D', NULL),
(gen_random_uuid(), 'Turkey',              'TUR', 'https://flagcdn.com/w80/tr.png', 'D', NULL), -- PLACEHOLDER: UEFA Playoff C winner

-- Group E: Germany, Ecuador, Ivory Coast, Curacao
(gen_random_uuid(), 'Germany',             'GER', 'https://flagcdn.com/w80/de.png', 'E', NULL),
(gen_random_uuid(), 'Ecuador',             'ECU', 'https://flagcdn.com/w80/ec.png', 'E', NULL),
(gen_random_uuid(), 'Ivory Coast',         'CIV', 'https://flagcdn.com/w80/ci.png', 'E', NULL),
(gen_random_uuid(), 'Curacao',             'CUW', 'https://flagcdn.com/w80/cw.png', 'E', NULL),

-- Group F: Netherlands, Japan, Tunisia, UEFA Playoff B winner
(gen_random_uuid(), 'Netherlands',         'NED', 'https://flagcdn.com/w80/nl.png', 'F', NULL),
(gen_random_uuid(), 'Japan',               'JPN', 'https://flagcdn.com/w80/jp.png', 'F', NULL),
(gen_random_uuid(), 'Tunisia',             'TUN', 'https://flagcdn.com/w80/tn.png', 'F', NULL),
(gen_random_uuid(), 'Ukraine',             'UKR', 'https://flagcdn.com/w80/ua.png', 'F', NULL), -- PLACEHOLDER: UEFA Playoff B winner

-- Group G: Belgium, Egypt, Iran, New Zealand
(gen_random_uuid(), 'Belgium',             'BEL', 'https://flagcdn.com/w80/be.png', 'G', NULL),
(gen_random_uuid(), 'Egypt',               'EGY', 'https://flagcdn.com/w80/eg.png', 'G', NULL),
(gen_random_uuid(), 'Iran',                'IRN', 'https://flagcdn.com/w80/ir.png', 'G', NULL),
(gen_random_uuid(), 'New Zealand',         'NZL', 'https://flagcdn.com/w80/nz.png', 'G', NULL),

-- Group H: Spain, Cape Verde, Saudi Arabia, Uruguay
(gen_random_uuid(), 'Spain',               'ESP', 'https://flagcdn.com/w80/es.png', 'H', NULL),
(gen_random_uuid(), 'Cape Verde',          'CPV', 'https://flagcdn.com/w80/cv.png', 'H', NULL),
(gen_random_uuid(), 'Saudi Arabia',        'KSA', 'https://flagcdn.com/w80/sa.png', 'H', NULL),
(gen_random_uuid(), 'Uruguay',             'URU', 'https://flagcdn.com/w80/uy.png', 'H', NULL),

-- Group I: France, Senegal, Norway, FIFA Playoff 2 winner
(gen_random_uuid(), 'France',              'FRA', 'https://flagcdn.com/w80/fr.png', 'I', NULL),
(gen_random_uuid(), 'Senegal',             'SEN', 'https://flagcdn.com/w80/sn.png', 'I', NULL),
(gen_random_uuid(), 'Norway',              'NOR', 'https://flagcdn.com/w80/no.png', 'I', NULL),
(gen_random_uuid(), 'Bolivia',             'BOL', 'https://flagcdn.com/w80/bo.png', 'I', NULL), -- PLACEHOLDER: FIFA Playoff 2 winner

-- Group J: Argentina, Algeria, Austria, Jordan
(gen_random_uuid(), 'Argentina',           'ARG', 'https://flagcdn.com/w80/ar.png', 'J', NULL),
(gen_random_uuid(), 'Algeria',             'ALG', 'https://flagcdn.com/w80/dz.png', 'J', NULL),
(gen_random_uuid(), 'Austria',             'AUT', 'https://flagcdn.com/w80/at.png', 'J', NULL),
(gen_random_uuid(), 'Jordan',              'JOR', 'https://flagcdn.com/w80/jo.png', 'J', NULL),

-- Group K: Portugal, Colombia, Uzbekistan, FIFA Playoff 1 winner
(gen_random_uuid(), 'Portugal',            'POR', 'https://flagcdn.com/w80/pt.png', 'K', NULL),
(gen_random_uuid(), 'Colombia',            'COL', 'https://flagcdn.com/w80/co.png', 'K', NULL),
(gen_random_uuid(), 'Uzbekistan',          'UZB', 'https://flagcdn.com/w80/uz.png', 'K', NULL),
(gen_random_uuid(), 'DR Congo',            'COD', 'https://flagcdn.com/w80/cd.png', 'K', NULL), -- PLACEHOLDER: FIFA Playoff 1 winner

-- Group L: England, Croatia, Ghana, Panama
(gen_random_uuid(), 'England',             'ENG', 'https://flagcdn.com/w80/gb-eng.png', 'L', NULL),
(gen_random_uuid(), 'Croatia',             'CRO', 'https://flagcdn.com/w80/hr.png', 'L', NULL),
(gen_random_uuid(), 'Ghana',               'GHA', 'https://flagcdn.com/w80/gh.png', 'L', NULL),
(gen_random_uuid(), 'Panama',              'PAN', 'https://flagcdn.com/w80/pa.png', 'L', NULL);
