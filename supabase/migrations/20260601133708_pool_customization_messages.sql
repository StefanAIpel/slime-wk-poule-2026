alter table public.pools
  add column description text,
  add column badge_emoji text not null default '🏆',
  add column accent_color text not null default '#064ed6',
  add constraint pools_description_len check (description is null or char_length(description) <= 180),
  add constraint pools_badge_emoji_len check (char_length(badge_emoji) between 1 and 8),
  add constraint pools_accent_color_format check (accent_color ~ '^#[0-9A-Fa-f]{6}$');

alter table public.pool_members drop constraint pool_members_role_check;
alter table public.pool_members
  add constraint pool_members_role_check check (role in ('owner', 'moderator', 'member'));

create table public.pool_messages (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references public.pools(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 500),
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create index pool_messages_pool_created_idx on public.pool_messages (pool_id, created_at desc);

create or replace function app.can_manage_pool(pool uuid, member uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.pool_members pm
    where pm.pool_id = pool
      and pm.user_id = member
      and pm.role in ('owner', 'moderator')
  );
$$;

alter table public.pool_messages enable row level security;

create policy "members can read pool messages"
on public.pool_messages for select to authenticated
using (app.is_pool_member(pool_id));

create policy "managers can write pool messages"
on public.pool_messages for insert to authenticated
with check (author_id = auth.uid() and app.can_manage_pool(pool_id));

create policy "managers can delete pool messages"
on public.pool_messages for delete to authenticated
using (app.can_manage_pool(pool_id));

grant select, insert, delete on public.pool_messages to authenticated;
grant all on public.pool_messages to service_role;
grant execute on function app.can_manage_pool(uuid, uuid) to authenticated, service_role;
