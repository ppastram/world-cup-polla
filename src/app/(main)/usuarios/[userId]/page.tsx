'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Lock, Loader2, Trophy, Star, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { TOURNAMENT_START } from '@/lib/constants';
import MatchCard from '@/components/matches/MatchCard';
import TeamFlag from '@/components/shared/TeamFlag';
import MascotAvatar from '@/components/shared/MascotAvatar';
import { useTranslation } from '@/i18n';
import type {
  Profile,
  Match,
  Team,
  MatchPrediction,
  AdvancingPrediction,
  AwardPrediction,
} from '@/lib/types';

type MatchWithTeams = Match & { home_team?: Team; away_team?: Team };

export default function UserPredictionsPage() {
  const params = useParams();
  const userId = params.userId as string;
  const { t } = useTranslation();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  const [matchPredictions, setMatchPredictions] = useState<MatchPrediction[]>([]);
  const [advancingPredictions, setAdvancingPredictions] = useState<(AdvancingPrediction & { team?: Team })[]>([]);
  const [awardPredictions, setAwardPredictions] = useState<AwardPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  const isTournamentStarted = new Date() >= TOURNAMENT_START;

  const stageLabel = (stage: string) => {
    const key = `stage.${stage}` as Parameters<typeof t>[0];
    return t(key) || stage;
  };

  const awardLabel = (type: string) => {
    const map: Record<string, string> = {
      golden_ball: t('awards.goldenBall'),
      golden_boot: t('awards.goldenBoot'),
      golden_glove: t('awards.goldenGlove'),
      best_young: t('awards.bestYoung'),
      total_goals: t('awards.totalGoals'),
    };
    return map[type] || type;
  };

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(profileData);

      if (!isTournamentStarted) {
        setLoading(false);
        return;
      }

      const [matchesRes, matchPredRes, advRes, awardRes] = await Promise.all([
        supabase
          .from('matches')
          .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
          .eq('stage', 'group')
          .order('match_date', { ascending: true }),
        supabase
          .from('match_predictions')
          .select('*')
          .eq('user_id', userId),
        supabase
          .from('advancing_predictions')
          .select('*, team:teams(*)')
          .eq('user_id', userId)
          .order('round', { ascending: true }),
        supabase
          .from('award_predictions')
          .select('*')
          .eq('user_id', userId),
      ]);

      setMatches((matchesRes.data as unknown as MatchWithTeams[]) ?? []);
      setMatchPredictions(matchPredRes.data ?? []);
      setAdvancingPredictions((advRes.data as unknown as (AdvancingPrediction & { team?: Team })[]) ?? []);
      setAwardPredictions(awardRes.data ?? []);
      setLoading(false);
    }

    fetchData();
  }, [userId, isTournamentStarted]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <MascotAvatar avatarUrl={profile?.avatar_url} displayName={profile?.display_name || '?'} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-white">
            {profile?.display_name ?? t('userPredictions.user')}
          </h1>
          <p className="text-sm text-gray-500">{t('userPredictions.predictions')}</p>
        </div>
      </div>

      {!isTournamentStarted && (
        <div className="bg-wc-card border border-wc-border rounded-xl p-12 text-center">
          <Lock className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-400 mb-2">
            {t('userPredictions.lockedTitle')}
          </p>
          <p className="text-sm text-gray-600">
            {t('userPredictions.lockedDesc')}
          </p>
        </div>
      )}

      {isTournamentStarted && (
        <>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-gold-400" />
              {t('userPredictions.matchPredictions')}
            </h2>
            {matches.length === 0 ? (
              <p className="text-gray-500 text-sm">{t('userPredictions.noMatches')}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {matches.map((match) => {
                  const pred = matchPredictions.find((p) => p.match_id === match.id);
                  return (
                    <div key={match.id} className="relative">
                      <MatchCard
                        match={match}
                        prediction={
                          pred
                            ? { home_score: pred.home_score, away_score: pred.away_score }
                            : undefined
                        }
                        showPrediction={!!pred}
                      />
                      {pred && pred.points_earned !== null && (
                        <div className="absolute top-2 right-2 bg-gold-500/20 border border-gold-500/30 rounded-md px-2 py-0.5">
                          <span className="text-xs font-bold text-gold-400">
                            +{pred.points_earned}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {advancingPredictions.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-gold-400" />
                {t('userPredictions.advancingTeams')}
              </h2>
              <div className="bg-wc-card border border-wc-border rounded-xl divide-y divide-wc-border">
                {advancingPredictions.map((pred) => (
                  <div key={pred.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      {pred.team && <TeamFlag team={pred.team} size="sm" />}
                      <span className="text-sm text-gray-200">{pred.team?.name ?? '?'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {stageLabel(pred.round)}
                      </span>
                      {pred.points_earned !== null && (
                        <span className={`text-xs font-bold ${
                          pred.points_earned > 0 ? 'text-gold-400' : 'text-gray-600'
                        }`}>
                          +{pred.points_earned}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {awardPredictions.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-gold-400" />
                {t('userPredictions.individualAwards')}
              </h2>
              <div className="bg-wc-card border border-wc-border rounded-xl divide-y divide-wc-border">
                {awardPredictions.map((pred) => (
                  <div key={pred.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        {awardLabel(pred.award_type)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pred.player_name ??
                          (pred.total_goals_guess !== null
                            ? t('userPredictions.goals', { count: pred.total_goals_guess })
                            : t('userPredictions.noPrediction'))}
                      </p>
                    </div>
                    {pred.points_earned !== null && (
                      <span className={`text-xs font-bold ${
                        pred.points_earned > 0 ? 'text-gold-400' : 'text-gray-600'
                      }`}>
                        +{pred.points_earned}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
