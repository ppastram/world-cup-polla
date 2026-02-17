'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { PREDICTION_DEADLINE } from '@/lib/constants';
import { calculateGroupStandings } from '@/lib/group-standings';
import type { Team, Match, AwardType } from '@/lib/types';

import CountdownTimer from '@/components/shared/CountdownTimer';
import PaymentBanner from '@/components/shared/PaymentBanner';
import PredictionStepper from '@/components/predictions/PredictionStepper';
import GroupStageForm from '@/components/predictions/GroupStageForm';
import AdvancingTeamsSelector from '@/components/predictions/AdvancingTeamsSelector';
import AwardsForm from '@/components/predictions/AwardsForm';
import { Loader2, Lock, CheckCircle2 } from 'lucide-react';

const GROUP_STEPS: string[][] = [
  ['A', 'B', 'C', 'D'],
  ['E', 'F', 'G', 'H'],
  ['I', 'J', 'K', 'L'],
];


export default function PrediccionesPage() {
  const { user, profile, loading: userLoading } = useUser();
  const supabase = createClient();

  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Predictions state
  const [matchPredictions, setMatchPredictions] = useState<Record<string, { home: number; away: number; pointsEarned?: number | null }>>({});
  const [advancingPredictions, setAdvancingPredictions] = useState<Record<string, string[]>>({});
  const [awardPredictions, setAwardPredictions] = useState<Record<string, { player_name?: string; total_goals_guess?: number; points_earned?: number | null }>>({});

  const isPastDeadline = new Date() > PREDICTION_DEADLINE;
  const totalSteps = 5;

  // Fetch initial data
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);

      // Fetch teams
      const { data: teamsData } = await supabase
        .from('teams')
        .select('*')
        .order('group_letter', { ascending: true })
        .order('name', { ascending: true });

      // Fetch group stage matches with joined teams
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
        .eq('stage', 'group')
        .order('match_date', { ascending: true });

      // Fetch user's match predictions
      const { data: matchPreds } = await supabase
        .from('match_predictions')
        .select('*')
        .eq('user_id', user!.id);

      // Fetch user's advancing predictions
      const { data: advancingPreds } = await supabase
        .from('advancing_predictions')
        .select('*')
        .eq('user_id', user!.id);

      // Fetch user's award predictions
      const { data: awardPreds } = await supabase
        .from('award_predictions')
        .select('*')
        .eq('user_id', user!.id);

      if (teamsData) setTeams(teamsData);
      if (matchesData) setMatches(matchesData);

      // Build match predictions map
      if (matchPreds) {
        const map: Record<string, { home: number; away: number; pointsEarned?: number | null }> = {};
        for (const p of matchPreds) {
          map[p.match_id] = { home: p.home_score, away: p.away_score, pointsEarned: p.points_earned };
        }
        setMatchPredictions(map);
      }

      // Build advancing predictions map
      if (advancingPreds) {
        const map: Record<string, string[]> = {};
        for (const p of advancingPreds) {
          if (!map[p.round]) map[p.round] = [];
          map[p.round].push(p.team_id);
        }
        setAdvancingPredictions(map);
      }

      // Build award predictions map
      if (awardPreds) {
        const map: Record<string, { player_name?: string; total_goals_guess?: number; points_earned?: number | null }> = {};
        for (const p of awardPreds) {
          map[p.award_type] = {
            player_name: p.player_name || undefined,
            total_goals_guess: p.total_goals_guess ?? undefined,
            points_earned: p.points_earned,
          };
        }
        setAwardPredictions(map);
      }

      setLoading(false);
    }

    fetchData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers
  const handleMatchPredictionChange = useCallback((matchId: string, home: number, away: number) => {
    setMatchPredictions((prev) => ({ ...prev, [matchId]: { home, away } }));
  }, []);

  const handleAdvancingChange = useCallback((round: string, teamIds: string[]) => {
    setAdvancingPredictions((prev) => ({ ...prev, [round]: teamIds }));
  }, []);

  const handleAwardChange = useCallback(
    (awardType: string, value: { player_name?: string; total_goals_guess?: number }) => {
      setAwardPredictions((prev) => ({ ...prev, [awardType]: value }));
    },
    []
  );

  // Auto-compute round_32 from group predictions
  const autoRound32 = useMemo(() => {
    if (teams.length === 0 || matches.length === 0) return [];
    const result = calculateGroupStandings(teams, matches, matchPredictions);
    return result.allQualified;
  }, [teams, matches, matchPredictions]);

  // Cascade-invalidate: remove teams from manual rounds if no longer in autoRound32
  const prevAutoRound32Ref = useRef<string[]>([]);
  useEffect(() => {
    const prev = prevAutoRound32Ref.current;
    if (prev.length === 0 && autoRound32.length > 0) {
      prevAutoRound32Ref.current = autoRound32;
      return;
    }
    if (prev.length === 0) return;

    const removedTeams = prev.filter((id) => !autoRound32.includes(id));
    if (removedTeams.length === 0) {
      prevAutoRound32Ref.current = autoRound32;
      return;
    }

    // Remove teams that are no longer qualified from all manual rounds
    const manualRounds = ['round_16', 'quarter', 'semi', 'final', 'third_place', 'champion'] as const;
    setAdvancingPredictions((current) => {
      const updated = { ...current };
      let changed = false;
      for (const round of manualRounds) {
        const roundTeams = updated[round] || [];
        const filtered = roundTeams.filter((id) => !removedTeams.includes(id));
        if (filtered.length !== roundTeams.length) {
          updated[round] = filtered;
          changed = true;
        }
      }
      return changed ? updated : current;
    });
    prevAutoRound32Ref.current = autoRound32;
  }, [autoRound32]);

  // Save current step
  const handleSave = useCallback(async () => {
    if (!user || isPastDeadline) return;

    setSaving(true);
    setSaveMessage(null);

    try {
      if (currentStep <= 2) {
        // Save match predictions for current group step
        const stepGroups = GROUP_STEPS[currentStep];
        const stepMatches = matches.filter((m) => stepGroups.includes(m.group_letter || ''));
        const upserts = stepMatches
          .filter((m) => matchPredictions[m.id])
          .map((m) => ({
            user_id: user.id,
            match_id: m.id,
            home_score: matchPredictions[m.id].home,
            away_score: matchPredictions[m.id].away,
          }));

        if (upserts.length > 0) {
          const { error } = await supabase
            .from('match_predictions')
            .upsert(upserts, { onConflict: 'user_id,match_id' });
          if (error) throw error;
        }
      } else if (currentStep === 3) {
        // Save advancing predictions using UPSERT + selective cleanup
        // Build full set of (user_id, team_id, round) tuples to keep
        const upserts: { user_id: string; team_id: string; round: string }[] = [];
        // Auto-insert round_32 from computation
        for (const teamId of autoRound32) {
          upserts.push({ user_id: user.id, team_id: teamId, round: 'round_32' });
        }
        // Manual rounds
        const manualRounds = ['round_16', 'quarter', 'semi', 'final', 'third_place', 'champion'] as const;
        for (const round of manualRounds) {
          const teamIds = advancingPredictions[round] || [];
          for (const teamId of teamIds) {
            upserts.push({ user_id: user.id, team_id: teamId, round });
          }
        }

        // Upsert all current predictions
        if (upserts.length > 0) {
          const { error } = await supabase
            .from('advancing_predictions')
            .upsert(upserts, { onConflict: 'user_id,team_id,round' });
          if (error) throw error;
        }

        // Build set of team_id+round keys to keep
        const keepKeys = new Set(upserts.map((u) => `${u.team_id}|${u.round}`));

        // Fetch existing rows and delete only stale ones
        const { data: existing } = await supabase
          .from('advancing_predictions')
          .select('id, team_id, round')
          .eq('user_id', user.id);

        if (existing) {
          const staleIds = existing
            .filter((row) => !keepKeys.has(`${row.team_id}|${row.round}`))
            .map((row) => row.id);

          if (staleIds.length > 0) {
            const { error: delError } = await supabase
              .from('advancing_predictions')
              .delete()
              .in('id', staleIds);
            if (delError) throw delError;
          }
        }
      } else if (currentStep === 4) {
        // Save award predictions
        const upserts: {
          user_id: string;
          award_type: AwardType;
          player_name: string | null;
          total_goals_guess: number | null;
        }[] = [];

        for (const [awardType, value] of Object.entries(awardPredictions)) {
          upserts.push({
            user_id: user.id,
            award_type: awardType as AwardType,
            player_name: value.player_name || null,
            total_goals_guess: value.total_goals_guess ?? null,
          });
        }

        if (upserts.length > 0) {
          const { error } = await supabase
            .from('award_predictions')
            .upsert(upserts, { onConflict: 'user_id,award_type' });
          if (error) throw error;
        }
      }

      setSaveMessage('Guardado exitosamente');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      console.error('Error saving predictions:', err);
      setSaveMessage('Error al guardar. Intenta de nuevo.');
      setTimeout(() => setSaveMessage(null), 4000);
    } finally {
      setSaving(false);
    }
  }, [user, currentStep, matches, matchPredictions, advancingPredictions, awardPredictions, isPastDeadline, supabase, autoRound32]);

  // Completion stats
  const groupMatchCount = matches.filter(
    (m) => m.stage === 'group' && m.home_team && m.away_team
  ).length;
  const predictedMatchCount = Object.keys(matchPredictions).length;
  const manualAdvancingCount = ['round_16', 'quarter', 'semi', 'final', 'third_place', 'champion'].reduce(
    (sum, round) => sum + (advancingPredictions[round]?.length || 0),
    0
  );
  const advancingCount = autoRound32.length + manualAdvancingCount;
  const totalAdvancingExpected = 32 + 16 + 8 + 4 + 2 + 1 + 1; // 64
  const filledAwards = Object.values(awardPredictions).filter(
    (v) => v.player_name?.trim() || v.total_goals_guess != null
  ).length;

  // Progress percentage
  const totalItems = groupMatchCount + totalAdvancingExpected + 5;
  const completedItems = predictedMatchCount + advancingCount + filledAwards;
  const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Loading state
  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400 mx-auto" />
          <p className="text-gray-400 text-sm">Cargando predicciones...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <Lock className="w-10 h-10 text-gray-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Inicia sesion</h2>
          <p className="text-gray-400 text-sm">
            Debes iniciar sesion para hacer tus predicciones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Mis Predicciones</h1>
        <p className="text-gray-400 text-sm">Mundial FIFA 2026</p>
      </div>

      {/* Payment Banner */}
      {profile && <PaymentBanner paymentStatus={profile.payment_status} />}

      {/* Countdown */}
      {!isPastDeadline && (
        <CountdownTimer targetDate={PREDICTION_DEADLINE} label="Tiempo restante para enviar predicciones" />
      )}

      {/* Deadline passed warning */}
      {isPastDeadline && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 flex items-center gap-3">
          <Lock className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm text-red-300">
            El plazo para enviar predicciones ha finalizado. Ya no puedes editar.
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-wc-card border border-wc-border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Progreso general</span>
          <span className="text-sm font-bold text-gold-400">{progressPct}%</span>
        </div>
        <div className="w-full bg-wc-darker rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-gold-500 to-gold-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>
            <span className={predictedMatchCount === groupMatchCount ? 'text-gold-400' : 'text-gray-400'}>
              {predictedMatchCount}/{groupMatchCount}
            </span>{' '}
            partidos
          </span>
          <span>
            <span className={advancingCount === totalAdvancingExpected ? 'text-gold-400' : 'text-gray-400'}>
              {advancingCount}/{totalAdvancingExpected}
            </span>{' '}
            clasificados
          </span>
          <span>
            <span className={filledAwards === 5 ? 'text-gold-400' : 'text-gray-400'}>
              {filledAwards}/5
            </span>{' '}
            premios
          </span>
        </div>
      </div>

      {/* Stepper */}
      <PredictionStepper
        currentStep={currentStep}
        totalSteps={totalSteps}
        onStepChange={setCurrentStep}
        onSave={handleSave}
        saving={saving}
      />

      {/* Save message */}
      {saveMessage && (
        <div
          className={`text-center text-sm py-2 px-4 rounded-lg ${
            saveMessage.includes('Error')
              ? 'bg-red-900/30 text-red-300 border border-red-700/50'
              : 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {!saveMessage.includes('Error') && <CheckCircle2 className="w-4 h-4" />}
            {saveMessage}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep <= 2 && (
          <GroupStageForm
            groups={GROUP_STEPS[currentStep]}
            matches={matches}
            teams={teams}
            predictions={matchPredictions}
            onPredictionChange={handleMatchPredictionChange}
            disabled={isPastDeadline}
          />
        )}

        {currentStep === 3 && (
          <AdvancingTeamsSelector
            teams={teams}
            predictions={advancingPredictions}
            onChange={handleAdvancingChange}
            disabled={isPastDeadline}
            autoRound32={autoRound32}
          />
        )}

        {currentStep === 4 && (
          <AwardsForm
            predictions={awardPredictions}
            onChange={handleAwardChange}
            disabled={isPastDeadline}
          />
        )}
      </div>
    </div>
  );
}
