-- Migration 008: Complete fixture correction
-- Updates team assignments, dates, times, and venues for all 104 matches.
-- Based on the official FIFA 2026 World Cup schedule.
-- All timestamps are in EST (UTC-5, offset -05:00).

BEGIN;

-- ============================================================
-- GROUP STAGE: Match Day 1
-- ============================================================

-- #1: Mexico vs South Africa (Group A)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'MEX'),
  away_team_id = (SELECT id FROM teams WHERE code = 'RSA'),
  group_letter = 'A',
  match_date = '2026-06-11 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Ciudad de México'
WHERE match_number = 1;

-- #2: South Korea vs Denmark (Group A)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'KOR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'DEN'),
  group_letter = 'A',
  match_date = '2026-06-11 22:00:00-05:00'::timestamptz,
  venue = 'Estadio Guadalajara'
WHERE match_number = 2;

-- #3: Canada vs Italy (Group B)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'CAN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'ITA'),
  group_letter = 'B',
  match_date = '2026-06-12 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Toronto'
WHERE match_number = 3;

-- #4: USA vs Paraguay (Group D)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'USA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'PAR'),
  group_letter = 'D',
  match_date = '2026-06-12 21:00:00-05:00'::timestamptz,
  venue = 'Estadio Los Ángeles'
WHERE match_number = 4;

-- #5: Haiti vs Scotland (Group C)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'HAI'),
  away_team_id = (SELECT id FROM teams WHERE code = 'SCO'),
  group_letter = 'C',
  match_date = '2026-06-13 21:00:00-05:00'::timestamptz,
  venue = 'Estadio Boston'
WHERE match_number = 5;

-- #6: Australia vs Turkey (Group D) — 12:00 AM = midnight after June 13
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'AUS'),
  away_team_id = (SELECT id FROM teams WHERE code = 'TUR'),
  group_letter = 'D',
  match_date = '2026-06-14 00:00:00-05:00'::timestamptz,
  venue = 'Estadio BC Place Vancouver'
WHERE match_number = 6;

-- #7: Brazil vs Morocco (Group C)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'BRA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'MAR'),
  group_letter = 'C',
  match_date = '2026-06-13 18:00:00-05:00'::timestamptz,
  venue = 'Estadio Nueva York Nueva Jersey'
WHERE match_number = 7;

-- #8: Qatar vs Switzerland (Group B)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'QAT'),
  away_team_id = (SELECT id FROM teams WHERE code = 'SUI'),
  group_letter = 'B',
  match_date = '2026-06-13 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Bahía de San Francisco'
WHERE match_number = 8;

-- #9: Ivory Coast vs Ecuador (Group E)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'CIV'),
  away_team_id = (SELECT id FROM teams WHERE code = 'ECU'),
  group_letter = 'E',
  match_date = '2026-06-14 19:00:00-05:00'::timestamptz,
  venue = 'Estadio Filadelfia'
WHERE match_number = 9;

-- #10: Germany vs Curaçao (Group E)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'GER'),
  away_team_id = (SELECT id FROM teams WHERE code = 'CUW'),
  group_letter = 'E',
  match_date = '2026-06-14 13:00:00-05:00'::timestamptz,
  venue = 'Estadio Houston'
WHERE match_number = 10;

-- #11: Netherlands vs Japan (Group F)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'NED'),
  away_team_id = (SELECT id FROM teams WHERE code = 'JPN'),
  group_letter = 'F',
  match_date = '2026-06-14 16:00:00-05:00'::timestamptz,
  venue = 'Estadio Dallas'
WHERE match_number = 11;

-- #12: Ukraine vs Tunisia (Group F)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'UKR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'TUN'),
  group_letter = 'F',
  match_date = '2026-06-14 22:00:00-05:00'::timestamptz,
  venue = 'Estadio Monterrey'
WHERE match_number = 12;

-- #13: Saudi Arabia vs Uruguay (Group H)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'KSA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'URU'),
  group_letter = 'H',
  match_date = '2026-06-15 18:00:00-05:00'::timestamptz,
  venue = 'Estadio Miami'
WHERE match_number = 13;

-- #14: Spain vs Cape Verde (Group H)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ESP'),
  away_team_id = (SELECT id FROM teams WHERE code = 'CPV'),
  group_letter = 'H',
  match_date = '2026-06-15 12:00:00-05:00'::timestamptz,
  venue = 'Estadio Atlanta'
WHERE match_number = 14;

-- #15: Iran vs New Zealand (Group G)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'IRN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'NZL'),
  group_letter = 'G',
  match_date = '2026-06-15 21:00:00-05:00'::timestamptz,
  venue = 'Estadio Los Ángeles'
WHERE match_number = 15;

-- #16: Belgium vs Egypt (Group G)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'BEL'),
  away_team_id = (SELECT id FROM teams WHERE code = 'EGY'),
  group_letter = 'G',
  match_date = '2026-06-15 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Seattle'
WHERE match_number = 16;

-- #17: France vs Senegal (Group I)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'FRA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'SEN'),
  group_letter = 'I',
  match_date = '2026-06-16 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Nueva York Nueva Jersey'
WHERE match_number = 17;

-- #18: Bolivia vs Norway (Group I)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'BOL'),
  away_team_id = (SELECT id FROM teams WHERE code = 'NOR'),
  group_letter = 'I',
  match_date = '2026-06-16 18:00:00-05:00'::timestamptz,
  venue = 'Estadio Boston'
WHERE match_number = 18;

-- #19: Argentina vs Algeria (Group J)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ARG'),
  away_team_id = (SELECT id FROM teams WHERE code = 'ALG'),
  group_letter = 'J',
  match_date = '2026-06-16 21:00:00-05:00'::timestamptz,
  venue = 'Estadio Kansas City'
WHERE match_number = 19;

-- #20: Austria vs Jordan (Group J) — 12:00 AM = midnight after June 16
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'AUT'),
  away_team_id = (SELECT id FROM teams WHERE code = 'JOR'),
  group_letter = 'J',
  match_date = '2026-06-17 00:00:00-05:00'::timestamptz,
  venue = 'Estadio Bahía de San Francisco'
WHERE match_number = 20;

-- #21: Ghana vs Panama (Group L)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'GHA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'PAN'),
  group_letter = 'L',
  match_date = '2026-06-17 19:00:00-05:00'::timestamptz,
  venue = 'Estadio Toronto'
WHERE match_number = 21;

-- #22: England vs Croatia (Group L)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ENG'),
  away_team_id = (SELECT id FROM teams WHERE code = 'CRO'),
  group_letter = 'L',
  match_date = '2026-06-17 16:00:00-05:00'::timestamptz,
  venue = 'Estadio Dallas'
WHERE match_number = 22;

-- #23: Portugal vs DR Congo (Group K)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'POR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'COD'),
  group_letter = 'K',
  match_date = '2026-06-17 13:00:00-05:00'::timestamptz,
  venue = 'Estadio Houston'
WHERE match_number = 23;

-- #24: Uzbekistan vs Colombia (Group K)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'UZB'),
  away_team_id = (SELECT id FROM teams WHERE code = 'COL'),
  group_letter = 'K',
  match_date = '2026-06-17 22:00:00-05:00'::timestamptz,
  venue = 'Estadio Ciudad de México'
WHERE match_number = 24;

-- ============================================================
-- GROUP STAGE: Match Day 2
-- ============================================================

-- #25: Denmark vs South Africa (Group A)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'DEN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'RSA'),
  group_letter = 'A',
  match_date = '2026-06-18 12:00:00-05:00'::timestamptz,
  venue = 'Estadio Atlanta'
WHERE match_number = 25;

-- #26: Switzerland vs Italy (Group B)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'SUI'),
  away_team_id = (SELECT id FROM teams WHERE code = 'ITA'),
  group_letter = 'B',
  match_date = '2026-06-18 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Los Ángeles'
WHERE match_number = 26;

-- #27: Canada vs Qatar (Group B)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'CAN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'QAT'),
  group_letter = 'B',
  match_date = '2026-06-18 18:00:00-05:00'::timestamptz,
  venue = 'Estadio BC Place Vancouver'
WHERE match_number = 27;

-- #28: Mexico vs South Korea (Group A)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'MEX'),
  away_team_id = (SELECT id FROM teams WHERE code = 'KOR'),
  group_letter = 'A',
  match_date = '2026-06-18 21:00:00-05:00'::timestamptz,
  venue = 'Estadio Guadalajara'
WHERE match_number = 28;

-- #29: Brazil vs Haiti (Group C)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'BRA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'HAI'),
  group_letter = 'C',
  match_date = '2026-06-19 21:00:00-05:00'::timestamptz,
  venue = 'Estadio Filadelfia'
WHERE match_number = 29;

-- #30: Scotland vs Morocco (Group C)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'SCO'),
  away_team_id = (SELECT id FROM teams WHERE code = 'MAR'),
  group_letter = 'C',
  match_date = '2026-06-19 18:00:00-05:00'::timestamptz,
  venue = 'Estadio Boston'
WHERE match_number = 30;

-- #31: Turkey vs Paraguay (Group D) — 12:00 AM = midnight after June 19
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'TUR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'PAR'),
  group_letter = 'D',
  match_date = '2026-06-20 00:00:00-05:00'::timestamptz,
  venue = 'Estadio Bahía de San Francisco'
WHERE match_number = 31;

-- #32: USA vs Australia (Group D)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'USA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'AUS'),
  group_letter = 'D',
  match_date = '2026-06-19 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Seattle'
WHERE match_number = 32;

-- #33: Germany vs Ivory Coast (Group E)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'GER'),
  away_team_id = (SELECT id FROM teams WHERE code = 'CIV'),
  group_letter = 'E',
  match_date = '2026-06-20 16:00:00-05:00'::timestamptz,
  venue = 'Estadio Toronto'
WHERE match_number = 33;

-- #34: Ecuador vs Curaçao (Group E)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ECU'),
  away_team_id = (SELECT id FROM teams WHERE code = 'CUW'),
  group_letter = 'E',
  match_date = '2026-06-20 20:00:00-05:00'::timestamptz,
  venue = 'Estadio Kansas City'
WHERE match_number = 34;

-- #35: Netherlands vs Ukraine (Group F)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'NED'),
  away_team_id = (SELECT id FROM teams WHERE code = 'UKR'),
  group_letter = 'F',
  match_date = '2026-06-20 13:00:00-05:00'::timestamptz,
  venue = 'Estadio Houston'
WHERE match_number = 35;

-- #36: Tunisia vs Japan (Group F) — 12:00 AM = midnight after June 20
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'TUN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'JPN'),
  group_letter = 'F',
  match_date = '2026-06-21 00:00:00-05:00'::timestamptz,
  venue = 'Estadio Monterrey'
WHERE match_number = 36;

-- #37: Uruguay vs Cape Verde (Group H)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'URU'),
  away_team_id = (SELECT id FROM teams WHERE code = 'CPV'),
  group_letter = 'H',
  match_date = '2026-06-21 18:00:00-05:00'::timestamptz,
  venue = 'Estadio Miami'
WHERE match_number = 37;

-- #38: Spain vs Saudi Arabia (Group H)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ESP'),
  away_team_id = (SELECT id FROM teams WHERE code = 'KSA'),
  group_letter = 'H',
  match_date = '2026-06-21 12:00:00-05:00'::timestamptz,
  venue = 'Estadio Atlanta'
WHERE match_number = 38;

-- #39: Belgium vs Iran (Group G)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'BEL'),
  away_team_id = (SELECT id FROM teams WHERE code = 'IRN'),
  group_letter = 'G',
  match_date = '2026-06-21 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Los Ángeles'
WHERE match_number = 39;

-- #40: New Zealand vs Egypt (Group G)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'NZL'),
  away_team_id = (SELECT id FROM teams WHERE code = 'EGY'),
  group_letter = 'G',
  match_date = '2026-06-21 21:00:00-05:00'::timestamptz,
  venue = 'Estadio BC Place Vancouver'
WHERE match_number = 40;

-- #41: Norway vs Senegal (Group I)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'NOR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'SEN'),
  group_letter = 'I',
  match_date = '2026-06-22 20:00:00-05:00'::timestamptz,
  venue = 'Estadio Nueva York Nueva Jersey'
WHERE match_number = 41;

-- #42: France vs Bolivia (Group I)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'FRA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'BOL'),
  group_letter = 'I',
  match_date = '2026-06-22 17:00:00-05:00'::timestamptz,
  venue = 'Estadio Filadelfia'
WHERE match_number = 42;

-- #43: Argentina vs Austria (Group J)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ARG'),
  away_team_id = (SELECT id FROM teams WHERE code = 'AUT'),
  group_letter = 'J',
  match_date = '2026-06-22 13:00:00-05:00'::timestamptz,
  venue = 'Estadio Dallas'
WHERE match_number = 43;

-- #44: Jordan vs Algeria (Group J)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'JOR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'ALG'),
  group_letter = 'J',
  match_date = '2026-06-22 23:00:00-05:00'::timestamptz,
  venue = 'Estadio Bahía de San Francisco'
WHERE match_number = 44;

-- #45: England vs Ghana (Group L)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ENG'),
  away_team_id = (SELECT id FROM teams WHERE code = 'GHA'),
  group_letter = 'L',
  match_date = '2026-06-23 16:00:00-05:00'::timestamptz,
  venue = 'Estadio Boston'
WHERE match_number = 45;

-- #46: Panama vs Croatia (Group L)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'PAN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'CRO'),
  group_letter = 'L',
  match_date = '2026-06-23 19:00:00-05:00'::timestamptz,
  venue = 'Estadio Toronto'
WHERE match_number = 46;

-- #47: Portugal vs Uzbekistan (Group K)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'POR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'UZB'),
  group_letter = 'K',
  match_date = '2026-06-23 13:00:00-05:00'::timestamptz,
  venue = 'Estadio Houston'
WHERE match_number = 47;

-- #48: Colombia vs DR Congo (Group K)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'COL'),
  away_team_id = (SELECT id FROM teams WHERE code = 'COD'),
  group_letter = 'K',
  match_date = '2026-06-23 22:00:00-05:00'::timestamptz,
  venue = 'Estadio Guadalajara'
WHERE match_number = 48;

-- ============================================================
-- GROUP STAGE: Match Day 3
-- ============================================================

-- #49: Scotland vs Brazil (Group C)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'SCO'),
  away_team_id = (SELECT id FROM teams WHERE code = 'BRA'),
  group_letter = 'C',
  match_date = '2026-06-24 18:00:00-05:00'::timestamptz,
  venue = 'Estadio Miami'
WHERE match_number = 49;

-- #50: Morocco vs Haiti (Group C)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'MAR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'HAI'),
  group_letter = 'C',
  match_date = '2026-06-24 18:00:00-05:00'::timestamptz,
  venue = 'Estadio Atlanta'
WHERE match_number = 50;

-- #51: Switzerland vs Canada (Group B)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'SUI'),
  away_team_id = (SELECT id FROM teams WHERE code = 'CAN'),
  group_letter = 'B',
  match_date = '2026-06-24 15:00:00-05:00'::timestamptz,
  venue = 'Estadio BC Place Vancouver'
WHERE match_number = 51;

-- #52: Italy vs Qatar (Group B)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ITA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'QAT'),
  group_letter = 'B',
  match_date = '2026-06-24 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Seattle'
WHERE match_number = 52;

-- #53: Denmark vs Mexico (Group A)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'DEN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'MEX'),
  group_letter = 'A',
  match_date = '2026-06-24 21:00:00-05:00'::timestamptz,
  venue = 'Estadio Ciudad de México'
WHERE match_number = 53;

-- #54: South Africa vs South Korea (Group A)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'RSA'),
  away_team_id = (SELECT id FROM teams WHERE code = 'KOR'),
  group_letter = 'A',
  match_date = '2026-06-24 21:00:00-05:00'::timestamptz,
  venue = 'Estadio Monterrey'
WHERE match_number = 54;

-- #55: Curaçao vs Ivory Coast (Group E)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'CUW'),
  away_team_id = (SELECT id FROM teams WHERE code = 'CIV'),
  group_letter = 'E',
  match_date = '2026-06-25 16:00:00-05:00'::timestamptz,
  venue = 'Estadio Filadelfia'
WHERE match_number = 55;

-- #56: Ecuador vs Germany (Group E)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ECU'),
  away_team_id = (SELECT id FROM teams WHERE code = 'GER'),
  group_letter = 'E',
  match_date = '2026-06-25 16:00:00-05:00'::timestamptz,
  venue = 'Estadio Nueva York Nueva Jersey'
WHERE match_number = 56;

-- #57: Japan vs Ukraine (Group F)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'JPN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'UKR'),
  group_letter = 'F',
  match_date = '2026-06-25 19:00:00-05:00'::timestamptz,
  venue = 'Estadio Dallas'
WHERE match_number = 57;

-- #58: Tunisia vs Netherlands (Group F)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'TUN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'NED'),
  group_letter = 'F',
  match_date = '2026-06-25 19:00:00-05:00'::timestamptz,
  venue = 'Estadio Kansas City'
WHERE match_number = 58;

-- #59: Turkey vs USA (Group D)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'TUR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'USA'),
  group_letter = 'D',
  match_date = '2026-06-25 22:00:00-05:00'::timestamptz,
  venue = 'Estadio Los Ángeles'
WHERE match_number = 59;

-- #60: Paraguay vs Australia (Group D)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'PAR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'AUS'),
  group_letter = 'D',
  match_date = '2026-06-25 22:00:00-05:00'::timestamptz,
  venue = 'Estadio Bahía de San Francisco'
WHERE match_number = 60;

-- #61: Norway vs France (Group I)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'NOR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'FRA'),
  group_letter = 'I',
  match_date = '2026-06-26 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Boston'
WHERE match_number = 61;

-- #62: Senegal vs Bolivia (Group I)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'SEN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'BOL'),
  group_letter = 'I',
  match_date = '2026-06-26 15:00:00-05:00'::timestamptz,
  venue = 'Estadio Toronto'
WHERE match_number = 62;

-- #63: Egypt vs Iran (Group G)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'EGY'),
  away_team_id = (SELECT id FROM teams WHERE code = 'IRN'),
  group_letter = 'G',
  match_date = '2026-06-26 23:00:00-05:00'::timestamptz,
  venue = 'Estadio Seattle'
WHERE match_number = 63;

-- #64: New Zealand vs Belgium (Group G)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'NZL'),
  away_team_id = (SELECT id FROM teams WHERE code = 'BEL'),
  group_letter = 'G',
  match_date = '2026-06-26 23:00:00-05:00'::timestamptz,
  venue = 'Estadio BC Place Vancouver'
WHERE match_number = 64;

-- #65: Cape Verde vs Saudi Arabia (Group H)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'CPV'),
  away_team_id = (SELECT id FROM teams WHERE code = 'KSA'),
  group_letter = 'H',
  match_date = '2026-06-26 20:00:00-05:00'::timestamptz,
  venue = 'Estadio Houston'
WHERE match_number = 65;

-- #66: Uruguay vs Spain (Group H)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'URU'),
  away_team_id = (SELECT id FROM teams WHERE code = 'ESP'),
  group_letter = 'H',
  match_date = '2026-06-26 20:00:00-05:00'::timestamptz,
  venue = 'Estadio Guadalajara'
WHERE match_number = 66;

-- #67: Panama vs England (Group L)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'PAN'),
  away_team_id = (SELECT id FROM teams WHERE code = 'ENG'),
  group_letter = 'L',
  match_date = '2026-06-27 17:00:00-05:00'::timestamptz,
  venue = 'Estadio Nueva York Nueva Jersey'
WHERE match_number = 67;

-- #68: Croatia vs Ghana (Group L)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'CRO'),
  away_team_id = (SELECT id FROM teams WHERE code = 'GHA'),
  group_letter = 'L',
  match_date = '2026-06-27 17:00:00-05:00'::timestamptz,
  venue = 'Estadio Filadelfia'
WHERE match_number = 68;

-- #69: Algeria vs Austria (Group J)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'ALG'),
  away_team_id = (SELECT id FROM teams WHERE code = 'AUT'),
  group_letter = 'J',
  match_date = '2026-06-27 22:00:00-05:00'::timestamptz,
  venue = 'Estadio Kansas City'
WHERE match_number = 69;

-- #70: Jordan vs Argentina (Group J)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'JOR'),
  away_team_id = (SELECT id FROM teams WHERE code = 'ARG'),
  group_letter = 'J',
  match_date = '2026-06-27 22:00:00-05:00'::timestamptz,
  venue = 'Estadio Dallas'
WHERE match_number = 70;

-- #71: Colombia vs Portugal (Group K)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'COL'),
  away_team_id = (SELECT id FROM teams WHERE code = 'POR'),
  group_letter = 'K',
  match_date = '2026-06-27 19:30:00-05:00'::timestamptz,
  venue = 'Estadio Miami'
WHERE match_number = 71;

-- #72: DR Congo vs Uzbekistan (Group K)
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE code = 'COD'),
  away_team_id = (SELECT id FROM teams WHERE code = 'UZB'),
  group_letter = 'K',
  match_date = '2026-06-27 19:30:00-05:00'::timestamptz,
  venue = 'Estadio Atlanta'
WHERE match_number = 72;

-- ============================================================
-- ROUND OF 32 (teams TBD)
-- ============================================================

UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-06-28 15:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 73;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-06-29 16:30:00-05:00'::timestamptz, venue = 'Estadio Boston' WHERE match_number = 74;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-06-29 21:00:00-05:00'::timestamptz, venue = 'Estadio Monterrey' WHERE match_number = 75;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-06-29 13:00:00-05:00'::timestamptz, venue = 'Estadio Houston' WHERE match_number = 76;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-06-30 17:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 77;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-06-30 13:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 78;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-06-30 21:00:00-05:00'::timestamptz, venue = 'Estadio Ciudad de México' WHERE match_number = 79;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-01 12:00:00-05:00'::timestamptz, venue = 'Estadio Atlanta' WHERE match_number = 80;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-01 20:00:00-05:00'::timestamptz, venue = 'Estadio Bahía de San Francisco' WHERE match_number = 81;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-01 16:00:00-05:00'::timestamptz, venue = 'Estadio Seattle' WHERE match_number = 82;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-02 19:00:00-05:00'::timestamptz, venue = 'Estadio Toronto' WHERE match_number = 83;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-02 15:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 84;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-02 23:00:00-05:00'::timestamptz, venue = 'Estadio BC Place Vancouver' WHERE match_number = 85;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-03 18:00:00-05:00'::timestamptz, venue = 'Estadio Miami' WHERE match_number = 86;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-03 21:30:00-05:00'::timestamptz, venue = 'Estadio Kansas City' WHERE match_number = 87;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-03 14:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 88;

-- ============================================================
-- ROUND OF 16
-- ============================================================

UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-04 17:00:00-05:00'::timestamptz, venue = 'Estadio Filadelfia' WHERE match_number = 89;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-04 13:00:00-05:00'::timestamptz, venue = 'Estadio Houston' WHERE match_number = 90;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-05 16:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 91;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-05 20:00:00-05:00'::timestamptz, venue = 'Estadio Ciudad de México' WHERE match_number = 92;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-06 15:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 93;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-06 20:00:00-05:00'::timestamptz, venue = 'Estadio Seattle' WHERE match_number = 94;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-07 12:00:00-05:00'::timestamptz, venue = 'Estadio Atlanta' WHERE match_number = 95;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-07 16:00:00-05:00'::timestamptz, venue = 'Estadio BC Place Vancouver' WHERE match_number = 96;

-- ============================================================
-- QUARTERFINALS
-- ============================================================

UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-09 16:00:00-05:00'::timestamptz, venue = 'Estadio Boston' WHERE match_number = 97;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-10 15:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 98;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-11 17:00:00-05:00'::timestamptz, venue = 'Estadio Miami' WHERE match_number = 99;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-11 21:00:00-05:00'::timestamptz, venue = 'Estadio Kansas City' WHERE match_number = 100;

-- ============================================================
-- SEMIFINALS
-- ============================================================

UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-14 15:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 101;
UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-15 15:00:00-05:00'::timestamptz, venue = 'Estadio Atlanta' WHERE match_number = 102;

-- ============================================================
-- THIRD PLACE
-- ============================================================

UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-18 17:00:00-05:00'::timestamptz, venue = 'Estadio Miami' WHERE match_number = 103;

-- ============================================================
-- FINAL
-- ============================================================

UPDATE matches SET home_team_id = NULL, away_team_id = NULL, match_date = '2026-07-19 15:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 104;

COMMIT;
