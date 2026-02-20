'use client';

import { useMemo } from 'react';
import type { Match, Team } from '@/lib/types';
import { SCORING } from '@/lib/constants';
import { useTranslation } from '@/i18n';
import { calculateGroupStandings } from '@/lib/group-standings';
import MatchScoreInput from './MatchScoreInput';
import PredictedStandings from './PredictedStandings';

interface GroupStageFormProps {
  groups: string[];
  matches: Match[];
  teams: Team[];
  predictions: Record<string, { home: number; away: number; pointsEarned?: number | null; isLoneWolf?: boolean }>;
  onPredictionChange: (matchId: string, home: number, away: number) => void;
  disabled?: boolean;
}

export default function GroupStageForm({
  groups,
  matches,
  teams,
  predictions,
  onPredictionChange,
  disabled = false,
}: GroupStageFormProps) {
  const { t } = useTranslation();

  const matchesByGroup = groups.reduce<Record<string, Match[]>>((acc, group) => {
    acc[group] = matches
      .filter((m) => m.group_letter === group && m.home_team && m.away_team)
      .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
    return acc;
  }, {});

  const groupStandings = useMemo(() => {
    const groupTeams = teams.filter((t) => groups.includes(t.group_letter));
    const groupMatches = matches.filter((m) => groups.includes(m.group_letter || ''));
    return calculateGroupStandings(groupTeams, groupMatches, predictions);
  }, [teams, matches, groups, predictions]);

  return (
    <div className="space-y-8">
      {groups.map((group) => {
        const groupMatches = matchesByGroup[group] || [];
        if (groupMatches.length === 0) return null;

        const predictedCount = groupMatches.filter((m) => predictions[m.id]).length;

        return (
          <div key={group}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">
                {t("groupStage.group", { letter: group })}
              </h3>
              <span className="text-xs text-gray-500">
                {t("groupStage.predicted", { count: predictedCount, total: groupMatches.length })}
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-2">
              {t("groupStage.scoringHint", { exact: SCORING.EXACT_SCORE, diff: SCORING.CORRECT_RESULT_AND_DIFF, result: SCORING.CORRECT_RESULT })}
            </p>
            <div className="space-y-2">
              {groupMatches.map((match) => {
                const prediction = predictions[match.id];
                return (
                  <MatchScoreInput
                    key={match.id}
                    match={match as Match & { home_team: Team; away_team: Team }}
                    homeScore={prediction?.home ?? null}
                    awayScore={prediction?.away ?? null}
                    onChange={(home, away) => onPredictionChange(match.id, home, away)}
                    disabled={disabled}
                    pointsEarned={prediction?.pointsEarned}
                    isLoneWolf={prediction?.isLoneWolf}
                    actualHome={match.home_score}
                    actualAway={match.away_score}
                  />
                );
              })}
            </div>
            {groupStandings.standings[group] && (
              <PredictedStandings standings={groupStandings.standings[group]} />
            )}
          </div>
        );
      })}
    </div>
  );
}
