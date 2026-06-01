create table public.stage_results (
  stage_key text primary key check (stage_key in ('round32', 'round16', 'quarterfinal', 'semifinal', 'finalists', 'champion')),
  team_codes text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.tournament_facts (
  id boolean primary key default true check (id),
  top_scorers text[] not null default '{}',
  total_goals int check (total_goals is null or total_goals between 100 and 500),
  group_zero_zero_count int check (group_zero_zero_count is null or group_zero_zero_count between 0 and 40),
  total_red_cards int check (total_red_cards is null or total_red_cards between 0 and 80),
  host_city_most_goals text,
  penalty_shootouts_ko int check (penalty_shootouts_ko is null or penalty_shootouts_ko between 0 and 30),
  own_goals_ko int check (own_goals_ko is null or own_goals_ko between 0 and 30),
  cards_ko_team_code text references public.teams(code),
  updated_at timestamptz not null default now()
);

create trigger stage_results_set_updated_at
before update on public.stage_results
for each row execute function app.set_updated_at();

create trigger tournament_facts_set_updated_at
before update on public.tournament_facts
for each row execute function app.set_updated_at();

alter table public.stage_results enable row level security;
alter table public.tournament_facts enable row level security;

create policy "stage results are readable after login"
on public.stage_results for select to authenticated
using (true);

create policy "tournament facts are readable after login"
on public.tournament_facts for select to authenticated
using (true);

grant select on public.stage_results, public.tournament_facts to authenticated;
grant all on public.stage_results, public.tournament_facts to service_role;
