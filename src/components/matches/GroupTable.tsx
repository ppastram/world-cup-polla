'use client';

import TeamFlag from '@/components/shared/TeamFlag';
import type { Team } from '@/lib/types';

interface GroupTableProps {
  groupLetter: string;
  teams: Team[];
}

export default function GroupTable({ groupLetter, teams }: GroupTableProps) {
  return (
    <div className="bg-wc-card border border-wc-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-wc-darker px-4 py-2.5 border-b border-wc-border">
        <h3 className="text-sm font-bold text-gold-400">
          Grupo {groupLetter}
        </h3>
      </div>

      {/* Teams */}
      <div className="divide-y divide-wc-border">
        {teams.map((team) => (
          <div
            key={team.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
          >
            <TeamFlag team={team} size="md" />
            <span className="text-sm text-gray-200">{team.name}</span>
            <span className="ml-auto text-xs text-gray-600 font-mono">{team.code}</span>
          </div>
        ))}
        {teams.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-600">
            Sin equipos asignados
          </div>
        )}
      </div>
    </div>
  );
}
