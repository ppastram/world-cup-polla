'use client';

import { useEffect, useState, useRef } from 'react';
import { GitBranch, Loader2, Save, X, Pencil, Plus, Minus, Search, Check, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Team, MatchStage, AdvancingRound } from '@/lib/types';
import { ADVANCE_MAP, BRACKET_DISPLAY_ORDER } from '@/lib/constants';

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
  home_team_id: string | null;
  away_team_id: string | null;
  penaltyWinnerId: string | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const KNOCKOUT_ROUNDS: AdvancingRound[] = [
  'round_32',
  'round_16',
  'quarter',
  'semi',
  'final',
  'third_place',
  'champion',
];

const STAGE_LABELS: Record<string, string> = {
  round_32: 'Dieciseisavos',
  round_16: 'Octavos',
  quarter: 'Cuartos',
  semi: 'Semifinal',
  final: 'Final',
  third_place: '3er Puesto',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emptyMatch(stage: MatchStage, matchNumber: number): BracketMatch {
  return {
    id: '',
    homeTeam: null,
    awayTeam: null,
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stage,
    matchNumber,
    home_team_id: null,
    away_team_id: null,
    penaltyWinnerId: null,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminBracketPage() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<BracketMatch[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [editingMatch, setEditingMatch] = useState<BracketMatch | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const supabase = createClient();
    const [mRes, tRes] = await Promise.all([
      supabase
        .from('matches')
        .select(
          '*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)'
        )
        .in('stage', ['round_32', 'round_16', 'quarter', 'semi', 'final', 'third_place'])
        .order('match_number'),
      supabase.from('teams').select('*').order('name'),
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
          home_team_id: m.home_team_id as string | null,
          away_team_id: m.away_team_id as string | null,
          penaltyWinnerId: (m.penalty_winner_id as string) || null,
        }))
      );
    }
    if (tRes.data) setAllTeams(tRes.data as Team[]);
    setLoading(false);
  }

  // Build a lookup by match number for all knockout matches
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

  // Save flow --------------------------------------------------------------

  async function handleSave(updated: BracketMatch) {
    setSaving(true);
    setSaveMessage(null);
    const supabase = createClient();

    try {
      // 1. Update/insert match
      const isFinished = updated.homeScore !== null && updated.awayScore !== null;
      const isTied = isFinished && updated.homeScore === updated.awayScore;
      const updateData: Record<string, unknown> = {
        home_team_id: updated.home_team_id || null,
        away_team_id: updated.away_team_id || null,
        home_score: updated.homeScore,
        away_score: updated.awayScore,
        penalty_winner_id: isTied ? (updated.penaltyWinnerId || null) : null,
        status: isFinished ? 'finished' : 'scheduled',
        manual_override: true,
      };

      const { error: matchError } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', updated.id);

      if (matchError) throw matchError;

      // Helper to determine winner (accounts for penalties)
      const getMatchWinner = (m: { homeScore: number | null; awayScore: number | null; home_team_id: string | null; away_team_id: string | null; penaltyWinnerId: string | null }) => {
        if (m.homeScore === null || m.awayScore === null) return null;
        if (m.homeScore > m.awayScore) return m.home_team_id;
        if (m.awayScore > m.homeScore) return m.away_team_id;
        return m.penaltyWinnerId || null;
      };

      const getMatchLoser = (m: { homeScore: number | null; awayScore: number | null; home_team_id: string | null; away_team_id: string | null; penaltyWinnerId: string | null }) => {
        const w = getMatchWinner(m);
        if (!w) return null;
        return w === m.home_team_id ? m.away_team_id : m.home_team_id;
      };

      // 2. Auto-advance winner to next bracket match slot (FIFA fixture map)
      const advanceEntry = ADVANCE_MAP[updated.matchNumber];
      if (advanceEntry && isFinished) {
        const winner = getMatchWinner(updated);

        if (winner) {
          const nextMatch = matches.find((m) => m.matchNumber === advanceEntry.nextMatch);
          if (nextMatch && nextMatch.id) {
            const advanceData: Record<string, unknown> = advanceEntry.slot === 'home'
              ? { home_team_id: winner }
              : { away_team_id: winner };

            await supabase
              .from('matches')
              .update(advanceData)
              .eq('id', nextMatch.id);
          }
        }
      }

      // SF losers → third-place match
      if (updated.stage === 'semi' && isFinished) {
        const loserTeamId = getMatchLoser(updated);

        if (loserTeamId) {
          const thirdMatch = matches.find((m) => m.stage === 'third_place');
          if (thirdMatch && thirdMatch.id) {
            const tpData: Record<string, unknown> = updated.matchNumber === 101
              ? { home_team_id: loserTeamId }
              : { away_team_id: loserTeamId };

            await supabase
              .from('matches')
              .update(tpData)
              .eq('id', thirdMatch.id);
          }
        }
      }

      // 3. Rebuild actual_advancing from ALL knockout matches
      // Re-fetch all knockout matches to get current state
      const { data: allKnockout } = await supabase
        .from('matches')
        .select(
          '*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)'
        )
        .in('stage', ['round_32', 'round_16', 'quarter', 'semi', 'final', 'third_place'])
        .order('match_number');

      if (allKnockout) {
        const bracketMatches: BracketMatch[] = allKnockout.map((m: Record<string, unknown>) => ({
          id: m.id as string,
          homeTeam: (m.home_team as Team) || null,
          awayTeam: (m.away_team as Team) || null,
          homeScore: m.home_score as number | null,
          awayScore: m.away_score as number | null,
          status: m.status as string,
          stage: m.stage as MatchStage,
          matchNumber: m.match_number as number,
          home_team_id: m.home_team_id as string | null,
          away_team_id: m.away_team_id as string | null,
          penaltyWinnerId: (m.penalty_winner_id as string) || null,
        }));

        // Delete all knockout advancing entries
        for (const round of KNOCKOUT_ROUNDS) {
          await supabase.from('actual_advancing').delete().eq('round', round);
        }

        // Re-derive from match participants + winners
        const entries: { team_id: string; round: AdvancingRound }[] = [];

        for (const m of bracketMatches) {
          const stage = m.stage as string;
          const round = stage as AdvancingRound;

          // Teams participating in this stage advance TO this round
          // (e.g. teams in round_16 matches advanced to round_16)
          if (m.home_team_id) {
            entries.push({ team_id: m.home_team_id, round });
          }
          if (m.away_team_id) {
            entries.push({ team_id: m.away_team_id, round });
          }

          // Winner of final = champion
          if (m.stage === 'final' && m.status === 'finished') {
            const winnerId = getMatchWinner(m);
            if (winnerId) {
              entries.push({ team_id: winnerId, round: 'champion' });
            }
          }

          // Winner of third_place match
          if (m.stage === 'third_place' && m.status === 'finished') {
            const winnerId = getMatchWinner(m);
            if (winnerId) {
              entries.push({ team_id: winnerId, round: 'third_place' });
            }
          }
        }

        // Deduplicate
        const unique = new Map<string, { team_id: string; round: AdvancingRound }>();
        for (const e of entries) {
          unique.set(`${e.team_id}-${e.round}`, e);
        }

        const dedupedEntries = Array.from(unique.values());
        if (dedupedEntries.length > 0) {
          const { error: upsertError } = await supabase
            .from('actual_advancing')
            .upsert(dedupedEntries, { onConflict: 'team_id,round' });
          if (upsertError) throw upsertError;
        }
      }

      // 4. Run RPCs
      if (isFinished) {
        await supabase.rpc('score_advancing_predictions');
        await supabase.rpc('score_match_predictions');
        await supabase.rpc('recalculate_leaderboard');
      }

      setSaveMessage({ text: 'Partido guardado exitosamente', isError: false });
      setEditingMatch(null);
      await fetchData();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : JSON.stringify(err);
      setSaveMessage({ text: `Error: ${message}`, isError: true });
    }

    setSaving(false);
    setTimeout(() => setSaveMessage(null), 4000);
  }

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
          Llaves del Torneo
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Haz click en un partido para asignar equipos y resultados
        </p>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div
          className={`mb-4 text-center text-sm py-2 px-4 rounded-lg ${
            saveMessage.isError
              ? 'bg-red-900/30 text-red-300 border border-red-700/50'
              : 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Bracket */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1100px]">
          {/* Column headers */}
          <div className="flex items-end mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            <div className="w-[130px] shrink-0 text-center">{STAGE_LABELS.round_32}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{STAGE_LABELS.round_16}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{STAGE_LABELS.quarter}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{STAGE_LABELS.semi}</div>
            <div className="w-4 shrink-0" />
            <div className="flex-1 text-center">{STAGE_LABELS.final}</div>
            <div className="w-4 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{STAGE_LABELS.semi}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{STAGE_LABELS.quarter}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{STAGE_LABELS.round_16}</div>
            <div className="w-6 shrink-0" />
            <div className="w-[130px] shrink-0 text-center">{STAGE_LABELS.round_32}</div>
          </div>

          {/* Bracket body */}
          <div className="flex items-stretch" style={{ height: 700 }}>
            {/* ---- LEFT BRACKET ---- */}
            <AdminRoundCol matches={L.r32} side="left" onMatchClick={setEditingMatch} />
            <Connector count={4} side="left" />
            <AdminRoundCol matches={L.r16} side="left" onMatchClick={setEditingMatch} />
            <Connector count={2} side="left" />
            <AdminRoundCol matches={L.qf} side="left" onMatchClick={setEditingMatch} />
            <Connector count={1} side="left" />
            <AdminRoundCol matches={L.sf} side="left" onMatchClick={setEditingMatch} />

            {/* Horizontal line → Final */}
            <div className="w-4 shrink-0 flex items-center">
              <div className="w-full border-t-2 border-gray-700" />
            </div>

            {/* ---- CENTER (Final + 3rd) ---- */}
            <div className="flex flex-col items-center justify-center shrink-0 w-[140px] gap-3">
              {/* Final match */}
              <AdminMatchSlot match={fin[0]} onMatchClick={setEditingMatch} highlight />

              {/* Trophy */}
              <div className="text-3xl select-none">🏆</div>

              {/* Third place */}
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                {STAGE_LABELS.third_place}
              </span>
              <AdminMatchSlot match={tp[0]} onMatchClick={setEditingMatch} />
            </div>

            {/* Horizontal line ← Final */}
            <div className="w-4 shrink-0 flex items-center">
              <div className="w-full border-t-2 border-gray-700" />
            </div>

            {/* ---- RIGHT BRACKET (mirrored) ---- */}
            <AdminRoundCol matches={R.sf} side="right" onMatchClick={setEditingMatch} />
            <Connector count={1} side="right" />
            <AdminRoundCol matches={R.qf} side="right" onMatchClick={setEditingMatch} />
            <Connector count={2} side="right" />
            <AdminRoundCol matches={R.r16} side="right" onMatchClick={setEditingMatch} />
            <Connector count={4} side="right" />
            <AdminRoundCol matches={R.r32} side="right" onMatchClick={setEditingMatch} />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingMatch && (
        <MatchEditModal
          match={editingMatch}
          allTeams={allTeams}
          saving={saving}
          onSave={handleSave}
          onCancel={() => setEditingMatch(null)}
        />
      )}
    </div>
  );
}

// ===========================================================================
// Sub-components
// ===========================================================================

/** Column of admin match slots for one round */
function AdminRoundCol({
  matches,
  side,
  onMatchClick,
}: {
  matches: BracketMatch[];
  side: 'left' | 'right';
  onMatchClick: (m: BracketMatch) => void;
}) {
  return (
    <div className="flex flex-col justify-around w-[130px] shrink-0">
      {matches.map((m) => (
        <div key={m.id || m.matchNumber} className="flex items-center">
          {side === 'right' && <div className="w-3 border-t-2 border-gray-700 shrink-0" />}
          <AdminMatchSlot match={m} onMatchClick={onMatchClick} />
          {side === 'left' && <div className="w-3 border-t-2 border-gray-700 shrink-0" />}
        </div>
      ))}
    </div>
  );
}

/** A single clickable admin match slot */
function AdminMatchSlot({
  match,
  onMatchClick,
  highlight,
}: {
  match: BracketMatch;
  onMatchClick: (m: BracketMatch) => void;
  highlight?: boolean;
}) {
  const isEmpty = !match.homeTeam && !match.awayTeam;
  const finished = match.status === 'finished';
  const homeWin =
    finished && match.homeScore !== null && match.awayScore !== null &&
    (match.homeScore > match.awayScore || (match.homeScore === match.awayScore && match.penaltyWinnerId === match.home_team_id));
  const awayWin =
    finished && match.homeScore !== null && match.awayScore !== null &&
    (match.awayScore > match.homeScore || (match.homeScore === match.awayScore && match.penaltyWinnerId === match.away_team_id));

  const canClick = !!match.id;

  return (
    <div className="w-full">
      <div className="text-[9px] text-gray-500 text-center font-mono mb-0.5">
        #{match.matchNumber}
      </div>
      <button
        onClick={() => canClick && onMatchClick(match)}
        disabled={!canClick}
        className={`rounded-lg overflow-hidden border w-full text-left group transition-all ${
          !canClick
            ? 'border-dashed border-gray-700 bg-wc-darker/50 cursor-not-allowed'
            : isEmpty
            ? 'border-dashed border-gray-600 bg-wc-card hover:border-gold-500/50 cursor-pointer'
            : highlight
            ? 'border-gold-500/40 bg-wc-card hover:border-gold-500/60 cursor-pointer'
            : finished
            ? 'border-emerald-500/30 bg-wc-card hover:border-emerald-500/50 cursor-pointer'
            : 'border-wc-border bg-wc-card hover:border-gold-500/40 cursor-pointer'
        }`}
      >
        <div className="relative">
          {canClick && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Pencil className="w-3 h-3 text-gold-400" />
            </div>
          )}
          <AdminTeamRow team={match.homeTeam} score={match.homeScore} isWinner={homeWin} />
          <div className="border-t border-wc-border/50" />
          <AdminTeamRow team={match.awayTeam} score={match.awayScore} isWinner={awayWin} />
        </div>
      </button>
    </div>
  );
}

/** One team row inside an admin match slot */
function AdminTeamRow({
  team,
  score,
  isWinner,
}: {
  team: Team | null;
  score: number | null;
  isWinner: boolean;
}) {
  if (!team) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 text-gray-600">
        <div className="w-5 h-3 bg-wc-darker rounded-sm border border-wc-border shrink-0" />
        <span className="text-[11px]">TBD</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 ${isWinner ? 'bg-emerald-500/10' : ''}`}
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
    </div>
  );
}

/** Bracket connector lines */
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

// ===========================================================================
// Match Edit Modal
// ===========================================================================

function MatchEditModal({
  match,
  allTeams,
  saving,
  onSave,
  onCancel,
}: {
  match: BracketMatch;
  allTeams: Team[];
  saving: boolean;
  onSave: (m: BracketMatch) => void;
  onCancel: () => void;
}) {
  const [homeTeamId, setHomeTeamId] = useState(match.home_team_id || '');
  const [awayTeamId, setAwayTeamId] = useState(match.away_team_id || '');
  const [homeScore, setHomeScore] = useState(match.homeScore?.toString() ?? '');
  const [awayScore, setAwayScore] = useState(match.awayScore?.toString() ?? '');
  const [penaltyWinnerId, setPenaltyWinnerId] = useState(match.penaltyWinnerId || '');

  const homeNum = homeScore === '' ? 0 : parseInt(homeScore) || 0;
  const awayNum = awayScore === '' ? 0 : parseInt(awayScore) || 0;
  const hasBothScores = homeScore !== '' && awayScore !== '';
  const isTied = hasBothScores && homeNum === awayNum;
  const needsPenaltyWinner = isTied && homeTeamId && awayTeamId;
  const canSave = hasBothScores && (!isTied || penaltyWinnerId);

  function changeScore(side: 'home' | 'away', delta: number) {
    if (side === 'home') {
      const val = homeScore === '' ? 0 : parseInt(homeScore) || 0;
      setHomeScore(Math.max(0, Math.min(20, val + delta)).toString());
    } else {
      const val = awayScore === '' ? 0 : parseInt(awayScore) || 0;
      setAwayScore(Math.max(0, Math.min(20, val + delta)).toString());
    }
  }

  function handleSubmit() {
    const homeTeam = allTeams.find((t) => t.id === homeTeamId) || null;
    const awayTeam = allTeams.find((t) => t.id === awayTeamId) || null;

    onSave({
      ...match,
      homeTeam,
      awayTeam,
      home_team_id: homeTeamId || null,
      away_team_id: awayTeamId || null,
      homeScore: homeScore !== '' ? parseInt(homeScore) : null,
      awayScore: awayScore !== '' ? parseInt(awayScore) : null,
      penaltyWinnerId: isTied ? (penaltyWinnerId || null) : null,
      status: hasBothScores ? 'finished' : 'scheduled',
    });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-wc-card border border-wc-border rounded-xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-wc-border">
          <div>
            <h3 className="text-white font-bold text-sm">
              Editar Partido #{match.matchNumber}
            </h3>
            <span className="text-[11px] text-gray-500">
              {STAGE_LABELS[match.stage] || match.stage}
            </span>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Home team */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Local</label>
            <TeamSelect
              teams={allTeams}
              value={homeTeamId}
              onChange={setHomeTeamId}
              excludeId={awayTeamId}
            />
          </div>

          {/* Away team */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Visitante</label>
            <TeamSelect
              teams={allTeams}
              value={awayTeamId}
              onChange={setAwayTeamId}
              excludeId={homeTeamId}
            />
          </div>

          {/* Scores */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Resultado</label>
            <div className="flex items-center justify-center gap-2">
              {/* Home score */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => changeScore('home', -1)}
                  disabled={homeNum <= 0}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border text-gray-300 hover:bg-wc-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={homeScore}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Math.max(0, Math.min(20, parseInt(e.target.value) || 0)).toString();
                    setHomeScore(val);
                  }}
                  className={`w-12 h-10 text-center rounded-md bg-wc-darker border border-wc-border text-lg font-bold tabular-nums focus:outline-none focus:border-gold-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${homeScore !== '' ? 'text-gold-400' : 'text-gray-500'}`}
                />
                <button
                  type="button"
                  onClick={() => changeScore('home', 1)}
                  disabled={homeNum >= 20}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border text-gray-300 hover:bg-wc-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-gray-600 font-bold text-lg mx-1">-</span>

              {/* Away score */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => changeScore('away', -1)}
                  disabled={awayNum <= 0}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border text-gray-300 hover:bg-wc-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={awayScore}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Math.max(0, Math.min(20, parseInt(e.target.value) || 0)).toString();
                    setAwayScore(val);
                  }}
                  className={`w-12 h-10 text-center rounded-md bg-wc-darker border border-wc-border text-lg font-bold tabular-nums focus:outline-none focus:border-gold-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${awayScore !== '' ? 'text-gold-400' : 'text-gray-500'}`}
                />
                <button
                  type="button"
                  onClick={() => changeScore('away', 1)}
                  disabled={awayNum >= 20}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border text-gray-300 hover:bg-wc-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Penalty winner selector (when tied) */}
          {needsPenaltyWinner && (
            <div>
              <label className="text-xs text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Empate — Selecciona ganador por penales
              </label>
              <div className="flex gap-2">
                {[homeTeamId, awayTeamId].map((tid) => {
                  const team = allTeams.find((t) => t.id === tid);
                  if (!team) return null;
                  const selected = penaltyWinnerId === tid;
                  return (
                    <button
                      key={tid}
                      type="button"
                      onClick={() => setPenaltyWinnerId(tid)}
                      className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                        selected
                          ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                          : 'border-wc-border bg-wc-darker text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={team.flag_url}
                        alt={team.code}
                        className="w-5 h-3.5 object-cover rounded-sm border border-wc-border shrink-0"
                      />
                      <span className="truncate">{team.name}</span>
                      {selected && <Check className="w-3.5 h-3.5 shrink-0 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status indicator */}
          {hasBothScores && canSave && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
              <Check className="w-3.5 h-3.5" />
              Se marcará como finalizado{isTied ? ' (penales)' : ''}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-wc-border">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || (hasBothScores && !canSave)}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Team Select (searchable dropdown)
// ===========================================================================

function TeamSelect({
  teams,
  value,
  onChange,
  excludeId,
}: {
  teams: Team[];
  value: string;
  onChange: (id: string) => void;
  excludeId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = teams.find((t) => t.id === value);
  const filtered = teams
    .filter((t) => t.id !== excludeId)
    .filter(
      (t) =>
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.code.toLowerCase().includes(search.toLowerCase())
    );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setSearch('');
        }}
        className="w-full flex items-center gap-2 px-3 py-2 bg-wc-darker border border-wc-border rounded-lg text-sm hover:border-gold-500/50 transition-colors text-left"
      >
        {selected ? (
          <>
            <img
              src={selected.flag_url}
              alt={selected.code}
              className="w-6 h-4 object-cover rounded-sm border border-wc-border shrink-0"
            />
            <span className="text-gray-200 flex-1 truncate">{selected.name}</span>
          </>
        ) : (
          <span className="text-gray-500 flex-1">Seleccionar equipo...</span>
        )}
        <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-wc-darker border border-wc-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-2 border-b border-wc-border">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar equipo..."
              className="w-full bg-wc-card border border-wc-border rounded-md px-2 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {/* Clear option */}
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
                setSearch('');
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:bg-white/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Sin equipo (TBD)
            </button>
            {filtered.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onChange(t.id);
                  setOpen(false);
                  setSearch('');
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                  t.id === value
                    ? 'bg-gold-500/10 text-gold-400'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <img
                  src={t.flag_url}
                  alt={t.code}
                  className="w-5 h-3.5 object-cover rounded-sm border border-wc-border shrink-0"
                />
                <span className="truncate flex-1 text-left">
                  {t.code} - {t.name}
                </span>
                {t.id === value && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">Sin resultados</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
