'use client';

import type { TeamStanding } from '@/lib/group-standings';

interface PredictedStandingsProps {
  standings: TeamStanding[];
}

export default function PredictedStandings({ standings }: PredictedStandingsProps) {
  if (standings.length === 0 || standings.every((s) => s.played === 0)) {
    return null;
  }

  return (
    <div className="mt-3 bg-wc-darker rounded-lg overflow-hidden border border-wc-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-500 border-b border-wc-border">
            <th className="text-left py-1.5 px-2 font-medium">#</th>
            <th className="text-left py-1.5 px-2 font-medium">Equipo</th>
            <th className="text-center py-1.5 px-1 font-medium">PJ</th>
            <th className="text-center py-1.5 px-1 font-medium">G</th>
            <th className="text-center py-1.5 px-1 font-medium">E</th>
            <th className="text-center py-1.5 px-1 font-medium">P</th>
            <th className="text-center py-1.5 px-1 font-medium">GF</th>
            <th className="text-center py-1.5 px-1 font-medium">GC</th>
            <th className="text-center py-1.5 px-1 font-medium">DG</th>
            <th className="text-center py-1.5 px-2 font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => {
            let rowClass = '';
            if (team.position <= 2) {
              rowClass = 'bg-emerald-900/20';
            } else if (team.position === 3) {
              rowClass = 'bg-yellow-900/15';
            } else {
              rowClass = 'bg-transparent';
            }

            return (
              <tr key={team.teamId} className={`${rowClass} border-b border-wc-border last:border-b-0`}>
                <td className="py-1.5 px-2 text-gray-500">{team.position}</td>
                <td className="py-1.5 px-2">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={team.flagUrl}
                      alt={team.teamCode}
                      className="w-4 h-3 object-cover rounded-sm border border-wc-border"
                    />
                    <span className="text-gray-300 truncate">{team.teamCode}</span>
                  </div>
                </td>
                <td className="text-center py-1.5 px-1 text-gray-400">{team.played}</td>
                <td className="text-center py-1.5 px-1 text-gray-400">{team.won}</td>
                <td className="text-center py-1.5 px-1 text-gray-400">{team.drawn}</td>
                <td className="text-center py-1.5 px-1 text-gray-400">{team.lost}</td>
                <td className="text-center py-1.5 px-1 text-gray-400">{team.goalsFor}</td>
                <td className="text-center py-1.5 px-1 text-gray-400">{team.goalsAgainst}</td>
                <td className="text-center py-1.5 px-1 text-gray-400">{team.goalDifference}</td>
                <td className="text-center py-1.5 px-2 font-bold text-white">{team.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
