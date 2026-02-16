'use client';

import { Minus, Plus } from 'lucide-react';
import type { Match, Team } from '@/lib/types';

interface MatchScoreInputProps {
  match: Match & { home_team: Team; away_team: Team };
  homeScore: number | null;
  awayScore: number | null;
  onChange: (home: number, away: number) => void;
  disabled?: boolean;
}

function ScoreButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border text-gray-300 hover:bg-wc-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

function TeamDisplay({ team, side }: { team: Team; side: 'home' | 'away' }) {
  return (
    <div className={`flex items-center gap-2 min-w-0 ${side === 'away' ? 'flex-row-reverse' : ''}`}>
      <img
        src={team.flag_url}
        alt={team.name}
        className="w-8 h-6 object-cover rounded-sm shrink-0 border border-wc-border"
      />
      <span className="text-sm text-gray-200 truncate">{team.name}</span>
    </div>
  );
}

export default function MatchScoreInput({
  match,
  homeScore,
  awayScore,
  onChange,
  disabled = false,
}: MatchScoreInputProps) {
  const currentHome = homeScore ?? 0;
  const currentAway = awayScore ?? 0;
  const isPredicted = homeScore !== null && awayScore !== null;

  function handleChange(side: 'home' | 'away', delta: number) {
    if (disabled) return;
    const newHome = side === 'home' ? Math.max(0, Math.min(20, currentHome + delta)) : currentHome;
    const newAway = side === 'away' ? Math.max(0, Math.min(20, currentAway + delta)) : currentAway;
    onChange(newHome, newAway);
  }

  return (
    <div
      className={`bg-wc-card border rounded-lg p-3 transition-colors ${
        isPredicted ? 'border-gold-500/40' : 'border-wc-border'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Home Team */}
        <div className="flex-1 min-w-0">
          <TeamDisplay team={match.home_team} side="home" />
        </div>

        {/* Score Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <ScoreButton onClick={() => handleChange('home', -1)} disabled={disabled || currentHome <= 0}>
            <Minus className="w-3.5 h-3.5" />
          </ScoreButton>
          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border">
            <span className={`text-base font-bold tabular-nums ${isPredicted ? 'text-gold-400' : 'text-gray-500'}`}>
              {homeScore !== null ? homeScore : '-'}
            </span>
          </div>
          <ScoreButton onClick={() => handleChange('home', 1)} disabled={disabled || currentHome >= 20}>
            <Plus className="w-3.5 h-3.5" />
          </ScoreButton>

          <span className="text-gray-600 font-bold mx-1">-</span>

          <ScoreButton onClick={() => handleChange('away', -1)} disabled={disabled || currentAway <= 0}>
            <Minus className="w-3.5 h-3.5" />
          </ScoreButton>
          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-wc-darker border border-wc-border">
            <span className={`text-base font-bold tabular-nums ${isPredicted ? 'text-gold-400' : 'text-gray-500'}`}>
              {awayScore !== null ? awayScore : '-'}
            </span>
          </div>
          <ScoreButton onClick={() => handleChange('away', 1)} disabled={disabled || currentAway >= 20}>
            <Plus className="w-3.5 h-3.5" />
          </ScoreButton>
        </div>

        {/* Away Team */}
        <div className="flex-1 min-w-0">
          <TeamDisplay team={match.away_team} side="away" />
        </div>
      </div>
    </div>
  );
}
