alter table public.pools
  add column if not exists banner_path text,
  add column if not exists banner_updated_at timestamptz;

alter table public.pools drop constraint if exists pools_banner_path_format;
alter table public.pools
  add constraint pools_banner_path_format
  check (banner_path is null or banner_path ~ '^pools/[0-9a-fA-F-]+-[a-z0-9]+\.webp$');
