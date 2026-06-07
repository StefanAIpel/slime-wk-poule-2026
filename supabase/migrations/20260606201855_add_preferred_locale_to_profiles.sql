alter table public.profiles
  add column if not exists preferred_locale text;

alter table public.profiles
  drop constraint if exists profiles_preferred_locale_check,
  add constraint profiles_preferred_locale_check
    check (preferred_locale in ('nl', 'en'));
