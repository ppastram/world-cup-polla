# Ampolla Mundialista

A full-stack prediction pool web app for the FIFA World Cup 2026. Users sign up, predict match scores, pick advancing teams through every knockout round, and forecast individual awards. A real-time leaderboard ranks everyone as actual results come in.

Built with **Next.js 14** (App Router), **Supabase** (PostgreSQL + Auth + RLS), and **Tailwind CSS**.

## Features

- **Three prediction categories** — group stage match scores (48 matches), advancing teams per knockout round (round of 32 through champion), and individual awards (Golden Ball, Boot, Glove, Best Young Player, total goals)
- **Automated scoring** — PostgreSQL functions (`score_match_predictions`, `score_advancing_predictions`, `score_award_predictions`) calculate points server-side, triggered from the admin panel
- **Leaderboard with tiebreakers** — `recalculate_leaderboard()` uses `DENSE_RANK()` with multi-column ordering: total points > champion prediction > runner-up prediction > third place prediction
- **Lone Wolf x2 bonus** — if exactly one user gets a prediction right, their points for that prediction are automatically doubled (detected per match, per advancing team, and per award)
- **Head-to-head comparison** — compare any two participants' predictions side by side (unlocked when the tournament starts)
- **Stats dashboard** — most picked champion, average total goals prediction, group favorites, consensus scores
- **Admin panel** — enter match results, set advancing teams, verify payments, manage users, configure scoring values
- **Payment flow** — receipt upload with admin verification (Nequi and Bre-B integration)
- **Email notifications** — prediction confirmation emails via Resend
- **i18n** — full Spanish/English support with client-side locale switching
- **Cron endpoint** — syncs live match data from the Football Data API
- **Auth middleware** — Supabase SSR auth with route protection and automatic redirects

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, Server Components) |
| Database | Supabase PostgreSQL with Row Level Security |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Styling | Tailwind CSS 3 with custom theme (dark UI) |
| Icons | Lucide React |
| Dates | date-fns |
| Email | Resend |
| External API | Football Data API (match sync) |
| Deployment | Vercel |

## Architecture

### Database

The schema is managed through **19 incremental SQL migrations** in `supabase/migrations/`. Key tables:

- `profiles` — user data (name, avatar, country, payment status)
- `matches` — full tournament fixture (48 group + knockout matches)
- `teams` — all 48 national teams with group assignments
- `match_predictions` / `advancing_predictions` / `award_predictions` — user predictions with `points_earned` and `is_lone_wolf` flags
- `actual_advancing` / `actual_awards` — ground truth entered by admins
- `leaderboard` — materialized rankings with point breakdowns and tiebreaker booleans
- `scoring_settings` — configurable point values per prediction type

Scoring is done entirely in SQL via `SECURITY DEFINER` functions that bypass RLS. The leaderboard is recomputed on demand (not via triggers) to keep scoring deterministic and auditable.

### Scoring Pipeline

1. Admin enters a match result or advancing team
2. Admin triggers scoring from the UI, which calls the relevant `score_*` RPC
3. Each scoring function updates `points_earned` on prediction rows and flags lone wolves
4. `recalculate_leaderboard()` aggregates all points (doubling lone wolf predictions), computes tiebreaker booleans, and assigns dense ranks

### Auth & Middleware

Supabase SSR client with cookie-based sessions. The middleware (`src/middleware.ts`) intercepts all non-static routes:
- Unauthenticated users are redirected to `/login`
- Authenticated users on auth pages are redirected to `/predicciones`
- Public routes: `/`, `/login`, `/registro`, `/callback`

### i18n

Client-side translation system in `src/i18n/` with Spanish as the source of truth (`es.ts` exports the `TranslationKey` type). English translations (`en.ts`) are typed against the same keys. Locale is persisted in `localStorage` with a toggle on the landing page.

## Project Structure

```
src/
├── app/
│   ├── page.tsx             # Landing page
│   ├── (main)/              # Authenticated user pages
│   │   ├── clasificacion/       # Leaderboard
│   │   ├── comparar/            # Head-to-head comparison
│   │   ├── estadisticas/        # Stats dashboard
│   │   ├── organizador/         # Organizer info + news
│   │   ├── pago/                # Payment receipt upload
│   │   ├── partidos/            # Match schedule & results
│   │   ├── perfil/              # User profile & settings
│   │   ├── predicciones/        # Prediction forms (stepper UI)
│   │   ├── reglas/              # Rules, scoring tables, FAQ
│   │   └── usuarios/            # Participants list & public profiles
│   ├── admin/               # Admin-only pages
│   │   ├── resultados/          # Enter match scores
│   │   ├── avances/             # Manage advancing teams & trigger scoring
│   │   ├── configuracion/       # Scoring settings
│   │   ├── pagos/               # Payment verification
│   │   └── usuarios/            # User management
│   └── api/
│       ├── cron/sync-matches/   # Football Data API sync (cron-protected)
│       └── email/send-predictions/  # Prediction confirmation emails
├── i18n/                    # Translation files (es.ts, en.ts)
├── lib/
│   ├── constants.ts             # Scoring values, deadlines, tournament config
│   ├── scoring.ts               # Client-side scoring (mirrors SQL functions)
│   ├── football-api.ts          # Football Data API client
│   ├── group-standings.ts       # Group table calculations
│   ├── types.ts                 # Shared TypeScript types
│   └── supabase/                # Supabase client (browser + server)
└── middleware.ts            # Auth route protection

supabase/
└── migrations/              # 001–019 SQL migrations
```
