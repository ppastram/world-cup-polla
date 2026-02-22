'use client';

import { useEffect, useState } from 'react';
import { GitBranch, Loader2, Trophy } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/i18n';
import type { Team, AdvancingRound, MatchStage } from '@/lib/types';
import { BRACKET_DISPLAY_ORDER } from '@/lib/constants';
import TeamPredictorsPopup from '@/components/bracket/TeamPredictorsPopup';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BracketMatch {
  id: string;
  homeTeam: Team | null;
  awayTeam: Team | null;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  stage: MatchStage;
  matchNumber: number;
}

const STAGE_TO_ROUND: Record<string, AdvancingRound> = {
  round_32: 'round_32',
  round_16: 'round_16',
  quarter: 'quarter',
  semi: 'semi',
  final: 'final',
  third_place: 'third_place',
};

function emptyMatch(stage: MatchStage, idx: number): BracketMatch {
  return {
    id: `empty-${stage}-${idx}`,
    homeTeam: null,
    awayTeam: null,
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stage,
    matchNumber: 9000 + idx,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BracketPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<BracketMatch[]>([]);
  const [champion, setChampion] = useState<Team | null>(null);

  // popup
  const [popup, setPopup] = useState<{
    teamId: string;
    teamName: string;
    teamFlagUrl: string;
    round: AdvancingRound;
    roundLabel: string;
  } | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [mRes, cRes] = await Promise.all([
        supabase
          .from('matches')
          .select(
            '*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)'
          )
          .in('stage', ['round_32', 'round_16', 'quarter', 'semi', 'final', 'third_place'])
          .order('match_number'),
        supabase
          .from('actual_advancing')
          .select('team_id, teams:team_id(*)')
          .eq('round', 'champion')
          .maybeSingle(),
      ]);

      if (mRes.data) {
        setMatches(
          mRes.data.map((m: Record<string, unknown>) => ({
            id: m.id as string,
            homeTeam: (m.home_team as Team) || null,
            awayTeam: (m.away_team as Team) || null,
            homeScore: m.home_score as number | null,
            awayScore: m.away_score as number | null,
            status: m.status as string,
            stage: m.stage as MatchStage,
            matchNumber: m.match_number as number,
          }))
        );
      }

      if (cRes.data?.teams) {
        setChampion(cRes.data.teams as unknown as Team);
      }

      setLoading(false);
    }
    load();
  }, []);

  function roundLabel(stage: MatchStage) {
    const map: Record<string, string> = {
      round_32: t('bracket.round32'),
      round_16: t('bracket.round16'),
      quarter: t('bracket.quarter'),
      semi: t('bracket.semi'),
      final: t('bracket.final'),
      third_place: t('bracket.thirdPlace'),
    };
    return map[stage] || stage;
  }

  function onTeamClick(team: Team, stage: MatchStage) {
    const round = STAGE_TO_ROUND[stage];
    if (!round) return;
    setPopup({
      teamId: team.id,
      teamName: team.name,
      teamFlagUrl: team.flag_url,
      round,
      roundLabel: roundLabel(stage),
    });
  }

  // Build a lookup by match number and order by FIFA fixture map
  const allByNumber = new Map<number, BracketMatch>();
  for (const m of matches) allByNumber.set(m.matchNumber, m);

  function orderedMatches(matchNumbers: number[], stage: MatchStage): BracketMatch[] {
    return matchNumbers.map(
      (n) => allByNumber.get(n) || emptyMatch(stage, n)
    );
  }

  const fin = orderedMatches([104], 'final');
  const tp = orderedMatches([103], 'third_place');

  const L = {
    r32: orderedMatches(BRACKET_DISPLAY_ORDER.left.r32, 'round_32'),
    r16: orderedMatches(BRACKET_DISPLAY_ORDER.left.r16, 'round_16'),
    qf: orderedMatches(BRACKET_DISPLAY_ORDER.left.qf, 'quarter'),
    sf: orderedMatches(BRACKET_DISPLAY_ORDER.left.sf, 'semi'),
  };
  const R = {
    r32: orderedMatches(BRACKET_DISPLAY_ORDER.right.r32, 'round_32'),
    r16: orderedMatches(BRACKET_DISPLAY_ORDER.right.r16, 'round_16'),
    qf: orderedMatches(BRACKET_DISPLAY_ORDER.right.qf, 'quarter'),
    sf: orderedMatches(BRACKET_DISPLAY_ORDER.right.sf, 'semi'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <GitBranch className="w-7 h-7 text-gold-400" />
          {t('bracket.title')}
        </h1>
        <p className="text-gray-400 text-sm mt-1">{t('bracket.subtitle')}</p>
      </div>

      {/* Round labels */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1100px]">
          {/* Column headers */}
          <div className="flex items-end mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            <div className="w-[130px] shrink-0 text-center">{t('bracket.round32')}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{t('bracket.round16')}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{t('bracket.quarter')}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{t('bracket.semi')}</div>
            <div className="w-4 shrink-0" />
            <div className="flex-1 text-center">{t('bracket.final')}</div>
            <div className="w-4 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{t('bracket.semi')}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{t('bracket.quarter')}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{t('bracket.round16')}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{t('bracket.round32')}</div>
          </div>

          {/* Bracket body */}
          <div className="flex items-stretch" style={{ height: 700 }}>
            {/* ---- LEFT BRACKET ---- */}
            <RoundCol matches={L.r32} side="left" onTeamClick={onTeamClick} />
            <Connector count={4} side="left" />
            <RoundCol matches={L.r16} side="left" onTeamClick={onTeamClick} />
            <Connector count={2} side="left" />
            <RoundCol matches={L.qf} side="left" onTeamClick={onTeamClick} />
            <Connector count={1} side="left" />
            <RoundCol matches={L.sf} side="left" onTeamClick={onTeamClick} />

            {/* Horizontal line → Final */}
            <div className="w-4 shrink-0 flex items-center">
              <div className="w-full border-t-2 border-gray-700" />
            </div>

            {/* ---- CENTER (Final + Champion + 3rd) ---- */}
            <div className="flex flex-col items-center justify-center shrink-0 w-[140px] gap-3">
              {/* Champion */}
              {champion ? (
                <button
                  onClick={() => onTeamClick(champion, 'final')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gold-500/20 border border-gold-500/50 rounded-lg hover:bg-gold-500/30 transition-all"
                >
                  <Trophy className="w-4 h-4 text-gold-400" />
                  <img
                    src={champion.flag_url}
                    alt={champion.code}
                    className="w-5 h-3.5 object-cover rounded-sm border border-wc-border"
                  />
                  <span className="text-xs font-bold text-gold-400">{champion.name}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-wc-darker border border-wc-border rounded-lg text-gray-600 text-xs">
                  <Trophy className="w-4 h-4" />
                  {t('bracket.champion')}
                </div>
              )}

              {/* Final match */}
              <MatchSlot match={fin[0]} onTeamClick={onTeamClick} highlight />

              {/* Trophy */}
              <div className="text-3xl select-none">🏆</div>

              {/* Third place */}
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                {t('bracket.thirdPlace')}
              </span>
              <MatchSlot match={tp[0]} onTeamClick={onTeamClick} />
            </div>

            {/* Horizontal line ← Final */}
            <div className="w-4 shrink-0 flex items-center">
              <div className="w-full border-t-2 border-gray-700" />
            </div>

            {/* ---- RIGHT BRACKET (mirrored) ---- */}
            <RoundCol matches={R.sf} side="right" onTeamClick={onTeamClick} />
            <Connector count={1} side="right" />
            <RoundCol matches={R.qf} side="right" onTeamClick={onTeamClick} />
            <Connector count={2} side="right" />
            <RoundCol matches={R.r16} side="right" onTeamClick={onTeamClick} />
            <Connector count={4} side="right" />
            <RoundCol matches={R.r32} side="right" onTeamClick={onTeamClick} />
          </div>
        </div>
      </div>

      {/* Popup */}
      {popup && (
        <TeamPredictorsPopup
          teamId={popup.teamId}
          teamName={popup.teamName}
          teamFlagUrl={popup.teamFlagUrl}
          round={popup.round}
          roundLabel={popup.roundLabel}
          isOpen
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

// ===========================================================================
// Sub-components
// ===========================================================================

/** Column of match slots for one round */
function RoundCol({
  matches,
  side,
  onTeamClick,
}: {
  matches: BracketMatch[];
  side: 'left' | 'right';
  onTeamClick: (team: Team, stage: MatchStage) => void;
}) {
  return (
    <div className="flex flex-col justify-around w-[130px] shrink-0">
      {matches.map((m) => (
        <div key={m.id} className="flex items-center">
          {side === 'right' && <div className="w-3 border-t-2 border-gray-700 shrink-0" />}
          <MatchSlot match={m} onTeamClick={onTeamClick} />
          {side === 'left' && <div className="w-3 border-t-2 border-gray-700 shrink-0" />}
        </div>
      ))}
    </div>
  );
}

/** A single match (two team rows) */
function MatchSlot({
  match,
  onTeamClick,
  highlight,
}: {
  match: BracketMatch;
  onTeamClick: (team: Team, stage: MatchStage) => void;
  highlight?: boolean;
}) {
  const finished = match.status === 'finished';
  const homeWin =
    finished &&
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.homeScore > match.awayScore;
  const awayWin =
    finished &&
    match.homeScore !== null &&
    match.awayScore !== null &&
    match.awayScore > match.homeScore;

  return (
    <div
      className={`rounded-lg overflow-hidden border w-full ${
        highlight ? 'border-gold-500/40 bg-wc-card' : 'border-wc-border bg-wc-card'
      }`}
    >
      <TeamRow
        team={match.homeTeam}
        score={match.homeScore}
        stage={match.stage}
        isWinner={homeWin}
        onTeamClick={onTeamClick}
      />
      <div className="border-t border-wc-border/50" />
      <TeamRow
        team={match.awayTeam}
        score={match.awayScore}
        stage={match.stage}
        isWinner={awayWin}
        onTeamClick={onTeamClick}
      />
    </div>
  );
}

/** One team inside a match slot */
function TeamRow({
  team,
  score,
  stage,
  isWinner,
  onTeamClick,
}: {
  team: Team | null;
  score: number | null;
  stage: MatchStage;
  isWinner: boolean;
  onTeamClick: (team: Team, stage: MatchStage) => void;
}) {
  const { t } = useTranslation();

  if (!team) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 text-gray-600">
        <div className="w-5 h-3 bg-wc-darker rounded-sm border border-wc-border shrink-0" />
        <span className="text-[11px]">{t('bracket.tbd')}</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => onTeamClick(team, stage)}
      className={`w-full flex items-center gap-1.5 px-2 py-1 hover:bg-white/5 transition-colors text-left ${
        isWinner ? 'bg-emerald-500/10' : ''
      }`}
    >
      <img
        src={team.flag_url}
        alt={team.code}
        className="w-5 h-3 object-cover rounded-sm border border-wc-border shrink-0"
      />
      <span
        className={`text-[11px] font-medium truncate flex-1 ${
          isWinner ? 'text-white' : 'text-gray-300'
        }`}
      >
        {team.name}
      </span>
      {score !== null && (
        <span className={`text-[11px] font-bold ${isWinner ? 'text-emerald-400' : 'text-gray-500'}`}>
          {score}
        </span>
      )}
    </button>
  );
}

/** Bracket connector lines between two rounds */
function Connector({ count, side }: { count: number; side: 'left' | 'right' }) {
  const border = side === 'left' ? 'border-r-2' : 'border-l-2';

  return (
    <div className="flex flex-col w-6 shrink-0">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-1 flex flex-col">
          <div className={`flex-1 ${border} border-b-2 border-gray-700`} />
          <div className={`flex-1 ${border} border-t-2 border-gray-700`} />
        </div>
      ))}
    </div>
  );
}
