alter table public.profiles
  add column if not exists avatar_key text not null default 'wk2026-international';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_avatar_key_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_avatar_key_check
      check (avatar_key in (
        'wk2026-international',
        'netherlands',
        'curacao',
        'mexico',
        'brazil',
        'argentina',
        'france',
        'spain',
        'england',
        'usa',
        'japan-sumo',
        'morocco-fan',
        'norway-viking',
        'scotland-fan',
        'sweden-fan',
        'switzerland-alpine',
        'turkey-fan'
      ));
  end if;
end $$;
