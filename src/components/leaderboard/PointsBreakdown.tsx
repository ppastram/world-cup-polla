'use client';

import { useEffect, useState } from 'react';
import { X, Trophy, Target, Award, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { STAGES_LABELS } from '@/lib/constants';
import type { Match, MatchPrediction, AdvancingPrediction, AwardPrediction, Team, Profile } from '@/lib/types';

interface PointsBreakdownProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface MatchWithTeams extends Match {
  home_team: Team;
  away_team: Team;
}

interface MatchPredictionWithMatch extends MatchPrediction {
  match: MatchWithTeams;
}

export default function PointsBreakdown({ userId, isOpen, onClose }: PointsBreakdownProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matchPredictions, setMatchPredictions] = useState<MatchPredictionWithMatch[]>([]);
  const [advancingPredictions, setAdvancingPredictions] = useState<(AdvancingPrediction & { team: Team })[]>([]);
  const [awardPredictions, setAwardPredictions] = useState<AwardPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchData() {
      setLoading(true);
      const supabase = createClient();

      const [profileRes, matchRes, advRes, awardRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase
          .from('match_predictions')
          .select('*, match:matches(*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*))')
          .eq('user_id', userId)
          .not('points_earned', 'is', null)
          .order('created_at', { ascending: true }),
        supabase
          .from('advancing_predictions')
          .select('*, team:teams(*)')
          .eq('user_id', userId)
          .not('points_earned', 'is', null),
        supabase
          .from('award_predictions')
          .select('*')
          .eq('user_id', userId)
          .not('points_earned', 'is', null),
      ]);

      setProfile(profileRes.data);
      setMatchPredictions((matchRes.data as unknown as MatchPredictionWithMatch[]) ?? []);
      setAdvancingPredictions((advRes.data as unknown as (AdvancingPrediction & { team: Team })[]) ?? []);
      setAwardPredictions(awardRes.data ?? []);
      setLoading(false);
    }

    fetchData();
  }, [userId, isOpen]);

  if (!isOpen) return null;

  const totalMatchPoints = matchPredictions.reduce((sum, p) => sum + (p.points_earned ?? 0), 0);
  const totalAdvancingPoints = advancingPredictions.reduce((sum, p) => sum + (p.points_earned ?? 0), 0);
  const totalAwardPoints = awardPredictions.reduce((sum, p) => sum + (p.points_earned ?? 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-wc-card border border-wc-border rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-wc-border shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">
              {profile?.display_name ?? 'Participante'}
            </h2>
            <p className="text-sm text-gray-500">Desglose de puntos</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-wc-darker rounded-lg p-3 text-center">
                  <Target className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{totalMatchPoints}</p>
                  <p className="text-xs text-gray-500">Partidos</p>
                </div>
                <div className="bg-wc-darker rounded-lg p-3 text-center">
                  <Trophy className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{totalAdvancingPoints}</p>
                  <p className="text-xs text-gray-500">Clasificados</p>
                </div>
                <div className="bg-wc-darker rounded-lg p-3 text-center">
                  <Star className="w-4 h-4 text-gold-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{totalAwardPoints}</p>
                  <p className="text-xs text-gray-500">Premios</p>
                </div>
              </div>

              {/* Match predictions */}
              {matchPredictions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Predicciones de partidos
                  </h3>
                  <div className="space-y-2">
                    {matchPredictions.map((pred) => (
                      <div
                        key={pred.id}
                        className="flex items-center justify-between bg-wc-darker rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2 text-xs text-gray-400 min-w-0">
                          <span className="truncate">
                            {pred.match?.home_team?.name ?? '?'} vs {pred.match?.away_team?.name ?? '?'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-gray-500">
                            {pred.home_score}-{pred.away_score}
                          </span>
                          <span className={`text-sm font-bold ${
                            (pred.points_earned ?? 0) > 0 ? 'text-gold-400' : 'text-gray-600'
                          }`}>
                            +{pred.points_earned ?? 0}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advancing predictions */}
              {advancingPredictions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Equipos clasificados
                  </h3>
                  <div className="space-y-2">
                    {advancingPredictions.map((pred) => (
                      <div
                        key={pred.id}
                        className="flex items-center justify-between bg-wc-darker rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          {pred.team && (
                            <img
                              src={pred.team.flag_url}
                              alt={pred.team.name}
                              className="w-5 h-3.5 object-cover rounded-sm border border-wc-border"
                            />
                          )}
                          <span>{pred.team?.name ?? '?'}</span>
                          <span className="text-gray-600">-</span>
                          <span className="text-gray-600">
                            {STAGES_LABELS[pred.round] ?? pred.round}
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${
                          (pred.points_earned ?? 0) > 0 ? 'text-gold-400' : 'text-gray-600'
                        }`}>
                          +{pred.points_earned ?? 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Award predictions */}
              {awardPredictions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Premios individuales
                  </h3>
                  <div className="space-y-2">
                    {awardPredictions.map((pred) => {
                      const labels: Record<string, string> = {
                        golden_ball: 'Balon de Oro',
                        golden_boot: 'Bota de Oro',
                        golden_glove: 'Guante de Oro',
                        best_young: 'Mejor Joven',
                        total_goals: 'Total de Goles',
                      };
                      return (
                        <div
                          key={pred.id}
                          className="flex items-center justify-between bg-wc-darker rounded-lg px-3 py-2"
                        >
                          <div className="text-xs text-gray-400">
                            <span>{labels[pred.award_type] ?? pred.award_type}</span>
                            <span className="text-gray-600 ml-2">
                              {pred.player_name ?? (pred.total_goals_guess !== null ? `${pred.total_goals_guess} goles` : '')}
                            </span>
                          </div>
                          <span className={`text-sm font-bold ${
                            (pred.points_earned ?? 0) > 0 ? 'text-gold-400' : 'text-gray-600'
                          }`}>
                            +{pred.points_earned ?? 0}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {matchPredictions.length === 0 &&
                advancingPredictions.length === 0 &&
                awardPredictions.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Aun no hay puntos registrados.
                  </p>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
