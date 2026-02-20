'use client';

import { Minus, Plus } from 'lucide-react';
import type { Match, Team } from '@/lib/types';

interface MatchScoreInputProps {
  match: Match & { home_team: Team; away_team: Team };
  homeScore: number | null;
  awayScore: number | null;
  onChange: (home: number, away: number) => void;
  disabled?: boolean;
  pointsEarned?: number | null;
  isLoneWolf?: boolean;
  actualHome?: number | null;
  actualAway?: number | null;
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

function getResultBorderClass(points: number | null | undefined): string {
  if (points === null || points === undefined) return '';
  if (points === 5) return 'border-emerald-500/60';
  if (points === 3) return 'border-blue-500/60';
  if (points === 2) return 'border-amber-500/60';
  return 'border-red-500/40';
}

function getPointsBadgeClass(points: number): string {
  if (points === 5) return 'bg-emerald-500/20 text-emerald-400';
  if (points === 3) return 'bg-blue-500/20 text-blue-400';
  if (points === 2) return 'bg-amber-500/20 text-amber-400';
  return 'bg-red-500/20 text-red-400';
}

export default function MatchScoreInput({
  match,
  homeScore,
  awayScore,
  onChange,
  disabled = false,
  pointsEarned,
  isLoneWolf,
  actualHome,
  actualAway,
}: MatchScoreInputProps) {
  const currentHome = homeScore ?? 0;
  const currentAway = awayScore ?? 0;
  const isPredicted = homeScore !== null && awayScore !== null;
  const isFinished = actualHome !== null && actualHome !== undefined && actualAway !== null && actualAway !== undefined;
  const isDisabled = disabled || isFinished;

  const resultBorder = isFinished ? (isLoneWolf ? 'border-purple-500/60' : getResultBorderClass(pointsEarned)) : '';

  function handleChange(side: 'home' | 'away', delta: number) {
    if (isDisabled) return;
    const newHome = side === 'home' ? Math.max(0, Math.min(20, currentHome + delta)) : currentHome;
    const newAway = side === 'away' ? Math.max(0, Math.min(20, currentAway + delta)) : currentAway;
    onChange(newHome, newAway);
  }

  return (
    <div
      className={`bg-wc-card border rounded-lg p-3 transition-colors relative ${
        resultBorder || (isPredicted ? 'border-gold-500/40' : 'border-wc-border')
      }`}
    >
      {/* Points badge */}
      {isFinished && pointsEarned !== null && pointsEarned !== undefined && (
        <div className={`absolute -top-2 -right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
          isLoneWolf ? 'bg-purple-500/20 text-purple-400' : getPointsBadgeClass(pointsEarned)
        }`}>
          {isLoneWolf && <span>🐺</span>}
          +{isLoneWolf ? pointsEarned * 2 : pointsEarned}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        {/* Home Team */}
        <div className="flex-1 min-w-0">
          <TeamDisplay team={match.home_team} side="home" />
        </div>

        {/* Score Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <ScoreButton onClick={() => handleChange('home', -1)} disabled={isDisabled || currentHome <= 0}>
            <Minus className="w-3.5 h-3.5" />
          </ScoreButton>
          <input
            type="number"
            min="0"
            max="20"
            value={homeScore !== null ? homeScore : ''}
            onChange={(e) => {
              if (isDisabled) return;
              const val = e.target.value === '' ? 0 : Math.max(0, Math.min(20, parseInt(e.target.value) || 0));
              onChange(val, currentAway);
            }}
            disabled={isDisabled}
            className={`w-9 h-9 text-center rounded-md bg-wc-darker border border-wc-border text-base font-bold tabular-nums focus:outline-none focus:border-gold-500/50 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isPredicted ? 'text-gold-400' : 'text-gray-500'}`}
          />
          <ScoreButton onClick={() => handleChange('home', 1)} disabled={isDisabled || currentHome >= 20}>
            <Plus className="w-3.5 h-3.5" />
          </ScoreButton>

          <span className="text-gray-600 font-bold mx-1">-</span>

          <ScoreButton onClick={() => handleChange('away', -1)} disabled={isDisabled || currentAway <= 0}>
            <Minus className="w-3.5 h-3.5" />
          </ScoreButton>
          <input
            type="number"
            min="0"
            max="20"
            value={awayScore !== null ? awayScore : ''}
            onChange={(e) => {
              if (isDisabled) return;
              const val = e.target.value === '' ? 0 : Math.max(0, Math.min(20, parseInt(e.target.value) || 0));
              onChange(currentHome, val);
            }}
            disabled={isDisabled}
            className={`w-9 h-9 text-center rounded-md bg-wc-darker border border-wc-border text-base font-bold tabular-nums focus:outline-none focus:border-gold-500/50 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isPredicted ? 'text-gold-400' : 'text-gray-500'}`}
          />
          <ScoreButton onClick={() => handleChange('away', 1)} disabled={isDisabled || currentAway >= 20}>
            <Plus className="w-3.5 h-3.5" />
          </ScoreButton>
        </div>

        {/* Away Team */}
        <div className="flex-1 min-w-0">
          <TeamDisplay team={match.away_team} side="away" />
        </div>
      </div>

      {/* Actual score display */}
      {isFinished && (
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500">
            Resultado: {actualHome} - {actualAway}
          </span>
        </div>
      )}
    </div>
  );
}
