-- Prevent duplicate public display names in the real rankings and pool list.
-- These are case-insensitive and ignore surrounding whitespace.
-- Existing live data was checked before applying: no duplicate non-empty nicknames or pool names.

create unique index if not exists profiles_nickname_unique_lower
  on public.profiles (lower(btrim(nickname)))
  where nickname is not null;

create unique index if not exists pools_name_unique_lower
  on public.pools (lower(btrim(name)));
