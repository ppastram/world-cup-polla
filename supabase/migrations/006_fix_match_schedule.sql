-- Migration 006: Fix match schedule
-- Corrects match dates, times, and venues for the 2026 FIFA World Cup.
-- All timestamps are in EST (UTC-5, offset -05:00).

BEGIN;

-- ============================================================
-- GROUP STAGE
-- ============================================================

-- Matchday 1
UPDATE matches SET match_date = '2026-06-11 15:00:00-05:00'::timestamptz, venue = 'Estadio Ciudad de México' WHERE match_number = 1;
UPDATE matches SET match_date = '2026-06-11 22:00:00-05:00'::timestamptz, venue = 'Estadio Guadalajara' WHERE match_number = 2;
UPDATE matches SET match_date = '2026-06-12 15:00:00-05:00'::timestamptz, venue = 'Estadio Toronto' WHERE match_number = 3;
UPDATE matches SET match_date = '2026-06-12 21:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 4;
UPDATE matches SET match_date = '2026-06-13 15:00:00-05:00'::timestamptz, venue = 'Estadio Bahía de San Francisco' WHERE match_number = 5;
UPDATE matches SET match_date = '2026-06-13 18:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 6;
UPDATE matches SET match_date = '2026-06-13 21:00:00-05:00'::timestamptz, venue = 'Estadio Boston' WHERE match_number = 7;

-- Matchday 2
UPDATE matches SET match_date = '2026-06-15 12:00:00-05:00'::timestamptz, venue = 'Estadio Atlanta' WHERE match_number = 13;
UPDATE matches SET match_date = '2026-06-15 15:00:00-05:00'::timestamptz, venue = 'Estadio Seattle' WHERE match_number = 14;
UPDATE matches SET match_date = '2026-06-15 18:00:00-05:00'::timestamptz, venue = 'Estadio Miami' WHERE match_number = 15;
UPDATE matches SET match_date = '2026-06-15 21:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 16;
UPDATE matches SET match_date = '2026-06-16 15:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 17;
UPDATE matches SET match_date = '2026-06-16 18:00:00-05:00'::timestamptz, venue = 'Estadio Boston' WHERE match_number = 18;
UPDATE matches SET match_date = '2026-06-16 21:00:00-05:00'::timestamptz, venue = 'Estadio Kansas City' WHERE match_number = 19;
UPDATE matches SET match_date = '2026-06-17 00:00:00-05:00'::timestamptz, venue = 'Estadio Bahía de San Francisco' WHERE match_number = 20;
UPDATE matches SET match_date = '2026-06-17 13:00:00-05:00'::timestamptz, venue = 'Estadio Houston' WHERE match_number = 21;

-- Matchday 2 continued
UPDATE matches SET match_date = '2026-06-18 12:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 25;
UPDATE matches SET match_date = '2026-06-18 18:00:00-05:00'::timestamptz, venue = 'Estadio BC Place Vancouver' WHERE match_number = 27;
UPDATE matches SET match_date = '2026-06-18 21:00:00-05:00'::timestamptz, venue = 'Estadio Guadalajara' WHERE match_number = 28;
UPDATE matches SET match_date = '2026-06-19 15:00:00-05:00'::timestamptz, venue = 'Estadio Seattle' WHERE match_number = 29;
UPDATE matches SET match_date = '2026-06-19 18:00:00-05:00'::timestamptz, venue = 'Estadio Boston' WHERE match_number = 30;
UPDATE matches SET match_date = '2026-06-19 21:00:00-05:00'::timestamptz, venue = 'Estadio Filadelfia' WHERE match_number = 31;
UPDATE matches SET match_date = '2026-06-20 00:00:00-05:00'::timestamptz, venue = 'Estadio Bahía de San Francisco' WHERE match_number = 32;
UPDATE matches SET match_date = '2026-06-20 13:00:00-05:00'::timestamptz, venue = 'Estadio Houston' WHERE match_number = 33;
UPDATE matches SET match_date = '2026-06-20 16:00:00-05:00'::timestamptz, venue = 'Estadio Toronto' WHERE match_number = 34;
UPDATE matches SET match_date = '2026-06-20 22:00:00-05:00'::timestamptz, venue = 'Estadio Kansas City' WHERE match_number = 35;
UPDATE matches SET match_date = '2026-06-21 00:00:00-05:00'::timestamptz, venue = 'Estadio Monterrey' WHERE match_number = 36;

-- Matchday 3
UPDATE matches SET match_date = '2026-06-21 21:00:00-05:00'::timestamptz, venue = 'Estadio BC Place Vancouver' WHERE match_number = 41;
UPDATE matches SET match_date = '2026-06-22 13:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 42;
UPDATE matches SET match_date = '2026-06-22 17:00:00-05:00'::timestamptz, venue = 'Estadio Filadelfia' WHERE match_number = 43;
UPDATE matches SET match_date = '2026-06-22 20:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 44;
UPDATE matches SET match_date = '2026-06-22 23:00:00-05:00'::timestamptz, venue = 'Estadio Bahía de San Francisco' WHERE match_number = 45;
UPDATE matches SET match_date = '2026-06-23 13:00:00-05:00'::timestamptz, venue = 'Estadio Houston' WHERE match_number = 46;
UPDATE matches SET match_date = '2026-06-23 19:00:00-05:00'::timestamptz, venue = 'Estadio Toronto' WHERE match_number = 47;
UPDATE matches SET match_date = '2026-06-23 22:00:00-05:00'::timestamptz, venue = 'Estadio Guadalajara' WHERE match_number = 49;

-- Matchday 3 continued (simultaneous kickoffs)
UPDATE matches SET match_date = '2026-06-24 18:00:00-05:00'::timestamptz, venue = 'Estadio Atlanta' WHERE match_number = 53;
UPDATE matches SET match_date = '2026-06-24 21:00:00-05:00'::timestamptz, venue = 'Estadio Ciudad de México' WHERE match_number = 54;
UPDATE matches SET match_date = '2026-06-24 21:00:00-05:00'::timestamptz, venue = 'Estadio Monterrey' WHERE match_number = 55;
UPDATE matches SET match_date = '2026-06-25 16:00:00-05:00'::timestamptz, venue = 'Estadio Filadelfia' WHERE match_number = 57;
UPDATE matches SET match_date = '2026-06-25 16:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 58;
UPDATE matches SET match_date = '2026-06-25 19:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 59;
UPDATE matches SET match_date = '2026-06-25 19:00:00-05:00'::timestamptz, venue = 'Estadio Kansas City' WHERE match_number = 60;
UPDATE matches SET match_date = '2026-06-25 22:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 61;
UPDATE matches SET match_date = '2026-06-25 22:00:00-05:00'::timestamptz, venue = 'Estadio Bahía de San Francisco' WHERE match_number = 62;
UPDATE matches SET match_date = '2026-06-26 15:00:00-05:00'::timestamptz, venue = 'Estadio Boston' WHERE match_number = 63;
UPDATE matches SET match_date = '2026-06-26 15:00:00-05:00'::timestamptz, venue = 'Estadio Toronto' WHERE match_number = 64;
UPDATE matches SET match_date = '2026-06-26 20:00:00-05:00'::timestamptz, venue = 'Estadio Houston' WHERE match_number = 65;
UPDATE matches SET match_date = '2026-06-26 20:00:00-05:00'::timestamptz, venue = 'Estadio Guadalajara' WHERE match_number = 66;
UPDATE matches SET match_date = '2026-06-26 23:00:00-05:00'::timestamptz, venue = 'Estadio Seattle' WHERE match_number = 67;
UPDATE matches SET match_date = '2026-06-26 23:00:00-05:00'::timestamptz, venue = 'Estadio BC Place Vancouver' WHERE match_number = 68;
UPDATE matches SET match_date = '2026-06-27 17:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 69;
UPDATE matches SET match_date = '2026-06-27 17:00:00-05:00'::timestamptz, venue = 'Estadio Filadelfia' WHERE match_number = 70;
UPDATE matches SET match_date = '2026-06-27 19:30:00-05:00'::timestamptz, venue = 'Estadio Miami' WHERE match_number = 71;
UPDATE matches SET match_date = '2026-06-27 19:30:00-05:00'::timestamptz, venue = 'Estadio Atlanta' WHERE match_number = 72;

-- ============================================================
-- ROUND OF 32
-- ============================================================

-- 2026-06-28: 1 match → 15:00
UPDATE matches SET match_date = '2026-06-28 15:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 73;

-- 2026-06-29: 3 matches → 12:00, 16:00, 20:00
UPDATE matches SET match_date = '2026-06-29 12:00:00-05:00'::timestamptz, venue = 'Estadio Boston' WHERE match_number = 74;
UPDATE matches SET match_date = '2026-06-29 16:00:00-05:00'::timestamptz, venue = 'Estadio Monterrey' WHERE match_number = 75;
UPDATE matches SET match_date = '2026-06-29 20:00:00-05:00'::timestamptz, venue = 'Estadio Houston' WHERE match_number = 76;

-- 2026-06-30: 3 matches → 12:00, 16:00, 20:00
UPDATE matches SET match_date = '2026-06-30 12:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 77;
UPDATE matches SET match_date = '2026-06-30 16:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 78;
UPDATE matches SET match_date = '2026-06-30 20:00:00-05:00'::timestamptz, venue = 'Estadio Ciudad de México' WHERE match_number = 79;

-- 2026-07-01: 3 matches → 12:00, 16:00, 20:00
UPDATE matches SET match_date = '2026-07-01 12:00:00-05:00'::timestamptz, venue = 'Estadio Atlanta' WHERE match_number = 80;
UPDATE matches SET match_date = '2026-07-01 16:00:00-05:00'::timestamptz, venue = 'Estadio Bahía de San Francisco' WHERE match_number = 81;
UPDATE matches SET match_date = '2026-07-01 20:00:00-05:00'::timestamptz, venue = 'Estadio Seattle' WHERE match_number = 82;

-- 2026-07-02: 3 matches → 12:00, 16:00, 20:00
UPDATE matches SET match_date = '2026-07-02 12:00:00-05:00'::timestamptz, venue = 'Estadio Toronto' WHERE match_number = 83;
UPDATE matches SET match_date = '2026-07-02 16:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 84;
UPDATE matches SET match_date = '2026-07-02 20:00:00-05:00'::timestamptz, venue = 'Estadio BC Place Vancouver' WHERE match_number = 85;

-- 2026-07-03: 3 matches → 12:00, 16:00, 20:00
UPDATE matches SET match_date = '2026-07-03 12:00:00-05:00'::timestamptz, venue = 'Estadio Miami' WHERE match_number = 86;
UPDATE matches SET match_date = '2026-07-03 16:00:00-05:00'::timestamptz, venue = 'Estadio Kansas City' WHERE match_number = 87;
UPDATE matches SET match_date = '2026-07-03 20:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 88;

-- ============================================================
-- ROUND OF 16
-- ============================================================

-- 2026-07-04: 2 matches → 13:00, 17:00
UPDATE matches SET match_date = '2026-07-04 13:00:00-05:00'::timestamptz, venue = 'Estadio Filadelfia' WHERE match_number = 89;
UPDATE matches SET match_date = '2026-07-04 17:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 90;

-- 2026-07-05: 1 match → 15:00
UPDATE matches SET match_date = '2026-07-05 15:00:00-05:00'::timestamptz, venue = 'Estadio Ciudad de México' WHERE match_number = 92;

-- 2026-07-06: 2 matches → 13:00, 17:00
UPDATE matches SET match_date = '2026-07-06 13:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 93;
UPDATE matches SET match_date = '2026-07-06 17:00:00-05:00'::timestamptz, venue = 'Estadio Seattle' WHERE match_number = 94;

-- ============================================================
-- QUARTERFINALS
-- ============================================================

-- 2026-07-09: 2 matches → 13:00, 17:00
UPDATE matches SET match_date = '2026-07-09 13:00:00-05:00'::timestamptz, venue = 'Estadio Boston' WHERE match_number = 97;
UPDATE matches SET match_date = '2026-07-09 17:00:00-05:00'::timestamptz, venue = 'Estadio Los Ángeles' WHERE match_number = 98;

-- 2026-07-10: 2 matches → 13:00, 17:00
UPDATE matches SET match_date = '2026-07-10 13:00:00-05:00'::timestamptz, venue = 'Estadio Miami' WHERE match_number = 99;
UPDATE matches SET match_date = '2026-07-10 17:00:00-05:00'::timestamptz, venue = 'Estadio Kansas City' WHERE match_number = 100;

-- ============================================================
-- SEMIFINALS
-- ============================================================

-- 2026-07-14: 1 match → 15:00
UPDATE matches SET match_date = '2026-07-14 15:00:00-05:00'::timestamptz, venue = 'Estadio Dallas' WHERE match_number = 101;

-- 2026-07-15: 1 match → 15:00
UPDATE matches SET match_date = '2026-07-15 15:00:00-05:00'::timestamptz, venue = 'Estadio Atlanta' WHERE match_number = 102;

-- ============================================================
-- THIRD PLACE MATCH
-- ============================================================

-- 2026-07-18: 1 match → 15:00
UPDATE matches SET match_date = '2026-07-18 15:00:00-05:00'::timestamptz, venue = 'Estadio Miami' WHERE match_number = 103;

-- ============================================================
-- FINAL
-- ============================================================

-- 2026-07-19: 1 match → 15:00
UPDATE matches SET match_date = '2026-07-19 15:00:00-05:00'::timestamptz, venue = 'Estadio Nueva York Nueva Jersey' WHERE match_number = 104;

COMMIT;
