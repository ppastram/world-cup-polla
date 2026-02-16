'use client';

import { useEffect, useState } from 'react';
import { GitCompare, Lock, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { TOURNAMENT_START } from '@/lib/constants';
import TeamFlag from '@/components/shared/TeamFlag';
import type { Profile, Match, Team, MatchPrediction } from '@/lib/types';

type MatchWithTeams = Match & { home_team?: Team; away_team?: Team };

export default function CompararPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [userA, setUserA] = useState<string>('');
  const [userB, setUserB] = useState<string>('');
  const [predsA, setPredsA] = useState<MatchPrediction[]>([]);
  const [predsB, setPredsB] = useState<MatchPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const isTournamentStarted = new Date() >= TOURNAMENT_START;

  useEffect(() => {
    async function fetchInitial() {
      const supabase = createClient();
      const [profilesRes, matchesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('display_name'),
        supabase
          .from('matches')
          .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
          .eq('stage', 'group')
          .order('match_date', { ascending: true }),
      ]);
      setProfiles(profilesRes.data ?? []);
      setMatches((matchesRes.data as unknown as MatchWithTeams[]) ?? []);
      setInitialLoading(false);
    }
    fetchInitial();
  }, []);

  useEffect(() => {
    if (!userA || !userB || !isTournamentStarted) return;

    async function fetchPredictions() {
      setLoading(true);
      const supabase = createClient();
      const [resA, resB] = await Promise.all([
        supabase.from('match_predictions').select('*').eq('user_id', userA),
        supabase.from('match_predictions').select('*').eq('user_id', userB),
      ]);
      setPredsA(resA.data ?? []);
      setPredsB(resB.data ?? []);
      setLoading(false);
    }
    fetchPredictions();
  }, [userA, userB, isTournamentStarted]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  const profileA = profiles.find((p) => p.id === userA);
  const profileB = profiles.find((p) => p.id === userB);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <GitCompare className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Comparar</h1>
          <p className="text-sm text-gray-500">Predicciones cara a cara</p>
        </div>
      </div>

      {!isTournamentStarted && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-12 text-center">
          <Lock className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-400 mb-2">
            Disponible cuando comience el mundial
          </p>
          <p className="text-sm text-gray-600">
            La comparacion de predicciones estara disponible a partir del 11 de junio de 2026.
          </p>
        </div>
      )}

      {isTournamentStarted && (
        <>
          {/* User Selectors */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <select
              value={userA}
              onChange={(e) => setUserA(e.target.value)}
              className="w-full sm:flex-1 bg-wc-card border border-wc-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
            >
              <option value="">Seleccionar participante</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === userB}>
                  {p.display_name}
                </option>
              ))}
            </select>

            <div className="shrink-0">
              <ArrowRight className="w-5 h-5 text-gold-400 rotate-90 sm:rotate-0" />
            </div>

            <select
              value={userB}
              onChange={(e) => setUserB(e.target.value)}
              className="w-full sm:flex-1 bg-wc-card border border-wc-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
            >
              <option value="">Seleccionar participante</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === userA}>
                  {p.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* Comparison Table */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
            </div>
          )}

          {!loading && userA && userB && (
            <div className="bg-wc-card border border-wc-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 px-4 py-3 bg-wc-darker border-b border-wc-border">
                <div className="text-sm font-semibold text-gold-400 text-center">
                  {profileA?.display_name ?? 'Usuario A'}
                </div>
                <div className="text-xs text-gray-600 flex items-center">Partido</div>
                <div className="text-sm font-semibold text-gold-400 text-center">
                  {profileB?.display_name ?? 'Usuario B'}
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-wc-border">
                {matches.map((match) => {
                  const predA = predsA.find((p) => p.match_id === match.id);
                  const predB = predsB.find((p) => p.match_id === match.id);
                  const isDifferent =
                    predA &&
                    predB &&
                    (predA.home_score !== predB.home_score ||
                      predA.away_score !== predB.away_score);

                  return (
                    <div
                      key={match.id}
                      className={`grid grid-cols-[1fr_auto_1fr] gap-2 px-4 py-3 items-center ${
                        isDifferent ? 'bg-gold-500/[0.03]' : ''
                      }`}
                    >
                      {/* User A prediction */}
                      <div className="text-center">
                        {predA ? (
                          <span className={`text-sm font-bold tabular-nums ${isDifferent ? 'text-gold-400' : 'text-gray-300'}`}>
                            {predA.home_score} - {predA.away_score}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-700">-</span>
                        )}
                      </div>

                      {/* Match */}
                      <div className="flex items-center gap-2 px-3">
                        {match.home_team && (
                          <TeamFlag team={match.home_team} size="sm" />
                        )}
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {match.home_team?.code ?? '?'} vs {match.away_team?.code ?? '?'}
                        </span>
                        {match.away_team && (
                          <TeamFlag team={match.away_team} size="sm" />
                        )}
                      </div>

                      {/* User B prediction */}
                      <div className="text-center">
                        {predB ? (
                          <span className={`text-sm font-bold tabular-nums ${isDifferent ? 'text-gold-400' : 'text-gray-300'}`}>
                            {predB.home_score} - {predB.away_score}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-700">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {matches.length === 0 && (
                <div className="p-8 text-center text-sm text-gray-500">
                  No hay partidos cargados.
                </div>
              )}
            </div>
          )}

          {!loading && (!userA || !userB) && (
            <div className="bg-wc-card border border-wc-border rounded-xl p-12 text-center">
              <GitCompare className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">Selecciona dos participantes para comparar sus predicciones.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
