import type { Match, Team } from './types';

export interface TeamStanding {
  teamId: string;
  teamName: string;
  teamCode: string;
  flagUrl: string;
  groupLetter: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
}

export interface GroupStandingsResult {
  standings: Record<string, TeamStanding[]>;
  qualifiedTop2: string[];
  qualifiedBest3rd: string[];
  allQualified: string[];
}

function sortStandings(a: TeamStanding, b: TeamStanding): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
  return a.teamName.localeCompare(b.teamName);
}

export function calculateGroupStandings(
  teams: Team[],
  matches: Match[],
  predictions: Record<string, { home: number; away: number }>
): GroupStandingsResult {
  const groups = Array.from(new Set(teams.map((t) => t.group_letter))).sort();
  const standings: Record<string, TeamStanding[]> = {};
  const allThirds: TeamStanding[] = [];

  for (const group of groups) {
    const groupTeams = teams.filter((t) => t.group_letter === group);
    const groupMatches = matches.filter(
      (m) => m.group_letter === group && m.home_team && m.away_team
    );

    const standingMap: Record<string, TeamStanding> = {};
    for (const team of groupTeams) {
      standingMap[team.id] = {
        teamId: team.id,
        teamName: team.name,
        teamCode: team.code,
        flagUrl: team.flag_url,
        groupLetter: group,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        position: 0,
      };
    }

    for (const match of groupMatches) {
      const pred = predictions[match.id];
      if (!pred) continue;

      const homeId = match.home_team_id!;
      const awayId = match.away_team_id!;
      const home = standingMap[homeId];
      const away = standingMap[awayId];
      if (!home || !away) continue;

      home.played++;
      away.played++;
      home.goalsFor += pred.home;
      home.goalsAgainst += pred.away;
      away.goalsFor += pred.away;
      away.goalsAgainst += pred.home;

      if (pred.home > pred.away) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (pred.home < pred.away) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        away.drawn++;
        home.points += 1;
        away.points += 1;
      }
    }

    // Update goal difference and sort
    const sorted = Object.values(standingMap);
    for (const s of sorted) {
      s.goalDifference = s.goalsFor - s.goalsAgainst;
    }
    sorted.sort(sortStandings);
    sorted.forEach((s, i) => (s.position = i + 1));

    standings[group] = sorted;

    // Track 3rd place teams
    if (sorted.length >= 3) {
      allThirds.push(sorted[2]);
    }
  }

  // Calculate qualified teams
  const qualifiedTop2: string[] = [];
  for (const group of groups) {
    const groupStandings = standings[group];
    if (groupStandings && groupStandings.length >= 2) {
      // Only include if they've played at least 1 match
      if (groupStandings[0].played > 0) qualifiedTop2.push(groupStandings[0].teamId);
      if (groupStandings[1].played > 0) qualifiedTop2.push(groupStandings[1].teamId);
    }
  }

  // Best 8 third-placed teams
  const validThirds = allThirds.filter((t) => t.played > 0);
  validThirds.sort(sortStandings);
  const qualifiedBest3rd = validThirds.slice(0, 8).map((t) => t.teamId);

  const allQualified = [...qualifiedTop2, ...qualifiedBest3rd];

  return { standings, qualifiedTop2, qualifiedBest3rd, allQualified };
}
