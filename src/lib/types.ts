export type Team = {
  code: string;
  name_nl: string;
  group_letter: string;
  sort_order: number;
};

export type MatchWithTeams = {
  id: number;
  group_letter: string | null;
  starts_at: string | null;
  venue: string;
  home_code: string | null;
  away_code: string | null;
  status: "scheduled" | "live" | "finished";
  home_score: number | null;
  away_score: number | null;
  home?: Team | null;
  away?: Team | null;
};

export type Profile = {
  id: string;
  nickname: string | null;
  team_name: string | null;
};

export type Score = {
  user_id: string;
  points: number;
  exact_scores: number;
  correct_results: number;
  bonus_points: number;
  profiles?: Profile | null;
};
