const BASE_URL = "https://api.football-data.org/v4";
const API_KEY = process.env.FOOTBALL_DATA_API_KEY || "";

interface FootballApiMatch {
  id: number;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  utcDate: string;
  score: {
    fullTime: { home: number | null; away: number | null };
  };
  homeTeam: { id: number; name: string; tla: string };
  awayTeam: { id: number; name: string; tla: string };
  venue: string | null;
}

interface FootballApiResponse {
  matches: FootballApiMatch[];
}

export async function fetchWorldCupMatches(): Promise<FootballApiMatch[]> {
  const res = await fetch(`${BASE_URL}/competitions/WC/matches`, {
    headers: { "X-Auth-Token": API_KEY },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Football API error: ${res.status} ${res.statusText}`);
  }

  const data: FootballApiResponse = await res.json();
  return data.matches;
}

export function mapApiStatus(
  apiStatus: string
): "scheduled" | "live" | "finished" | "postponed" {
  switch (apiStatus) {
    case "FINISHED":
      return "finished";
    case "IN_PLAY":
    case "PAUSED":
    case "LIVE":
      return "live";
    case "POSTPONED":
    case "SUSPENDED":
    case "CANCELLED":
      return "postponed";
    default:
      return "scheduled";
  }
}

export function mapApiStage(
  apiStage: string
): string {
  const stageMap: Record<string, string> = {
    GROUP_STAGE: "group",
    LAST_32: "round_32",
    LAST_16: "round_16",
    QUARTER_FINALS: "quarter",
    SEMI_FINALS: "semi",
    THIRD_PLACE: "third_place",
    FINAL: "final",
  };
  return stageMap[apiStage] || "group";
}
