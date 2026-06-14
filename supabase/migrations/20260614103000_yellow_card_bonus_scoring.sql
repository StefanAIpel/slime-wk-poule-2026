-- Voeg totaal gele kaarten toe als bonusvraag/fact en laat de voortgangsview
-- deze nieuwe bonusvraag meetellen.
alter table public.special_predictions
  add column if not exists total_yellow_cards int check (total_yellow_cards is null or total_yellow_cards between 0 and 700);

alter table public.tournament_facts
  add column if not exists total_yellow_cards int check (total_yellow_cards is null or total_yellow_cards between 0 and 700);

create or replace view public.prediction_completion
with (security_invoker = true) as
select
  pr.id as user_id,
  pr.nickname,
  pr.team_name,
  pr.created_at,
  coalesce(g.group_filled, 0) as group_filled,
  coalesce(b.knockout_filled, 0) as knockout_filled,
  coalesce(s.bonus_filled, 0) as bonus_filled,
  coalesce(m.pool_count, 0) as pool_count
from public.profiles pr
left join (
  select user_id, count(*) as group_filled
  from public.predictions
  group by user_id
) g on g.user_id = pr.id
left join (
  select bp.user_id,
    sum(least(coalesce(array_length(array_remove(bp.team_codes, ''), 1), 0), tgt.target)) as knockout_filled
  from public.bracket_predictions bp
  join (values ('round16', 16), ('quarterfinal', 8), ('semifinal', 4), ('finalists', 2), ('champion', 1))
    as tgt(stage_key, target) on tgt.stage_key = bp.stage_key
  group by bp.user_id
) b on b.user_id = pr.id
left join (
  select user_id,
    (case when team_most_goals_code is not null and team_most_goals_code <> '' then 1 else 0 end)
    + (case when total_goals is not null then 1 else 0 end)
    + (case when total_yellow_cards is not null then 1 else 0 end)
    + (case when total_red_cards is not null then 1 else 0 end)
    + (case when fastest_goal_minute is not null then 1 else 0 end)
    + (case when oranje_stage is not null and oranje_stage <> '' then 1 else 0 end)
    + (case when penalty_shootouts_ko is not null then 1 else 0 end) as bonus_filled
  from public.special_predictions
) s on s.user_id = pr.id
left join (
  select user_id, count(*) as pool_count
  from public.pool_members
  group by user_id
) m on m.user_id = pr.id;

revoke all on public.prediction_completion from anon, authenticated;
