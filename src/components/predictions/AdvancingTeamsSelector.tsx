'use client';

import { useState } from 'react';
import type { Team } from '@/lib/types';
import { ADVANCING_ROUND_POINTS } from '@/lib/constants';

interface AdvancingTeamsSelectorProps {
  teams: Team[];
  predictions: Record<string, string[]>;
  onChange: (round: string, teamIds: string[]) => void;
  disabled?: boolean;
  autoRound32?: string[];
}

const ROUNDS = [
  { key: 'round_32', label: 'Dieciseisavos de Final', count: 32, description: 'Top 2 de cada grupo + 8 mejores terceros' },
  { key: 'round_16', label: 'Octavos de Final', count: 16, prev: 'round_32' },
  { key: 'quarter', label: 'Cuartos de Final', count: 8, prev: 'round_16' },
  { key: 'semi', label: 'Semifinales', count: 4, prev: 'quarter' },
  { key: 'final', label: 'Final', count: 2, prev: 'semi' },
  { key: 'champion', label: 'Campeon', count: 1, prev: 'final' },
] as const;

export default function AdvancingTeamsSelector({
  teams,
  predictions,
  onChange,
  disabled = false,
  autoRound32,
}: AdvancingTeamsSelectorProps) {
  const [expandedRound, setExpandedRound] = useState<string>(autoRound32 ? 'round_32' : 'round_32');

  const isAutoMode = !!autoRound32;
  const effectiveRound32 = isAutoMode ? autoRound32 : (predictions['round_32'] || []);

  function getAvailableTeams(round: typeof ROUNDS[number]): Team[] {
    if (round.key === 'round_32') {
      if (isAutoMode) {
        return teams
          .filter((t) => effectiveRound32.includes(t.id))
          .sort((a, b) => {
            if (a.group_letter !== b.group_letter) return a.group_letter.localeCompare(b.group_letter);
            return a.name.localeCompare(b.name);
          });
      }
      return [...teams].sort((a, b) => {
        if (a.group_letter !== b.group_letter) return a.group_letter.localeCompare(b.group_letter);
        return a.name.localeCompare(b.name);
      });
    }
    const prevKey = round.prev;
    if (!prevKey) return [];
    const prevSelected = prevKey === 'round_32' ? effectiveRound32 : (predictions[prevKey] || []);
    return teams
      .filter((t) => prevSelected.includes(t.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function toggleTeam(roundKey: string, teamId: string, maxCount: number) {
    if (disabled) return;
    if (isAutoMode && roundKey === 'round_32') return; // round_32 is read-only in auto mode
    const current = predictions[roundKey] || [];
    const isSelected = current.includes(teamId);

    let updated: string[];
    if (isSelected) {
      updated = current.filter((id) => id !== teamId);
      // Also remove from subsequent rounds
      const roundIndex = ROUNDS.findIndex((r) => r.key === roundKey);
      for (let i = roundIndex + 1; i < ROUNDS.length; i++) {
        const laterRound = ROUNDS[i];
        const laterPredictions = predictions[laterRound.key] || [];
        if (laterPredictions.includes(teamId)) {
          onChange(laterRound.key, laterPredictions.filter((id) => id !== teamId));
        }
      }
    } else {
      if (current.length >= maxCount) return;
      updated = [...current, teamId];
    }
    onChange(roundKey, updated);
  }

  // Manual rounds to display (skip round_32 header selection in auto mode)
  const displayRounds = isAutoMode ? ROUNDS : ROUNDS;

  return (
    <div className="space-y-4">
      {displayRounds.map((round) => {
        const isRound32Auto = isAutoMode && round.key === 'round_32';
        const selected = round.key === 'round_32' ? effectiveRound32 : (predictions[round.key] || []);
        const available = getAvailableTeams(round);
        const isExpanded = expandedRound === round.key;
        const isComplete = selected.length === round.count;

        const hasPrevSelection = round.key === 'round_32'
          || (round.prev === 'round_32' ? effectiveRound32.length > 0 : (round.prev && (predictions[round.prev] || []).length > 0));

        return (
          <div
            key={round.key}
            className={`border rounded-lg overflow-hidden transition-colors ${
              isComplete ? 'border-gold-500/40 bg-wc-card' : 'border-wc-border bg-wc-card'
            }`}
          >
            {/* Round Header */}
            <button
              type="button"
              onClick={() => setExpandedRound(isExpanded ? '' : round.key)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-wc-border/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isComplete
                      ? 'bg-gold-500 text-black'
                      : 'bg-wc-darker border border-wc-border text-gray-400'
                  }`}
                >
                  {isComplete ? '✓' : selected.length}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">
                    {round.label}
                    {isRound32Auto && (
                      <span className="text-xs text-blue-400 font-normal ml-2">· Auto</span>
                    )}
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      · {ADVANCING_ROUND_POINTS[round.key]} pts c/u
                    </span>
                  </p>
                  {'description' in round && (
                    <p className="text-xs text-gray-500">{round.description}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {selected.length}/{round.count}
              </span>
            </button>

            {/* Round Content */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-wc-border">
                {isRound32Auto ? (
                  // Auto round_32 display
                  effectiveRound32.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">
                      Completa predicciones de grupo para ver clasificados
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                      {available.map((team) => (
                        <div
                          key={team.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-gold-500/10 border-gold-500/40 text-gold-300"
                        >
                          <img
                            src={team.flag_url}
                            alt={team.code}
                            className="w-6 h-4 object-cover rounded-sm shrink-0 border border-wc-border"
                          />
                          <span className="text-xs font-medium truncate">{team.name}</span>
                          <span className="text-[10px] text-gray-500 ml-auto">{team.group_letter}</span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  // Manual selection rounds
                  <>
                    {!hasPrevSelection && (round.key as string) !== 'round_32' ? (
                      <p className="text-sm text-gray-500 py-4 text-center">
                        Primero selecciona los equipos de la ronda anterior
                      </p>
                    ) : (
                      <>
                        {selected.length >= round.count && (
                          <p className="text-xs text-gold-400 mt-3 mb-2">
                            Seleccion completa ({round.count}/{round.count})
                          </p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                          {available.map((team) => {
                            const isSelected = selected.includes(team.id);
                            const isFull = selected.length >= round.count && !isSelected;

                            return (
                              <button
                                key={team.id}
                                type="button"
                                onClick={() => toggleTeam(round.key, team.id, round.count)}
                                disabled={disabled || (isFull && !isSelected)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                                  isSelected
                                    ? 'bg-gold-500/20 border-gold-500/60 text-gold-300'
                                    : isFull
                                    ? 'bg-wc-darker border-wc-border text-gray-600 cursor-not-allowed opacity-40'
                                    : 'bg-wc-darker border-wc-border text-gray-300 hover:border-gold-500/40 hover:text-white'
                                }`}
                              >
                                <img
                                  src={team.flag_url}
                                  alt={team.code}
                                  className="w-6 h-4 object-cover rounded-sm shrink-0 border border-wc-border"
                                />
                                <span className="text-xs font-medium truncate">{team.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
