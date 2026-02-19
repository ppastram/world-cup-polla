export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  country_code: string | null;
  is_admin: boolean;
  payment_status: "pending" | "uploaded" | "verified";
  payment_proof_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  flag_url: string;
  group_letter: string;
  external_id: number | null;
  created_at: string;
}

export type MatchStage =
  | "group"
  | "round_32"
  | "round_16"
  | "quarter"
  | "semi"
  | "third_place"
  | "final";

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export interface Match {
  id: string;
  stage: MatchStage;
  group_letter: string | null;
  match_number: number;
  home_team_id: string | null;
  away_team_id: string | null;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  match_date: string;
  venue: string | null;
  external_id: number | null;
  manual_override?: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  home_team?: Team;
  away_team?: Team;
}

export interface MatchPrediction {
  id: string;
  user_id: string;
  match_id: string;
  home_score: number;
  away_score: number;
  points_earned: number | null;
  created_at: string;
  updated_at: string;
}

export type AdvancingRound =
  | "round_32"
  | "round_16"
  | "quarter"
  | "semi"
  | "final"
  | "third_place"
  | "champion";

export interface AdvancingPrediction {
  id: string;
  user_id: string;
  team_id: string;
  round: AdvancingRound;
  points_earned: number | null;
  created_at: string;
  // Joined
  team?: Team;
}

export type AwardType =
  | "golden_ball"
  | "golden_boot"
  | "golden_glove"
  | "best_young"
  | "total_goals";

export interface AwardPrediction {
  id: string;
  user_id: string;
  award_type: AwardType;
  player_name: string | null;
  total_goals_guess: number | null;
  points_earned: number | null;
  created_at: string;
  updated_at: string;
}

export interface ActualAdvancing {
  id: string;
  team_id: string;
  round: AdvancingRound;
  created_at: string;
}

export interface ActualAward {
  id: string;
  award_type: AwardType;
  player_name: string | null;
  total_goals: number | null;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  total_points: number;
  match_points: number;
  advancing_points: number;
  award_points: number;
  rank: number;
  updated_at: string;
  // Joined
  profile?: Profile;
}

export interface ScoringSetting {
  id: string;
  key: string;
  value: number;
  description: string;
}

export interface BlogPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface BlogRead {
  id: string;
  user_id: string;
  last_read_at: string;
}

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}
