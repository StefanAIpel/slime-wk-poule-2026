-- Tighten public display-name limits for mobile ranking/poule UI.
-- Existing live data was checked before this migration:
-- max nickname 13, max team_name 16, max pool name 18.

alter table public.profiles drop constraint if exists profiles_nickname_len;
alter table public.profiles drop constraint if exists profiles_team_name_len;
alter table public.profiles
  add constraint profiles_nickname_len check (nickname is null or char_length(nickname) between 2 and 15),
  add constraint profiles_team_name_len check (team_name is null or char_length(team_name) between 2 and 25);

alter table public.pools drop constraint if exists pools_name_len;
alter table public.pools drop constraint if exists pools_name_check;
alter table public.pools
  add constraint pools_name_len check (char_length(name) between 2 and 25);
