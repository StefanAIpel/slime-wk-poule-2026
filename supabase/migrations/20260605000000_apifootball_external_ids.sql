-- Koppeling met API-Football (api-sports.io) voor automatische uitslagen (#71).
--
-- We bewaren per wedstrijd en per land de externe id van de provider, zodat de
-- sync-worker een API-fixture eenduidig naar onze match.id en teams.code kan
-- vertalen. Beide kolommen zijn nullable en additief: zolang ze leeg zijn doet
-- de koppeling niets (de feature staat "achter een vlag" tot de backfill draait).

alter table public.matches
  add column if not exists external_id bigint;

alter table public.teams
  add column if not exists external_id bigint;

-- Een externe id mag hooguit één keer voorkomen (voorkomt dubbele mapping),
-- maar meerdere rijen mogen NULL zijn (nog niet gekoppeld).
create unique index if not exists matches_external_id_key
  on public.matches (external_id)
  where external_id is not null;

create unique index if not exists teams_external_id_key
  on public.teams (external_id)
  where external_id is not null;
