'use client';

import { Trophy, Medal, Award } from 'lucide-react';
import type { LeaderboardEntry } from '@/lib/types';
import MascotAvatar from '@/components/shared/MascotAvatar';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  onUserClick?: (userId: string) => void;
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return {
        bg: 'bg-yellow-500/10 border-yellow-500/30',
        text: 'text-yellow-400',
        icon: <Trophy className="w-5 h-5 text-yellow-400" />,
      };
    case 2:
      return {
        bg: 'bg-gray-400/10 border-gray-400/30',
        text: 'text-gray-300',
        icon: <Medal className="w-5 h-5 text-gray-300" />,
      };
    case 3:
      return {
        bg: 'bg-amber-700/10 border-amber-700/30',
        text: 'text-amber-600',
        icon: <Award className="w-5 h-5 text-amber-600" />,
      };
    default:
      return {
        bg: 'bg-transparent border-transparent',
        text: 'text-gray-500',
        icon: null,
      };
  }
}

export default function LeaderboardTable({ entries, onUserClick }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-wc-card border border-wc-border rounded-xl p-8 text-center">
        <Trophy className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500">La tabla de posiciones se actualizara cuando comience el mundial.</p>
      </div>
    );
  }

  return (
    <div className="bg-wc-card border border-wc-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="hidden sm:grid grid-cols-[60px_1fr_80px_80px_80px_80px] gap-2 px-4 py-3 bg-wc-darker border-b border-wc-border text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <span className="text-center">#</span>
        <span>Participante</span>
        <span className="text-center">Total</span>
        <span className="text-center">Partidos</span>
        <span className="text-center">Clasif.</span>
        <span className="text-center">Premios</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-wc-border">
        {entries.map((entry) => {
          const style = getRankStyle(entry.rank);
          const profile = entry.profile;

          return (
            <div
              key={entry.user_id}
              onClick={() => onUserClick?.(entry.user_id)}
              className={`grid grid-cols-[60px_1fr_80px] sm:grid-cols-[60px_1fr_80px_80px_80px_80px] gap-2 px-4 py-3 items-center border-l-2 ${style.bg} hover:bg-white/[0.02] transition-colors ${
                onUserClick ? 'cursor-pointer' : ''
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center">
                {style.icon ?? (
                  <span className={`text-sm font-bold ${style.text}`}>
                    {entry.rank}
                  </span>
                )}
              </div>

              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <MascotAvatar avatarUrl={profile?.avatar_url} displayName={profile?.display_name ?? '?'} size="sm" />
                <span className="text-sm font-medium text-gray-200 truncate">
                  {profile?.display_name ?? 'Usuario'}
                </span>
              </div>

              {/* Total Points */}
              <div className="text-center">
                <span className={`text-sm font-bold ${entry.rank <= 3 ? style.text : 'text-white'}`}>
                  {entry.total_points}
                </span>
              </div>

              {/* Match Points - hidden on mobile */}
              <div className="hidden sm:block text-center">
                <span className="text-sm text-gray-400">{entry.match_points}</span>
              </div>

              {/* Advancing Points - hidden on mobile */}
              <div className="hidden sm:block text-center">
                <span className="text-sm text-gray-400">{entry.advancing_points}</span>
              </div>

              {/* Award Points - hidden on mobile */}
              <div className="hidden sm:block text-center">
                <span className="text-sm text-gray-400">{entry.award_points}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
