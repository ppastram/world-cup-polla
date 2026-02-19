'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Trophy, Target, TrendingUp, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import TeamFlag from '@/components/shared/TeamFlag';
import { useTranslation } from '@/i18n';
import type { Team } from '@/lib/types';

interface ChampionPick {
  team: Team;
  count: number;
  percentage: number;
}

interface GroupWinnerPick {
  group_letter: string;
  team: Team;
  count: number;
}

interface ConsensusScore {
  match_id: string;
  home_team: Team;
  away_team: Team;
  avg_home: number;
  avg_away: number;
  total_predictions: number;
}

export default function EstadisticasPage() {
  const { t } = useTranslation();
  const [championPicks, setChampionPicks] = useState<ChampionPick[]>([]);
  const [groupWinners, setGroupWinners] = useState<Record<string, GroupWinnerPick[]>>({});
  const [avgTotalGoals, setAvgTotalGoals] = useState<number | null>(null);
  const [actualTotalGoals, setActualTotalGoals] = useState<{ goals: number; matches: number } | null>(null);
  const [consensusScores, setConsensusScores] = useState<ConsensusScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const { data: champData } = await supabase.rpc('get_champion_picks');

      if (champData && champData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalPicks = champData.reduce((sum: number, r: Record<string, any>) => sum + Number(r.pick_count), 0);
        setChampionPicks(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          champData.map((r: Record<string, any>) => ({
            team: { id: r.team_id, name: r.team_name, code: r.team_code, flag_url: r.flag_url } as Team,
            count: Number(r.pick_count),
            percentage: Math.round((Number(r.pick_count) / totalPicks) * 100),
          }))
        );
      }

      const { data: advData } = await supabase.rpc('get_round32_picks');

      if (advData && advData.length > 0) {
        const result: Record<string, GroupWinnerPick[]> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const r of advData as Record<string, any>[]) {
          const letter = r.group_letter;
          if (!result[letter]) result[letter] = [];
          result[letter].push({
            group_letter: letter,
            team: { id: r.team_id, name: r.team_name, code: r.team_code, flag_url: r.flag_url } as Team,
            count: Number(r.pick_count),
          });
        }
        for (const letter of Object.keys(result)) {
          result[letter] = result[letter].slice(0, 4);
        }
        setGroupWinners(result);
      }

      const { data: goalsData } = await supabase.rpc('get_avg_total_goals');

      if (goalsData && goalsData.length > 0 && goalsData[0].avg_goals !== null) {
        setAvgTotalGoals(Number(goalsData[0].avg_goals));
      }

      const { data: finishedMatches } = await supabase
        .from('matches')
        .select('home_score, away_score')
        .eq('status', 'finished');

      if (finishedMatches && finishedMatches.length > 0) {
        const totalGoals = finishedMatches.reduce(
          (acc, m) => acc + (m.home_score ?? 0) + (m.away_score ?? 0),
          0
        );
        setActualTotalGoals({ goals: totalGoals, matches: finishedMatches.length });
      }

      const { data: upcomingMatches } = await supabase
        .from('matches')
        .select('id, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
        .eq('status', 'scheduled')
        .order('match_date', { ascending: true })
        .limit(10);

      if (upcomingMatches && upcomingMatches.length > 0) {
        const matchIds = upcomingMatches.map((m) => m.id);
        const { data: predData } = await supabase.rpc('get_consensus_scores', { match_ids: matchIds });

        if (predData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const predMap: Record<string, Record<string, any>> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const p of predData as Record<string, any>[]) {
            predMap[p.match_id] = p;
          }

          const consensus: ConsensusScore[] = [];
          for (const match of upcomingMatches as unknown as { id: string; home_team: Team; away_team: Team }[]) {
            const agg = predMap[match.id];
            if (!agg) continue;
            consensus.push({
              match_id: match.id,
              home_team: match.home_team,
              away_team: match.away_team,
              avg_home: Number(agg.avg_home),
              avg_away: Number(agg.avg_away),
              total_predictions: Number(agg.total_predictions),
            });
          }
          setConsensusScores(consensus);
        }
      }

      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  const sortedGroups = Object.keys(groupWinners).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-7 h-7 text-gold-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">{t('stats.title')}</h1>
          <p className="text-sm text-gray-500">{t('stats.subtitle')}</p>
        </div>
      </div>

      <div className="bg-wc-card border border-wc-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-gold-400" />
          {t('stats.mostPickedChampion')}
        </h2>
        {championPicks.length === 0 ? (
          <p className="text-sm text-gray-500">{t('stats.noChampionPicks')}</p>
        ) : (
          <div className="space-y-2">
            {championPicks.slice(0, 10).map((pick, i) => (
              <div key={pick.team.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-5 text-right font-mono">
                  {i + 1}.
                </span>
                <TeamFlag team={pick.team} size="sm" />
                <span className="text-sm text-gray-200 w-28 truncate">{pick.team.name}</span>
                <div className="flex-1">
                  <div className="h-6 bg-wc-darker rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gold-500/30 rounded-full transition-all duration-700"
                      style={{ width: `${pick.percentage}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-semibold text-gold-400">
                      {pick.count} ({pick.percentage}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {avgTotalGoals !== null && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-gold-400" />
            {t('stats.avgTotalGoals')}
          </h2>
          <p className="text-4xl font-extrabold text-yellow-400">{avgTotalGoals}</p>
          <p className="text-sm text-gray-500 mt-1">{t('stats.goalsInTournament')}</p>
        </div>
      )}

      {actualTotalGoals !== null && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-gold-400" />
            {t('stats.actualGoals')}
          </h2>
          <p className="text-4xl font-extrabold text-emerald-400">{actualTotalGoals.goals}</p>
          <p className="text-sm text-gray-500 mt-1">
            {t('stats.matchesPlayed', {
              count: actualTotalGoals.matches,
              s: actualTotalGoals.matches !== 1 ? 'es' : '',
              s2: actualTotalGoals.matches !== 1 ? 's' : '',
              avg: (actualTotalGoals.goals / actualTotalGoals.matches).toFixed(1),
            })}
          </p>
        </div>
      )}

      {sortedGroups.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-gold-400" />
            {t('stats.groupFavorites')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedGroups.map((letter) => {
              const picks = groupWinners[letter];
              return (
                <div
                  key={letter}
                  className="bg-wc-card border border-wc-border rounded-xl overflow-hidden"
                >
                  <div className="bg-wc-darker px-4 py-2 border-b border-wc-border">
                    <h3 className="text-sm font-bold text-gold-400">{t('stats.group', { letter })}</h3>
                  </div>
                  <div className="divide-y divide-wc-border">
                    {picks.map((pick) => (
                      <div
                        key={pick.team.id}
                        className="flex items-center justify-between px-4 py-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <TeamFlag team={pick.team} size="sm" />
                          <span className="text-sm text-gray-300">{pick.team.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          {t('stats.votes', { count: pick.count, s: pick.count !== 1 ? 's' : '' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {consensusScores.length > 0 && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gold-400" />
            {t('stats.consensusScore')}
          </h2>
          <div className="space-y-3">
            {consensusScores.map((cs) => (
              <div
                key={cs.match_id}
                className="flex items-center justify-between bg-wc-darker rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <TeamFlag team={cs.home_team} size="sm" />
                  <span className="text-xs text-gray-300 truncate">{cs.home_team.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 px-3">
                  <span className="text-sm font-bold text-gold-400 tabular-nums">
                    {cs.avg_home.toFixed(1)}
                  </span>
                  <span className="text-gray-600">-</span>
                  <span className="text-sm font-bold text-gold-400 tabular-nums">
                    {cs.avg_away.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <span className="text-xs text-gray-300 truncate text-right">{cs.away_team.name}</span>
                  <TeamFlag team={cs.away_team} size="sm" />
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-600 text-center mt-2">
              {t('stats.consensusBasis')}
            </p>
          </div>
        </div>
      )}

      {championPicks.length === 0 && avgTotalGoals === null && actualTotalGoals === null && sortedGroups.length === 0 && consensusScores.length === 0 && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-12 text-center">
          <BarChart3 className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">
            {t('stats.empty')}
          </p>
        </div>
      )}
    </div>
  );
}
