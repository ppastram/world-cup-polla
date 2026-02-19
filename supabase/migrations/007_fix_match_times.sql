-- Migration 007: Fix match dates and times
-- Corrects match_date for all matches based on official FIFA schedule.
-- All timestamps are in EST (UTC-5, offset -05:00).
-- Venues are NOT changed (already corrected in 006).

BEGIN;

-- ============================================================
-- GROUP STAGE
-- ============================================================

UPDATE matches SET match_date = '2026-06-11 15:00:00-05:00'::timestamptz WHERE match_number = 1;
UPDATE matches SET match_date = '2026-06-11 22:00:00-05:00'::timestamptz WHERE match_number = 2;
UPDATE matches SET match_date = '2026-06-12 15:00:00-05:00'::timestamptz WHERE match_number = 3;
UPDATE matches SET match_date = '2026-06-12 21:00:00-05:00'::timestamptz WHERE match_number = 4;
UPDATE matches SET match_date = '2026-06-13 21:00:00-05:00'::timestamptz WHERE match_number = 5;
UPDATE matches SET match_date = '2026-06-14 00:00:00-05:00'::timestamptz WHERE match_number = 6;  -- 12:00 AM = midnight after June 13
UPDATE matches SET match_date = '2026-06-13 18:00:00-05:00'::timestamptz WHERE match_number = 7;
UPDATE matches SET match_date = '2026-06-13 15:00:00-05:00'::timestamptz WHERE match_number = 8;
UPDATE matches SET match_date = '2026-06-14 19:00:00-05:00'::timestamptz WHERE match_number = 9;
UPDATE matches SET match_date = '2026-06-14 13:00:00-05:00'::timestamptz WHERE match_number = 10;
UPDATE matches SET match_date = '2026-06-14 16:00:00-05:00'::timestamptz WHERE match_number = 11;
UPDATE matches SET match_date = '2026-06-14 22:00:00-05:00'::timestamptz WHERE match_number = 12;
UPDATE matches SET match_date = '2026-06-15 18:00:00-05:00'::timestamptz WHERE match_number = 13;
UPDATE matches SET match_date = '2026-06-15 12:00:00-05:00'::timestamptz WHERE match_number = 14;
UPDATE matches SET match_date = '2026-06-15 21:00:00-05:00'::timestamptz WHERE match_number = 15;
UPDATE matches SET match_date = '2026-06-15 15:00:00-05:00'::timestamptz WHERE match_number = 16;
UPDATE matches SET match_date = '2026-06-16 15:00:00-05:00'::timestamptz WHERE match_number = 17;
UPDATE matches SET match_date = '2026-06-16 18:00:00-05:00'::timestamptz WHERE match_number = 18;
UPDATE matches SET match_date = '2026-06-16 21:00:00-05:00'::timestamptz WHERE match_number = 19;
UPDATE matches SET match_date = '2026-06-17 00:00:00-05:00'::timestamptz WHERE match_number = 20;  -- 12:00 AM = midnight after June 16
UPDATE matches SET match_date = '2026-06-17 19:00:00-05:00'::timestamptz WHERE match_number = 21;
UPDATE matches SET match_date = '2026-06-17 16:00:00-05:00'::timestamptz WHERE match_number = 22;
UPDATE matches SET match_date = '2026-06-17 13:00:00-05:00'::timestamptz WHERE match_number = 23;
UPDATE matches SET match_date = '2026-06-17 22:00:00-05:00'::timestamptz WHERE match_number = 24;
UPDATE matches SET match_date = '2026-06-18 12:00:00-05:00'::timestamptz WHERE match_number = 25;
UPDATE matches SET match_date = '2026-06-18 18:00:00-05:00'::timestamptz WHERE match_number = 27;
UPDATE matches SET match_date = '2026-06-18 21:00:00-05:00'::timestamptz WHERE match_number = 28;
UPDATE matches SET match_date = '2026-06-19 21:00:00-05:00'::timestamptz WHERE match_number = 29;
UPDATE matches SET match_date = '2026-06-19 18:00:00-05:00'::timestamptz WHERE match_number = 30;
UPDATE matches SET match_date = '2026-06-20 00:00:00-05:00'::timestamptz WHERE match_number = 31;  -- 12:00 AM = midnight after June 19
UPDATE matches SET match_date = '2026-06-19 15:00:00-05:00'::timestamptz WHERE match_number = 32;
UPDATE matches SET match_date = '2026-06-20 16:00:00-05:00'::timestamptz WHERE match_number = 33;
UPDATE matches SET match_date = '2026-06-20 20:00:00-05:00'::timestamptz WHERE match_number = 34;
UPDATE matches SET match_date = '2026-06-20 13:00:00-05:00'::timestamptz WHERE match_number = 35;
UPDATE matches SET match_date = '2026-06-21 00:00:00-05:00'::timestamptz WHERE match_number = 36;  -- 12:00 AM = midnight after June 20
UPDATE matches SET match_date = '2026-06-21 18:00:00-05:00'::timestamptz WHERE match_number = 37;
UPDATE matches SET match_date = '2026-06-21 12:00:00-05:00'::timestamptz WHERE match_number = 38;
UPDATE matches SET match_date = '2026-06-21 15:00:00-05:00'::timestamptz WHERE match_number = 39;
UPDATE matches SET match_date = '2026-06-21 21:00:00-05:00'::timestamptz WHERE match_number = 40;
UPDATE matches SET match_date = '2026-06-22 20:00:00-05:00'::timestamptz WHERE match_number = 41;
UPDATE matches SET match_date = '2026-06-22 17:00:00-05:00'::timestamptz WHERE match_number = 42;
UPDATE matches SET match_date = '2026-06-22 13:00:00-05:00'::timestamptz WHERE match_number = 43;
UPDATE matches SET match_date = '2026-06-22 23:00:00-05:00'::timestamptz WHERE match_number = 44;
UPDATE matches SET match_date = '2026-06-23 16:00:00-05:00'::timestamptz WHERE match_number = 45;
UPDATE matches SET match_date = '2026-06-23 19:00:00-05:00'::timestamptz WHERE match_number = 46;
UPDATE matches SET match_date = '2026-06-23 13:00:00-05:00'::timestamptz WHERE match_number = 47;
UPDATE matches SET match_date = '2026-06-23 22:00:00-05:00'::timestamptz WHERE match_number = 48;
UPDATE matches SET match_date = '2026-06-24 18:00:00-05:00'::timestamptz WHERE match_number = 49;
UPDATE matches SET match_date = '2026-06-24 18:00:00-05:00'::timestamptz WHERE match_number = 50;
UPDATE matches SET match_date = '2026-06-24 15:00:00-05:00'::timestamptz WHERE match_number = 52;
UPDATE matches SET match_date = '2026-06-24 21:00:00-05:00'::timestamptz WHERE match_number = 53;
UPDATE matches SET match_date = '2026-06-24 21:00:00-05:00'::timestamptz WHERE match_number = 54;
UPDATE matches SET match_date = '2026-06-25 16:00:00-05:00'::timestamptz WHERE match_number = 55;
UPDATE matches SET match_date = '2026-06-25 16:00:00-05:00'::timestamptz WHERE match_number = 56;
UPDATE matches SET match_date = '2026-06-25 19:00:00-05:00'::timestamptz WHERE match_number = 57;
UPDATE matches SET match_date = '2026-06-25 19:00:00-05:00'::timestamptz WHERE match_number = 58;
UPDATE matches SET match_date = '2026-06-25 22:00:00-05:00'::timestamptz WHERE match_number = 59;
UPDATE matches SET match_date = '2026-06-25 22:00:00-05:00'::timestamptz WHERE match_number = 60;
UPDATE matches SET match_date = '2026-06-26 15:00:00-05:00'::timestamptz WHERE match_number = 61;
UPDATE matches SET match_date = '2026-06-26 15:00:00-05:00'::timestamptz WHERE match_number = 62;
UPDATE matches SET match_date = '2026-06-26 23:00:00-05:00'::timestamptz WHERE match_number = 63;
UPDATE matches SET match_date = '2026-06-26 23:00:00-05:00'::timestamptz WHERE match_number = 64;
UPDATE matches SET match_date = '2026-06-26 20:00:00-05:00'::timestamptz WHERE match_number = 65;
UPDATE matches SET match_date = '2026-06-26 20:00:00-05:00'::timestamptz WHERE match_number = 66;
UPDATE matches SET match_date = '2026-06-27 17:00:00-05:00'::timestamptz WHERE match_number = 67;
UPDATE matches SET match_date = '2026-06-27 17:00:00-05:00'::timestamptz WHERE match_number = 68;
UPDATE matches SET match_date = '2026-06-27 22:00:00-05:00'::timestamptz WHERE match_number = 69;
UPDATE matches SET match_date = '2026-06-27 22:00:00-05:00'::timestamptz WHERE match_number = 70;
UPDATE matches SET match_date = '2026-06-27 19:30:00-05:00'::timestamptz WHERE match_number = 71;
UPDATE matches SET match_date = '2026-06-27 19:30:00-05:00'::timestamptz WHERE match_number = 72;

-- ============================================================
-- ROUND OF 32
-- ============================================================

UPDATE matches SET match_date = '2026-06-28 15:00:00-05:00'::timestamptz WHERE match_number = 73;
UPDATE matches SET match_date = '2026-06-29 16:30:00-05:00'::timestamptz WHERE match_number = 74;
UPDATE matches SET match_date = '2026-06-29 21:00:00-05:00'::timestamptz WHERE match_number = 75;
UPDATE matches SET match_date = '2026-06-29 13:00:00-05:00'::timestamptz WHERE match_number = 76;
UPDATE matches SET match_date = '2026-06-30 17:00:00-05:00'::timestamptz WHERE match_number = 77;
UPDATE matches SET match_date = '2026-06-30 13:00:00-05:00'::timestamptz WHERE match_number = 78;
UPDATE matches SET match_date = '2026-06-30 21:00:00-05:00'::timestamptz WHERE match_number = 79;
UPDATE matches SET match_date = '2026-07-01 12:00:00-05:00'::timestamptz WHERE match_number = 80;
UPDATE matches SET match_date = '2026-07-01 20:00:00-05:00'::timestamptz WHERE match_number = 81;
UPDATE matches SET match_date = '2026-07-01 16:00:00-05:00'::timestamptz WHERE match_number = 82;
UPDATE matches SET match_date = '2026-07-02 19:00:00-05:00'::timestamptz WHERE match_number = 83;
UPDATE matches SET match_date = '2026-07-02 15:00:00-05:00'::timestamptz WHERE match_number = 84;
UPDATE matches SET match_date = '2026-07-02 23:00:00-05:00'::timestamptz WHERE match_number = 85;
UPDATE matches SET match_date = '2026-07-03 18:00:00-05:00'::timestamptz WHERE match_number = 86;
UPDATE matches SET match_date = '2026-07-03 21:30:00-05:00'::timestamptz WHERE match_number = 87;
UPDATE matches SET match_date = '2026-07-03 14:00:00-05:00'::timestamptz WHERE match_number = 88;

-- ============================================================
-- ROUND OF 16
-- ============================================================

UPDATE matches SET match_date = '2026-07-04 17:00:00-05:00'::timestamptz WHERE match_number = 89;
UPDATE matches SET match_date = '2026-07-04 13:00:00-05:00'::timestamptz WHERE match_number = 90;
UPDATE matches SET match_date = '2026-07-05 16:00:00-05:00'::timestamptz WHERE match_number = 91;
UPDATE matches SET match_date = '2026-07-05 20:00:00-05:00'::timestamptz WHERE match_number = 92;
UPDATE matches SET match_date = '2026-07-06 15:00:00-05:00'::timestamptz WHERE match_number = 93;
UPDATE matches SET match_date = '2026-07-06 20:00:00-05:00'::timestamptz WHERE match_number = 94;
UPDATE matches SET match_date = '2026-07-07 12:00:00-05:00'::timestamptz WHERE match_number = 95;
UPDATE matches SET match_date = '2026-07-07 16:00:00-05:00'::timestamptz WHERE match_number = 96;

-- ============================================================
-- QUARTERFINALS
-- ============================================================

UPDATE matches SET match_date = '2026-07-09 16:00:00-05:00'::timestamptz WHERE match_number = 97;
UPDATE matches SET match_date = '2026-07-10 15:00:00-05:00'::timestamptz WHERE match_number = 98;
UPDATE matches SET match_date = '2026-07-11 17:00:00-05:00'::timestamptz WHERE match_number = 99;
UPDATE matches SET match_date = '2026-07-11 21:00:00-05:00'::timestamptz WHERE match_number = 100;

-- ============================================================
-- SEMIFINALS
-- ============================================================

UPDATE matches SET match_date = '2026-07-14 15:00:00-05:00'::timestamptz WHERE match_number = 101;
UPDATE matches SET match_date = '2026-07-15 17:00:00-05:00'::timestamptz WHERE match_number = 102;

-- ============================================================
-- FINAL
-- ============================================================

UPDATE matches SET match_date = '2026-07-19 15:00:00-05:00'::timestamptz WHERE match_number = 104;

COMMIT;
