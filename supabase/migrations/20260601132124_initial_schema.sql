create extension if not exists pgcrypto;

create schema if not exists app;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  team_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_nickname_len check (nickname is null or char_length(nickname) between 2 and 40),
  constraint profiles_team_name_len check (team_name is null or char_length(team_name) between 2 and 40)
);

create table public.teams (
  code text primary key,
  name_nl text not null,
  group_letter text not null check (group_letter ~ '^[A-L]$'),
  sort_order int not null
);

create table public.matches (
  id int primary key,
  stage text not null default 'group',
  group_letter text check (group_letter is null or group_letter ~ '^[A-L]$'),
  starts_at timestamptz,
  venue text not null,
  home_code text references public.teams(code),
  away_code text references public.teams(code),
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'finished')),
  home_score int check (home_score is null or home_score >= 0),
  away_score int check (away_score is null or away_score >= 0),
  winner_code text references public.teams(code),
  source text,
  updated_at timestamptz not null default now()
);

create table public.pools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 50),
  code text not null unique check (code ~ '^[A-Z0-9]{6,10}$'),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.pool_members (
  pool_id uuid not null references public.pools(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (pool_id, user_id)
);

create table public.predictions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  match_id int not null references public.matches(id) on delete cascade,
  home_score int not null check (home_score between 0 and 20),
  away_score int not null check (away_score between 0 and 20),
  updated_at timestamptz not null default now(),
  primary key (user_id, match_id)
);

create table public.bracket_predictions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  stage_key text not null check (stage_key in ('round32', 'round16', 'quarterfinal', 'semifinal', 'finalists', 'champion')),
  team_codes text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, stage_key)
);

create table public.special_predictions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  top_scorer text,
  total_goals int check (total_goals is null or total_goals between 100 and 400),
  group_zero_zero_count int check (group_zero_zero_count is null or group_zero_zero_count between 0 and 30),
  total_red_cards int check (total_red_cards is null or total_red_cards between 0 and 50),
  host_city_most_goals text,
  champion_code text references public.teams(code),
  finalists text[] not null default '{}',
  penalty_shootouts_ko int check (penalty_shootouts_ko is null or penalty_shootouts_ko between 0 and 20),
  own_goals_ko int check (own_goals_ko is null or own_goals_ko between 0 and 20),
  cards_ko_team_code text references public.teams(code),
  post_group_updated_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.scores (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  points int not null default 0,
  exact_scores int not null default 0,
  correct_results int not null default 0,
  bonus_points int not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function app.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function app.set_updated_at();

create trigger matches_set_updated_at
before update on public.matches
for each row execute function app.set_updated_at();

create trigger predictions_set_updated_at
before update on public.predictions
for each row execute function app.set_updated_at();

create trigger bracket_predictions_set_updated_at
before update on public.bracket_predictions
for each row execute function app.set_updated_at();

create trigger special_predictions_set_updated_at
before update on public.special_predictions
for each row execute function app.set_updated_at();

create or replace function app.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  insert into public.scores (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function app.handle_new_user();

create or replace function app.is_pool_member(pool uuid, member uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.pool_members pm
    where pm.pool_id = pool and pm.user_id = member
  );
$$;

create or replace function app.is_pool_owner(pool uuid, member uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.pool_members pm
    where pm.pool_id = pool and pm.user_id = member and pm.role = 'owner'
  );
$$;

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.matches enable row level security;
alter table public.pools enable row level security;
alter table public.pool_members enable row level security;
alter table public.predictions enable row level security;
alter table public.bracket_predictions enable row level security;
alter table public.special_predictions enable row level security;
alter table public.scores enable row level security;

create policy "profiles are readable after login"
on public.profiles for select to authenticated
using (true);

create policy "users can insert own profile"
on public.profiles for insert to authenticated
with check (id = auth.uid());

create policy "users can update own profile"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "teams are public"
on public.teams for select to anon, authenticated
using (true);

create policy "matches are public"
on public.matches for select to anon, authenticated
using (true);

create policy "members can read their pools"
on public.pools for select to authenticated
using (app.is_pool_member(id));

create policy "users can create owned pools"
on public.pools for insert to authenticated
with check (owner_id = auth.uid());

create policy "owners can update pools"
on public.pools for update to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "owners can delete pools"
on public.pools for delete to authenticated
using (owner_id = auth.uid());

create policy "members can read fellow members"
on public.pool_members for select to authenticated
using (app.is_pool_member(pool_id));

create policy "members can leave and owners can remove"
on public.pool_members for delete to authenticated
using (user_id = auth.uid() or app.is_pool_owner(pool_id));

create policy "users can read own predictions"
on public.predictions for select to authenticated
using (user_id = auth.uid());

create policy "users can insert own predictions"
on public.predictions for insert to authenticated
with check (user_id = auth.uid());

create policy "users can update own predictions"
on public.predictions for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users can read own bracket predictions"
on public.bracket_predictions for select to authenticated
using (user_id = auth.uid());

create policy "users can insert own bracket predictions"
on public.bracket_predictions for insert to authenticated
with check (user_id = auth.uid());

create policy "users can update own bracket predictions"
on public.bracket_predictions for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users can read own specials"
on public.special_predictions for select to authenticated
using (user_id = auth.uid());

create policy "users can insert own specials"
on public.special_predictions for insert to authenticated
with check (user_id = auth.uid());

create policy "users can update own specials"
on public.special_predictions for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "scores are readable after login"
on public.scores for select to authenticated
using (true);

grant usage on schema public to anon, authenticated;
grant select on public.teams, public.matches to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.pools to authenticated;
grant select, insert, update, delete on public.pool_members to authenticated;
grant select, insert, update, delete on public.predictions to authenticated;
grant select, insert, update, delete on public.bracket_predictions to authenticated;
grant select, insert, update, delete on public.special_predictions to authenticated;
grant select on public.scores to authenticated;
grant all on all tables in schema public to service_role;
grant usage on schema app to authenticated, service_role;
grant execute on function app.is_pool_member(uuid, uuid) to authenticated, service_role;
grant execute on function app.is_pool_owner(uuid, uuid) to authenticated, service_role;

insert into public.teams (code, name_nl, group_letter, sort_order) values
  ('MEX', 'Mexico', 'A', 1), ('RSA', 'Zuid-Afrika', 'A', 2), ('KOR', 'Zuid-Korea', 'A', 3), ('CZE', 'Tsjechie', 'A', 4),
  ('CAN', 'Canada', 'B', 1), ('BIH', 'Bosnie en Herzegovina', 'B', 2), ('QAT', 'Qatar', 'B', 3), ('SUI', 'Zwitserland', 'B', 4),
  ('BRA', 'Brazilie', 'C', 1), ('MAR', 'Marokko', 'C', 2), ('HAI', 'Haiti', 'C', 3), ('SCO', 'Schotland', 'C', 4),
  ('USA', 'Verenigde Staten', 'D', 1), ('PAR', 'Paraguay', 'D', 2), ('AUS', 'Australie', 'D', 3), ('TUR', 'Turkije', 'D', 4),
  ('GER', 'Duitsland', 'E', 1), ('CUW', 'Curacao', 'E', 2), ('CIV', 'Ivoorkust', 'E', 3), ('ECU', 'Ecuador', 'E', 4),
  ('NED', 'Nederland', 'F', 1), ('JPN', 'Japan', 'F', 2), ('SWE', 'Zweden', 'F', 3), ('TUN', 'Tunesie', 'F', 4),
  ('BEL', 'Belgie', 'G', 1), ('EGY', 'Egypte', 'G', 2), ('IRN', 'Iran', 'G', 3), ('NZL', 'Nieuw-Zeeland', 'G', 4),
  ('ESP', 'Spanje', 'H', 1), ('CPV', 'Kaapverdie', 'H', 2), ('KSA', 'Saoedi-Arabie', 'H', 3), ('URU', 'Uruguay', 'H', 4),
  ('FRA', 'Frankrijk', 'I', 1), ('SEN', 'Senegal', 'I', 2), ('IRQ', 'Irak', 'I', 3), ('NOR', 'Noorwegen', 'I', 4),
  ('ARG', 'Argentinie', 'J', 1), ('ALG', 'Algerije', 'J', 2), ('AUT', 'Oostenrijk', 'J', 3), ('JOR', 'Jordanie', 'J', 4),
  ('POR', 'Portugal', 'K', 1), ('COD', 'Congo DR', 'K', 2), ('UZB', 'Oezbekistan', 'K', 3), ('COL', 'Colombia', 'K', 4),
  ('ENG', 'Engeland', 'L', 1), ('CRO', 'Kroatie', 'L', 2), ('GHA', 'Ghana', 'L', 3), ('PAN', 'Panama', 'L', 4);

insert into public.matches (id, group_letter, starts_at, venue, home_code, away_code) values
  (1, 'A', '2026-06-11 15:00:00-04', 'Mexico City', 'MEX', 'RSA'),
  (2, 'A', '2026-06-11 22:00:00-04', 'Guadalajara', 'KOR', 'CZE'),
  (3, 'B', '2026-06-12 15:00:00-04', 'Toronto', 'CAN', 'BIH'),
  (4, 'D', '2026-06-12 21:00:00-04', 'Los Angeles', 'USA', 'PAR'),
  (5, 'C', '2026-06-13 21:00:00-04', 'Boston', 'HAI', 'SCO'),
  (6, 'D', '2026-06-14 00:00:00-04', 'Vancouver', 'AUS', 'TUR'),
  (7, 'C', '2026-06-13 18:00:00-04', 'New York New Jersey', 'BRA', 'MAR'),
  (8, 'B', '2026-06-13 15:00:00-04', 'San Francisco Bay Area', 'QAT', 'SUI'),
  (9, 'E', '2026-06-14 19:00:00-04', 'Philadelphia', 'CIV', 'ECU'),
  (10, 'E', '2026-06-14 13:00:00-04', 'Houston', 'GER', 'CUW'),
  (11, 'F', '2026-06-14 16:00:00-04', 'Dallas', 'NED', 'JPN'),
  (12, 'F', '2026-06-14 22:00:00-04', 'Monterrey', 'SWE', 'TUN'),
  (13, 'H', '2026-06-15 18:00:00-04', 'Miami', 'KSA', 'URU'),
  (14, 'H', '2026-06-15 12:00:00-04', 'Atlanta', 'ESP', 'CPV'),
  (15, 'G', '2026-06-15 21:00:00-04', 'Los Angeles', 'IRN', 'NZL'),
  (16, 'G', '2026-06-15 15:00:00-04', 'Seattle', 'BEL', 'EGY'),
  (17, 'I', '2026-06-16 15:00:00-04', 'New York New Jersey', 'FRA', 'SEN'),
  (18, 'I', '2026-06-16 18:00:00-04', 'Boston', 'IRQ', 'NOR'),
  (19, 'J', '2026-06-16 21:00:00-04', 'Kansas City', 'ARG', 'ALG'),
  (20, 'J', '2026-06-17 00:00:00-04', 'San Francisco Bay Area', 'AUT', 'JOR'),
  (21, 'L', '2026-06-17 19:00:00-04', 'Toronto', 'GHA', 'PAN'),
  (22, 'L', '2026-06-17 16:00:00-04', 'Dallas', 'ENG', 'CRO'),
  (23, 'K', '2026-06-18 13:00:00-04', 'Houston', 'POR', 'COD'),
  (24, 'K', '2026-06-18 22:00:00-04', 'Mexico City', 'UZB', 'COL'),
  (25, 'A', '2026-06-19 12:00:00-04', 'Atlanta', 'CZE', 'RSA'),
  (26, 'B', '2026-06-19 15:00:00-04', 'Los Angeles', 'SUI', 'BIH'),
  (27, 'B', '2026-06-19 18:00:00-04', 'Vancouver', 'CAN', 'QAT'),
  (28, 'A', '2026-06-19 21:00:00-04', 'Guadalajara', 'MEX', 'KOR'),
  (29, 'C', '2026-06-20 20:30:00-04', 'Philadelphia', 'BRA', 'HAI'),
  (30, 'C', '2026-06-20 18:00:00-04', 'Boston', 'SCO', 'MAR'),
  (31, 'D', '2026-06-20 23:00:00-04', 'San Francisco Bay Area', 'TUR', 'PAR'),
  (32, 'D', '2026-06-20 15:00:00-04', 'Seattle', 'USA', 'AUS'),
  (33, 'E', '2026-06-21 16:00:00-04', 'Toronto', 'GER', 'CIV'),
  (34, 'E', '2026-06-21 20:00:00-04', 'Kansas City', 'ECU', 'CUW'),
  (35, 'F', '2026-06-21 13:00:00-04', 'Houston', 'NED', 'SWE'),
  (36, 'F', '2026-06-22 00:00:00-04', 'Monterrey', 'TUN', 'JPN'),
  (37, 'H', '2026-06-22 18:00:00-04', 'Miami', 'URU', 'CPV'),
  (38, 'H', '2026-06-22 12:00:00-04', 'Atlanta', 'ESP', 'KSA'),
  (39, 'G', '2026-06-22 15:00:00-04', 'Los Angeles', 'BEL', 'IRN'),
  (40, 'G', '2026-06-22 21:00:00-04', 'Vancouver', 'NZL', 'EGY'),
  (41, 'I', '2026-06-23 20:00:00-04', 'New York New Jersey', 'NOR', 'SEN'),
  (42, 'I', '2026-06-23 17:00:00-04', 'Philadelphia', 'FRA', 'IRQ'),
  (43, 'J', '2026-06-23 13:00:00-04', 'Dallas', 'ARG', 'AUT'),
  (44, 'J', '2026-06-23 23:00:00-04', 'San Francisco Bay Area', 'JOR', 'ALG'),
  (45, 'L', '2026-06-24 16:00:00-04', 'Boston', 'ENG', 'GHA'),
  (46, 'L', '2026-06-24 19:00:00-04', 'Toronto', 'PAN', 'CRO'),
  (47, 'K', '2026-06-24 13:00:00-04', 'Houston', 'POR', 'UZB'),
  (48, 'K', '2026-06-24 22:00:00-04', 'Guadalajara', 'COL', 'COD'),
  (49, 'C', '2026-06-24 18:00:00-04', 'Miami', 'SCO', 'BRA'),
  (50, 'C', '2026-06-24 18:00:00-04', 'Atlanta', 'MAR', 'HAI'),
  (51, 'B', '2026-06-24 15:00:00-04', 'Vancouver', 'SUI', 'CAN'),
  (52, 'B', '2026-06-24 15:00:00-04', 'Seattle', 'BIH', 'QAT'),
  (53, 'A', '2026-06-24 21:00:00-04', 'Mexico City', 'CZE', 'MEX'),
  (54, 'A', '2026-06-24 21:00:00-04', 'Monterrey', 'RSA', 'KOR'),
  (55, 'E', '2026-06-25 16:00:00-04', 'Philadelphia', 'CUW', 'CIV'),
  (56, 'E', '2026-06-25 16:00:00-04', 'New York New Jersey', 'ECU', 'GER'),
  (57, 'F', '2026-06-25 19:00:00-04', 'Dallas', 'JPN', 'SWE'),
  (58, 'F', '2026-06-25 19:00:00-04', 'Kansas City', 'TUN', 'NED'),
  (59, 'D', '2026-06-25 22:00:00-04', 'Los Angeles', 'TUR', 'USA'),
  (60, 'D', '2026-06-25 22:00:00-04', 'San Francisco Bay Area', 'PAR', 'AUS'),
  (61, 'I', '2026-06-26 15:00:00-04', 'Boston', 'NOR', 'FRA'),
  (62, 'I', '2026-06-26 15:00:00-04', 'Toronto', 'SEN', 'IRQ'),
  (63, 'G', '2026-06-26 23:00:00-04', 'Seattle', 'EGY', 'IRN'),
  (64, 'G', '2026-06-26 23:00:00-04', 'Vancouver', 'NZL', 'BEL'),
  (65, 'H', '2026-06-26 20:00:00-04', 'Houston', 'CPV', 'KSA'),
  (66, 'H', '2026-06-26 20:00:00-04', 'Guadalajara', 'URU', 'ESP'),
  (67, 'L', '2026-06-27 17:00:00-04', 'New York New Jersey', 'PAN', 'ENG'),
  (68, 'L', '2026-06-27 17:00:00-04', 'Philadelphia', 'CRO', 'GHA'),
  (69, 'J', '2026-06-27 22:00:00-04', 'Kansas City', 'ALG', 'AUT'),
  (70, 'J', '2026-06-27 22:00:00-04', 'Dallas', 'JOR', 'ARG'),
  (71, 'K', '2026-06-27 19:30:00-04', 'Miami', 'COL', 'POR'),
  (72, 'K', '2026-06-27 19:30:00-04', 'Atlanta', 'COD', 'UZB');
