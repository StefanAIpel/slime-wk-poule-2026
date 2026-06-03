-- Bonusvragen herzien: nieuwe velden voor "team met meeste doelpunten" en
-- "hoe ver komt Oranje". Oude velden (top_scorer, group_zero_zero_count,
-- host_city_most_goals, total_corners) blijven bestaan maar worden niet meer
-- gebruikt in de UI/scoring.
alter table public.special_predictions
  add column if not exists team_most_goals_code text,
  add column if not exists oranje_stage text;

alter table public.tournament_facts
  add column if not exists team_most_goals_code text,
  add column if not exists oranje_stage text;
