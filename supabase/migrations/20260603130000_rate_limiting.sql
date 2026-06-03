-- Atomaire rate limiting via een teller per sleutel in een tijdvenster.
-- Alleen de service-role (server-actions) gebruikt dit; clients hebben geen toegang.
create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 0,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

create or replace function public.rate_limit_hit(p_key text, p_max integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  insert into public.rate_limits(key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = case
          when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
          then 1 else public.rate_limits.count + 1 end,
        window_start = case
          when public.rate_limits.window_start < now() - make_interval(secs => p_window_seconds)
          then now() else public.rate_limits.window_start end
  returning count into v_count;
  return v_count <= p_max;
end;
$$;

-- Alleen de server (service-role) mag de limiter aanroepen, niet anon/authenticated.
revoke execute on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;
