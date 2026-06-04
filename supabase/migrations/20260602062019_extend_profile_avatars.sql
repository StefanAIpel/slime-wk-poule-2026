alter table public.profiles
  drop constraint if exists profiles_avatar_key_check;

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
    'turkey-fan',
    'oranje-president',
    'oranje-supporter',
    'oranje-aanvoerder',
    'oranje-spelmaker',
    'appel-slime',
    'oranje-aanvaller',
    'keeper',
    'oranje-coach',
    'rode-duivel',
    'duitsland'
  ));
