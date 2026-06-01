alter table public.special_predictions
  add column total_corners int check (total_corners is null or total_corners between 400 and 1400),
  add column fastest_goal_minute int check (fastest_goal_minute is null or fastest_goal_minute between 1 and 120);

alter table public.tournament_facts
  add column total_corners int check (total_corners is null or total_corners between 400 and 1400),
  add column fastest_goal_minute int check (fastest_goal_minute is null or fastest_goal_minute between 1 and 120);

create index if not exists scores_points_idx on public.scores (points desc, exact_scores desc, correct_results desc);
create index if not exists predictions_user_idx on public.predictions (user_id);
create index if not exists bracket_predictions_user_idx on public.bracket_predictions (user_id);
create index if not exists pool_members_user_idx on public.pool_members (user_id);
create index if not exists pool_members_pool_idx on public.pool_members (pool_id);
create index if not exists matches_stage_group_idx on public.matches (stage, group_letter, id);
