'use client';

import type { Match, Team } from '@/lib/types';
import MatchScoreInput from './MatchScoreInput';

interface GroupStageFormProps {
  groups: string[];
  matches: Match[];
  predictions: Record<string, { home: number; away: number }>;
  onPredictionChange: (matchId: string, home: number, away: number) => void;
  disabled?: boolean;
}

export default function GroupStageForm({
  groups,
  matches,
  predictions,
  onPredictionChange,
  disabled = false,
}: GroupStageFormProps) {
  const matchesByGroup = groups.reduce<Record<string, Match[]>>((acc, group) => {
    acc[group] = matches
      .filter((m) => m.group_letter === group && m.home_team && m.away_team)
      .sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
    return acc;
  }, {});

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
                Grupo {group}
              </h3>
              <span className="text-xs text-gray-500">
                {predictedCount}/{groupMatches.length} predichos
              </span>
            </div>
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
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
